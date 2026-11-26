
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	try {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return json(
				{ error: 'Debes iniciar sesión.' },
				{ status: 401 }
			);
		}

		const { data: perfil, error: errorPerfil } = await locals.supabase
			.from('perfiles')
			.select('rol')
			.eq('id', user.id)
			.single();

		if (errorPerfil || perfil?.rol !== 'admin') {
			return json(
				{ error: 'No tienes permisos de administrador.' },
				{ status: 403 }
			);
		}

		const { data: proveedores, error } = await locals.supabase
			.from('perfiles')
			.select('id, nombre, email, rol')
			.in('rol', ['proveedor', 'pendiente'])
			.order('nombre', { ascending: true });

		if (error) {
			console.error(error);
			return json(
				{ error: 'No se pudieron consultar las cuentas.' },
				{ status: 500 }
			);
		}

		return json({
			correcto: true,
			proveedores: proveedores || []
		});
	} catch (error) {
		console.error(error);
		return json(
			{ error: 'Error interno del servidor.' },
			{ status: 500 }
		);
	}
}

export async function POST({ request, locals }) {
	try {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return json(
				{ error: 'Debes iniciar sesión.' },
				{ status: 401 }
			);
		}

		const { data: perfil, error: errorPerfil } = await locals.supabase
			.from('perfiles')
			.select('rol')
			.eq('id', user.id)
			.single();

		if (errorPerfil || perfil?.rol !== 'admin') {
			return json(
				{ error: 'No tienes permisos de administrador.' },
				{ status: 403 }
			);
		}

		const { proveedor_id } = await request.json();

		if (!proveedor_id) {
			return json(
				{ error: 'Falta el ID del proveedor.' },
				{ status: 400 }
			);
		}

		const { data, error } = await locals.supabase
			.from('perfiles')
			.update({ rol: 'proveedor' })
			.eq('id', proveedor_id)
			.eq('rol', 'pendiente')
			.select('id')
			.maybeSingle();

		if (error) {
			console.error(error);
			return json(
				{ error: 'No se pudo aprobar la cuenta.' },
				{ status: 500 }
			);
		}

		if (!data) {
			return json(
				{ error: 'La cuenta no existe o ya fue aprobada.' },
				{ status: 400 }
			);
		}

		return json({
			correcto: true,
			mensaje: 'Proveedor aprobado.'
		});
	} catch (error) {
		console.error(error);
		return json(
			{ error: 'Error interno del servidor.' },
			{ status: 500 }
		);
	}
}
