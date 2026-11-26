import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = 'https://ekbryzykxdcvqoqpzybk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy';

export async function handle({ event, resolve }) {
  event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, {
            ...options,
            path: '/',
          });
        });
      },
    },
  });

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) return { session: null, user: null };

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error) return { session: null, user: null };

    return { session, user };
  };

  return resolve(event);
}
