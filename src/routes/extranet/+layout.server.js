import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  const rutaPublica =
    url.pathname === '/extranet/login' || url.pathname === '/extranet/registro';

  if (rutaPublica) return {};

  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, '/extranet/login');
  }

  const { data: perfil, error } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (error || perfil?.rol !== 'cliente') {
    await locals.supabase.auth.signOut({ scope: 'local' });
    throw redirect(303, '/extranet/login');
  }

  return { user };
}
