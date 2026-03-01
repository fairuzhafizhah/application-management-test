export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'user')

  if (cookie) {
    event.context.user = JSON.parse(cookie)

    // if role was stored as an id (number), look up its name
    if (typeof event.context.user.role === 'number') {
      try {
        const { supabase } = await import('../utils/supabase')
        const { data } = await supabase
          .from('roles')
          .select('role')
          .eq('id', event.context.user.role)
          .single()
        if (data && data.role) {
          event.context.user.role = data.role
        }
      } catch (e) {
        // ignore errors; keep original value
      }
    }
  }
})