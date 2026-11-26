import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
  try {
    const { error } = await locals.supabase.auth.signOut({
      scope: 'local',
    });

    if (error) {
      console.error('Error cerrando sesión:', error.message);
      return json({ error: error.message }, { status: 500 });
    }

    return json({ correcto: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Error interno al cerrar sesión.' }, { status: 500 });
  }
}
