import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekbryzykxdcvqoqpzybk.supabase.co',
  'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy'
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('gavy_pedidos')
      .select(
        `
				id,
				nombre_cliente,
				telefono,
				direccion,
				notas,
				total,
				estado,
				created_at,
				gavy_pedido_items (
					id,
					nombre,
					opcion,
					cantidad,
					precio_unit
				)
			`
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error consultando pedidos:', error.message);

      return json(
        { error: 'No se pudieron consultar los pedidos.' },
        { status: 500 }
      );
    }

    return json({
      correcto: true,
      pedidos: data,
    });
  } catch (error) {
    console.error(error);

    return json(
      { error: 'Error interno al consultar los pedidos.' },
      { status: 500 }
    );
  }
}
