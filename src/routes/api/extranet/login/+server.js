
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json(
				{ error: 'Completa todos los campos.' },
				{ status: 400 }
			);
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return json(
				{ error: 'Correo o contraseña incorrectos.' },
				{ status: 401 }
			);
		}

		const { data: perfil, error: errorPerfil } = await locals.supabase
			.from('perfiles')
			.select('rol')
			.eq('id', data.user.id)
			.single();

		if (errorPerfil || perfil?.rol !== 'proveedor') {
			await locals.supabase.auth.signOut({ scope: 'local' });

			return json(
				{ error: 'Esta cuenta no está autorizada como proveedor.' },
				{ status: 403 }
			);
		}

		return json({ correcto: true });
	} catch (error) {
		console.error(error);

		return json(
			{ error: 'Error al iniciar sesión.' },
			{ status: 500 }
		);
	}
}
