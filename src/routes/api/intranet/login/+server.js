import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  const { email, password } = await request.json();

  const { data, error } = await locals.supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return json({ error: 'Credenciales incorrectas.' }, { status: 401 });
  }

  const { data: perfil, error: errorPerfil } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', data.user.id)
    .single();

  if (errorPerfil || perfil?.rol !== 'admin') {
    await locals.supabase.auth.signOut();
    return json(
      { error: 'No tienes permisos de administrador.' },
      { status: 403 }
    );
  }

  return json({ correcto: true });
}
