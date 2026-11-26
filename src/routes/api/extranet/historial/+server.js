
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
			.not('fecha_entrega', 'is', null)
			.order('fecha_entrega', { ascending: false });

		if (error) {
			console.error(error);
			return json(
				{ error: 'No se pudo cargar el historial.' },
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
			{ error: 'Error interno al consultar el historial.' },
			{ status: 500 }
		);
	}
}
