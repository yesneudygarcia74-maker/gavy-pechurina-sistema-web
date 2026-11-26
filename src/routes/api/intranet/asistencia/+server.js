import { json } from '@sveltejs/kit';

async function verificarAdmin(locals) {
  const { user } = await locals.safeGetSession();

  if (!user) return null;

  const { data: perfil } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  return perfil?.rol === 'admin' ? user : null;
}

export async function GET({ locals }) {
  const user = await verificarAdmin(locals);

  if (!user) return json({ error: 'No autorizado.' }, { status: 401 });

  const { data, error } = await locals.supabase
    .from('asistencia')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ asistencias: data });
}

export async function POST({ request, locals }) {
  const user = await verificarAdmin(locals);

  if (!user) return json({ error: 'No autorizado.' }, { status: 401 });

  const { observacion } = await request.json();

  const ahora = new Date();

  const { data, error } = await locals.supabase
    .from('asistencia')
    .insert({
      usuario_id: user.id,
      fecha: ahora.toISOString().slice(0, 10),
      hora_entrada: ahora.toISOString(),
      estado: 'presente',
      observacion: observacion || null,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ correcto: true, asistencia: data });
}

export async function PATCH({ request, locals }) {
  const user = await verificarAdmin(locals);

  if (!user) return json({ error: 'No autorizado.' }, { status: 401 });

  const { id } = await request.json();

  const { data, error } = await locals.supabase
    .from('asistencia')
    .update({
      hora_salida: new Date().toISOString(),
    })
    .eq('id', id)
    .is('hora_salida', null)
    .select()
    .single();

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ correcto: true, asistencia: data });
}
