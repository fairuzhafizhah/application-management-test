import bcrypt from 'bcrypt'
import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // console.log('USER CONTEXT:', event.context.user)
  // only admin allowed
  if (!event.context.user || event.context.user.role !== 'Admin') {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)
  const { id, name, email, role, password } = body
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const updates: any = {}
  if (name) updates.name = name
  if (email) updates.email = email
  if (role) {
    updates.role = role
  }
  if (password) {
    updates.password = await bcrypt.hash(password, 10)
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})