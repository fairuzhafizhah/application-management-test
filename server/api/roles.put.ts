import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // only admin allowed
  if (!event.context.user || event.context.user.role !== 'admin') {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)
  const { id, role } = body
  if (!id || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id or role' })
  }

  const { error } = await supabase
    .from('role')
    .update({ role })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { message: 'Role updated' }
})