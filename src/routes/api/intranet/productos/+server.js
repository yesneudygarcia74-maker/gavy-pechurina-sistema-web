import { json } from '@sveltejs/kit';

async function verificarAdmin(locals) {
  const { user } = await locals.safeGetSession();

  if (!user) return false;

  const { data } = await locals.supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  return data?.rol === 'admin';
}

export async function GET({ locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { data, error } = await locals.supabase
    .from('gavy_productos')
    .select('*')
    .order('orden', { ascending: true });

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ productos: data });
}

export async function POST({ request, locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const producto = await request.json();

  const { data, error } = await locals.supabase
    .from('gavy_productos')
    .insert({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      activo: true,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ correcto: true, producto: data });
}

export async function PUT({ request, locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const producto = await request.json();

  const { data, error } = await locals.supabase
    .from('gavy_productos')
    .update({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
    })
    .eq('id', producto.id)
    .select()
    .single();

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ correcto: true, producto: data });
}

export async function PATCH({ request, locals }) {
  if (!(await verificarAdmin(locals))) {
    return json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id, activo } = await request.json();

  const { error } = await locals.supabase
    .from('gavy_productos')
    .update({ activo })
    .eq('id', id);

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ correcto: true });
}
