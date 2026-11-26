import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { data, error } = await locals.supabase
    .from('gavy_pedidos')
    .select(
      `
			id,
			created_at,
			total,
			estado,
			gavy_pedido_items (
				nombre,
				opcion,
				cantidad,
				precio_unit
			)
		`
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return json({ error: 'No se pudo cargar el historial.' }, { status: 500 });
  }

  return json({ pedidos: data || [] });
}
