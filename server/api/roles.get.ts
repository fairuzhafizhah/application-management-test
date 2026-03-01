import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // any authenticated user may read the available roles
  if (!event.context.user) {
    throw createError({ statusCode: 401 })
  }

  const { data, error } = await supabase
    .from('role')
    .select('id, role')
    .order('id', { ascending: true })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})