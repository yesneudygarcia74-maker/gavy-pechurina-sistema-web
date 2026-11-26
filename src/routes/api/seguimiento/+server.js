import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekbryzykxdcvqoqpzybk.supabase.co',
  'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy'
);

export async function POST({ request }) {
  try {
    const { pedidoId, telefono } = await request.json();

    if (!pedidoId?.trim() || !telefono?.trim()) {
      return json(
        { error: 'Escribe el número del pedido y el teléfono.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('consultar_pedido_invitado', {
      p_pedido_id: pedidoId.trim(),
      p_telefono: telefono.trim(),
    });

    if (error) {
      console.error('Error consultando pedido:', error.message);
      return json(
        { error: 'No se pudo consultar el pedido.' },
        { status: 500 }
      );
    }

    if (!data) {
      return json(
        { error: 'No encontramos un pedido con esos datos.' },
        { status: 404 }
      );
    }

    return json({ pedido: data });
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Ocurrió un error al consultar el pedido.' },
      { status: 500 }
    );
  }
}
