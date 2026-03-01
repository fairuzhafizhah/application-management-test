import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401 })
  }

  const { data: raw, error: err } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      role_id:role,
      role:role(role)
    `)
    .order('id', { ascending: true })

  if (err) {
    throw createError({ statusCode: 400, statusMessage: err.message })
  }

  return raw.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role?.role,   // string untuk tabel
    role_id: u.role_id    // number untuk dropdown
  }))
})