import { json } from '@sveltejs/kit';

async function verificarAdmin(locals) {
  const { user } = await locals.safeGetSession();
  if (!user) return false;

  const { data } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  return data?.rol === 'admin';
}

export async function GET({ locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { data: facturas, error } = await locals.supabase
    .from('facturacion')
    .select('*')
    .order('fecha_emision', { ascending: false });

  if (error) return json({ error: error.message }, { status: 500 });

  const { data: pedidos, error: errorPedidos } = await locals.supabase
    .from('gavy_pedidos')
    .select('id, nombre_cliente, telefono, direccion, total')
    .order('created_at', { ascending: false });

  if (errorPedidos) {
    return json({ error: errorPedidos.message }, { status: 500 });
  }

  const pedidosFacturados = new Set(
    facturas.map((factura) => factura.pedido_id)
  );

  const pendientes = pedidos.filter(
    (pedido) => !pedidosFacturados.has(pedido.id)
  );

  return json({
    facturas,
    pedidos: pendientes,
  });
}

export async function POST({ request, locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { pedido_id } = await request.json();

  if (!pedido_id) {
    return json({ error: 'Selecciona un pedido.' }, { status: 400 });
  }

  const { data: pedido, error: errorPedido } = await locals.supabase
    .from('gavy_pedidos')
    .select('id, nombre_cliente, telefono, direccion, total')
    .eq('id', pedido_id)
    .single();

  if (errorPedido || !pedido) {
    return json({ error: 'No se encontró el pedido.' }, { status: 404 });
  }

  const { data: existente } = await locals.supabase
    .from('facturacion')
    .select('id')
    .eq('pedido_id', pedido_id)
    .maybeSingle();

  if (existente) {
    return json(
      { error: 'Este pedido ya tiene una factura.' },
      { status: 409 }
    );
  }

  const numero = `GAV-${Date.now()}`;

  const { data: factura, error } = await locals.supabase
    .from('facturacion')
    .insert({
      pedido_id: pedido.id,
      numero_factura: numero,
      cliente: pedido.nombre_cliente,
      telefono: pedido.telefono,
      direccion: pedido.direccion,
      subtotal: pedido.total,
      total: pedido.total,
      estado: 'Pendiente',
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ correcto: true, factura });
}
