import bcrypt from 'bcrypt'
import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // only authenticated admins and managers may create users
  if (!event.context.user || !['Admin','Manager'].includes(event.context.user.role)) {
    throw createError({ statusCode: 403 })
  }

  const body = await readBody(event)

  const hashed = await bcrypt.hash(body.password, 10)

  // determine role name based on creator privileges
  const allowed = ['User','Admin','Manager']
  let roleName = 'User'
  if (event.context.user.role === 'Admin') {
    if (body.role && allowed.includes(body.role)) {
      roleName = body.role
    }
  } else {
    // manager: always assign basic user role
    roleName = 'User'
  }

  // resolve role name to id in the roles table
  const { data: roleRow, error: roleErr } = await supabase
    .from('roles')
    .select('id')
    .eq('role', roleName)
    .single()

  if (roleErr || !roleRow) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
  }

  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: body.name,
        email: body.email,
        password: hashed,
        role: roleRow.id
      }
    ])

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return { message: 'User created' }
})