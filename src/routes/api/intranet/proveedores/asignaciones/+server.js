
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

export async function GET({ url, locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const proveedor_id = url.searchParams.get('proveedor_id');

	if (!proveedor_id) {
		return json({ error: 'Falta el proveedor.' }, { status: 400 });
	}

	const { data: productos, error: errorProductos } = await locals.supabase
		.from('gavy_productos')
		.select('id, nombre, categoria')
		.eq('activo', true)
		.order('nombre');

	if (errorProductos) {
		return json({ error: errorProductos.message }, { status: 500 });
	}

	const { data: asignados, error: errorAsignados } = await locals.supabase
		.from('proveedor_productos')
		.select('producto_id')
		.eq('proveedor_id', proveedor_id);

	if (errorAsignados) {
		return json({ error: errorAsignados.message }, { status: 500 });
	}

	return json({
		correcto: true,
		productos: productos || [],
		asignados: (asignados || []).map(p => p.producto_id)
	});
}

export async function POST({ request, locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const { proveedor_id, producto_id } = await request.json();

	if (!proveedor_id || !producto_id) {
		return json({ error: 'Faltan datos.' }, { status: 400 });
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

	const { error } = await locals.supabase
		.from('proveedor_productos')
		.insert({ proveedor_id, producto_id });

	if (error && error.code !== '23505') {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ correcto: true, mensaje: 'Producto asignado.' });
}

export async function DELETE({ request, locals }) {
	if (!(await verificarAdmin(locals))) {
		return json({ error: 'No tienes permisos.' }, { status: 403 });
	}

	const { proveedor_id, producto_id } = await request.json();

	if (!proveedor_id || !producto_id) {
		return json({ error: 'Faltan datos.' }, { status: 400 });
	}

	const { error } = await locals.supabase
		.from('proveedor_productos')
		.delete()
		.eq('proveedor_id', proveedor_id)
		.eq('producto_id', producto_id);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ correcto: true, mensaje: 'Asignación eliminada.' });
}
