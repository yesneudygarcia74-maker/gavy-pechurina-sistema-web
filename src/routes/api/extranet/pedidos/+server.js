import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  try {
    const { user } = await locals.safeGetSession();

    if (!user) {
      return json({ error: 'Debes iniciar sesión.' }, { status: 401 });
    }

    const { data: perfil } = await locals.supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfil?.rol !== 'cliente') {
      return json({ error: 'No autorizado.' }, { status: 403 });
    }

    const { nombre_cliente, telefono, direccion, notas, items } =
      await request.json();

    if (
      !nombre_cliente ||
      !telefono ||
      !direccion ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return json({ error: 'Completa los datos del pedido.' }, { status: 400 });
    }

    const ids = [...new Set(items.map((item) => Number(item.producto_id)))];

    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      return json({ error: 'Hay productos inválidos.' }, { status: 400 });
    }

    const { data: productos, error: errorProductos } = await locals.supabase
      .from('gavy_productos')
      .select('id, nombre, precio, activo')
      .in('id', ids)
      .eq('activo', true);

    if (errorProductos || productos.length !== ids.length) {
      return json(
        { error: 'Uno de los productos no está disponible.' },
        { status: 400 }
      );
    }

    const detalles = items.map((item) => {
      const producto = productos.find((p) => p.id === Number(item.producto_id));
      const cantidad = Number(item.cantidad);

      if (
        !producto ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > 50
      ) {
        throw new Error('Revisa los productos y las cantidades.');
      }

      return {
        producto_id: producto.id,
        nombre: producto.nombre,
        opcion: String(item.opcion || ''),
        cantidad,
        precio_unit: producto.precio,
      };
    });

    const total = detalles.reduce(
      (suma, item) => suma + Number(item.precio_unit) * item.cantidad,
      0
    );

    const { data: pedido, error: errorPedido } = await locals.supabase
      .from('gavy_pedidos')
      .insert({
        user_id: user.id,
        nombre_cliente,
        telefono,
        direccion,
        notas: notas || '',
        total,
        estado: 'Pendiente',
      })
      .select('id')
      .single();

    if (errorPedido) throw errorPedido;

    const { error: errorItems } = await locals.supabase
      .from('gavy_pedido_items')
      .insert(
        detalles.map((item) => ({
          ...item,
          pedido_id: pedido.id,
        }))
      );

    if (errorItems) {
      await locals.supabase.from('gavy_pedidos').delete().eq('id', pedido.id);

      throw errorItems;
    }

    return json({ correcto: true, mensaje: 'Pedido realizado correctamente.' });
  } catch (error) {
    console.error(error);
    return json(
      { error: error.message || 'No se pudo realizar el pedido.' },
      { status: 500 }
    );
  }
}
