import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ffbltnjqcvkfmyvbabou.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYmx0bmpxY3ZrZm15dmJhYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNDUyNTMsImV4cCI6MjA1ODgyMTI1M30.RUMy-g1CXgKaauicw4Y5y7fJPOXETQ650g7sdnWJ024'

export const supabase = createClient(supabaseUrl,supabaseKey)