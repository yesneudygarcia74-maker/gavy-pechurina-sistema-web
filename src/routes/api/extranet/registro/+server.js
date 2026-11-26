
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	try {
		const { nombre, email, password, telefono } = await request.json();

		if (!nombre || !email || !password || !telefono) {
			return json(
				{ error: 'Completa todos los campos.' },
				{ status: 400 }
			);
		}

		if (password.length < 6) {
			return json(
				{ error: 'La contraseña debe tener al menos 6 caracteres.' },
				{ status: 400 }
			);
		}

		const { data, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					nombre,
					telefono,
					tipo_cuenta: 'proveedor'
				}
			}
		});

		if (error) {
			return json({ error: error.message }, { status: 400 });
		}

		if (!data.user) {
			return json(
				{ error: 'No se pudo crear la cuenta.' },
				{ status: 400 }
			);
		}

		if (data.session) {
			await locals.supabase.auth.signOut({ scope: 'local' });
		}

		return json({
			correcto: true,
			mensaje: 'Solicitud de registro de proveedor creada. La cuenta deberá ser aprobada por el administrador.'
		});
	} catch (error) {
		console.error(error);
		return json(
			{ error: 'Error al registrar la cuenta.' },
			{ status: 500 }
		);
	}
}
