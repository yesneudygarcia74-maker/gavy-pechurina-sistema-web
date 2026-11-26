
import { json } from '@sveltejs/kit';

async function verificarAdmin(locals) {
	const { user } = await locals.safeGetSession();

	if (!user) return false;

	const { data: perfil } = await locals.supabase
		.from('perfiles')
		.select('rol')
		.eq('id', user.id)
		.single();

	return perfil?.rol === 'admin';
}

export async function GET({ locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const { data, error } = await locals.supabase
		.from('proveedor_entregas')
		.select('id, proveedor_id, descripcion, estado, fecha_asignacion, fecha_entrega, observacion')
		.order('fecha_asignacion', { ascending: false });

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ correcto: true, entregas: data || [] });
}

export async function POST({ request, locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const { proveedor_id, descripcion } = await request.json();

	if (!proveedor_id || !descripcion?.trim()) {
		return json({ error: 'Completa todos los campos.' }, { status: 400 });
	}

	const { data: proveedor } = await locals.supabase
		.from('perfiles')
		.select('id')
		.eq('id', proveedor_id)
		.eq('rol', 'proveedor')
		.maybeSingle();

	if (!proveedor) {
		return json({ error: 'El proveedor no está autorizado.' }, { status: 400 });
	}

	const { data, error } = await locals.supabase
		.from('proveedor_entregas')
		.insert({
			proveedor_id,
			descripcion: descripcion.trim(),
			estado: 'Pendiente'
		})
		.select()
		.single();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ correcto: true, entrega: data });
}

export async function PATCH({ request, locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const { entrega_id, estado, observacion } = await request.json();

	if (!entrega_id || !['Pendiente', 'Entregado'].includes(estado)) {
		return json({ error: 'Datos de entrega inválidos.' }, { status: 400 });
	}

	const actualizacion = {
		estado,
		fecha_entrega: estado === 'Entregado' ? new Date().toISOString() : null,
		observacion: observacion || null
	};

	const { data, error } = await locals.supabase
		.from('proveedor_entregas')
		.update(actualizacion)
		.eq('id', entrega_id)
		.select()
		.single();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ correcto: true, entrega: data });
}
