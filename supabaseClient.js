import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyzdlvpjtwpvukasbsfw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emRsdnBqdHdwdnVrYXNic2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTMxMzgsImV4cCI6MjA3NzM2OTEzOH0.lbonwb-GTm-oGlUkE5GZVxU4e3ks0JYrszIOuPUMiPY'

export const supabase = createClient(supabaseUrl, supabaseKey)
