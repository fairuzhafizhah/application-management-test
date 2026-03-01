import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // ensure the request is authenticated (any role allowed)
  if (!event.context.user) {
    throw createError({ statusCode: 401 })
  }

  // fetch all users using Supabase and include role name via join
  const { data: raw, error: err } = await supabase
    .from('users')
    .select('id, name, email, role:role(role)')
    .order('id', { ascending: true })

  if (err) {
    throw createError({ statusCode: 400, statusMessage: err.message })
  }

  if (raw && Array.isArray(raw)) {
    return raw.map((u: any) => ({
      ...u,
      role: u.role && typeof u.role === 'object' ? u.role.role : u.role
    }))
  }
  return []

})