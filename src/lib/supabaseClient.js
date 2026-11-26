import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekbryzykxdcvqoqpzybk.supabase.co';

const supabaseKey = 'sb_publishable_Hv1YXPqF6V31uXLrHRVXSQ_oQl1OTRy';

export const supabase = createClient(supabaseUrl, supabaseKey);
