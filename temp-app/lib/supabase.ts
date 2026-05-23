import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dbcthtjmtlumidpbucrc.supabase.co'
const supabaseAnonKey = 'sb_publishable_3h7cO2Z8CDxZyEKDLRzvtg_1UJCLldJ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
