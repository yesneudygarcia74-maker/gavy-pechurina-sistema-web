import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  if (url.pathname === '/intranet/login') {
    return {};
  }

  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, '/intranet/login');
  }

  const { data: perfil, error } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (error || perfil?.rol !== 'admin') {
    await locals.supabase.auth.signOut();
    throw redirect(303, '/intranet/login');
  }

  return { user };
}
