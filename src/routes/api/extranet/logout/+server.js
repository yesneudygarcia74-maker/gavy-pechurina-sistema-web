import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
  try {
    const { error } = await locals.supabase.auth.signOut({
      scope: 'local',
    });

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ correcto: true });
  } catch {
    return json({ error: 'Error al cerrar sesión.' }, { status: 500 });
  }
}
