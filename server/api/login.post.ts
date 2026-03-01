import bcrypt from 'bcrypt'
import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // join with roles table to fetch role name
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role:role (role), password')
    .eq('email', body.email)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  // compare password: support both hashed and plain-text entries
  let valid = false
  if (typeof data.password === 'string' && data.password.startsWith('$2')) {
    // stored value looks like a bcrypt hash
    valid = await bcrypt.compare(body.password, data.password)
  } else {
    // fallback for legacy plain-text passwords
    valid = body.password === data.password
    if (valid) {
      // migrate to hashed password on the fly
      const newHash = await bcrypt.hash(body.password, 10)
      await supabase
        .from('users')
        .update({ password: newHash })
        .eq('id', data.id)
    }
  }

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email or password is incorrect'
    })
  }

  // set user info in cookie so middleware can pick it up
  const user: any = data // cast because supabase return types are loose
  setCookie(event, 'user', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    // role field returned from join is an object { role: string }
    role: user.role && user.role.role ? user.role.role : user.role
  }), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 // 1 day
  })

  return { success: true }
})