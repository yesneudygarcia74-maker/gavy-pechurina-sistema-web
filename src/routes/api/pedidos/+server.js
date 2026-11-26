import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekbryzykxdcvqoqpzybk.supabase.co',
  'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy'
);

export async function POST({ request }) {
  try {
    const datos = await request.json();

    const {
      nombreCliente,
      telefonoCliente,
      direccionCliente,
      notasPedido,
      items,
    } = datos;

    if (
      !nombreCliente?.trim() ||
      !telefonoCliente?.trim() ||
      !direccionCliente?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return json(
        { error: 'Completa los datos y agrega productos al carrito.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('crear_pedido_invitado', {
      p_nombre: nombreCliente,
      p_telefono: telefonoCliente,
      p_direccion: direccionCliente,
      p_notas: notasPedido || '',
      p_items: items,
    });

    if (error) {
      console.error('Error al guardar pedido:', error.message);

      return json(
        { error: 'No se pudo registrar el pedido. Inténtalo nuevamente.' },
        { status: 400 }
      );
    }

    return json({
      correcto: true,
      pedidoId: data,
      mensaje: '¡Tu pedido fue registrado correctamente!',
    });
  } catch (error) {
    console.error(error);

    return json(
      { error: 'Ocurrió un error al procesar el pedido.' },
      { status: 500 }
    );
  }
}
