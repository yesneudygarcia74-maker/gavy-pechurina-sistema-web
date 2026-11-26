import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
  try {
    const { data: productos, error } = await locals.supabase
      .from('gavy_productos')
      .select('id, nombre, descripcion, precio, categoria, opciones, activo')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error cargando productos:', error.message);
      return json(
        { error: 'No se pudieron cargar los productos.' },
        { status: 500 }
      );
    }

    return json({ correcto: true, productos });
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Error interno al consultar productos.' },
      { status: 500 }
    );
  }
}
