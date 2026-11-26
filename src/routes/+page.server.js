import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekbryzykxdcvqoqpzybk.supabase.co',
  'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy'
);

export async function load() {
  const { data, error } = await supabase
    .from('gavy_productos')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) {
    console.error('Error de Supabase:', error.message);

    return {
      productos: [],
      error: 'No se pudo cargar el menú.',
    };
  }

  return {
    productos: data ?? [],
    error: null,
  };
}
