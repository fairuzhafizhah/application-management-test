import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // only admin
  if (!event.context.user || event.context.user.role !== 'admin') {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)
  const { id } = body
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { message: 'deleted' }
})