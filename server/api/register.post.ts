import bcrypt from 'bcrypt'
import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {

  // Only Admin & Manager allowed
  if (
    !event.context.user ||
    !['Admin', 'Manager'].includes(event.context.user.role)
  ) {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)

  if (!body.name || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, email and password are required'
    })
  }

  const hashed = await bcrypt.hash(body.password, 10)

  let roleId = body.role

  // If creator is Manager, force role to "User"
  if (event.context.user.role === 'Manager') {

    const { data: userRole, error: roleErr } = await supabase
      .from('roles')
      .select('id')
      .eq('role', 'User')
      .single()

    if (roleErr || !userRole) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Default user role not found'
      })
    }

    roleId = userRole.id
  }

  // Basic validation for Admin case
  if (!roleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid role'
    })
  }

  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: body.name,
        email: body.email,
        password: hashed,
        role: roleId
      }
    ])

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return { message: 'User created successfully' }
})