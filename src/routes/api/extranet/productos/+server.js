
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

		// Consultar los productos asignados al proveedor
		const { data: asignaciones, error: errorAsignaciones } =
			await locals.supabase
				.from('proveedor_productos')
				.select('producto_id')
				.eq('proveedor_id', user.id);

		if (errorAsignaciones) {
			console.error(errorAsignaciones);
			return json(
				{ error: 'No se pudieron consultar tus productos asignados.' },
				{ status: 500 }
			);
		}

		const ids = (asignaciones || []).map(item => item.producto_id);

		if (ids.length === 0) {
			return json({ correcto: true, productos: [] });
		}

		// Obtener solamente los productos asignados
		const { data: productos, error } = await locals.supabase
			.from('gavy_productos')
			.select('id, nombre, descripcion, precio, categoria, opciones, activo')
			.in('id', ids);

		if (error) {
			console.error(error);
			return json(
				{ error: 'No se pudieron cargar los productos.' },
				{ status: 500 }
			);
		}

		return json({
			correcto: true,
			productos: productos || []
		});
	} catch (error) {
		console.error(error);
		return json(
			{ error: 'Error interno al consultar productos.' },
			{ status: 500 }
		);
	}
}
