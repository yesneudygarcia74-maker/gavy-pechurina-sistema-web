
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

		if (errorPerfil || perfil?.rol !== 'proveedor') {
			return json(
				{ error: 'No tienes autorización.' },
				{ status: 403 }
			);
		}

		const { data: entregas, error } = await locals.supabase
			.from('proveedor_entregas')
			.select('*')
			.eq('proveedor_id', user.id)
			.is('fecha_entrega', null)
			.order('fecha_asignacion', { ascending: false });

		if (error) {
			console.error(error);
			return json(
				{ error: 'No se pudieron cargar las entregas.' },
				{ status: 500 }
			);
		}

		return json({
			correcto: true,
			entregas: entregas || []
		});
	} catch (error) {
		console.error(error);
		return json(
			{ error: 'Error interno al consultar entregas.' },
			{ status: 500 }
		);
	}
}
