import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // only admin allowed
  if (!event.context.user || event.context.user.role !== 'admin') {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)
  if (!body.role) {
    throw createError({ statusCode: 400, statusMessage: 'Role name is required' })
  }

  const { error } = await supabase
    .from('role')
    .insert([{ role: body.role }])

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { message: 'Role created' }
})