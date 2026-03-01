export default defineEventHandler(async (event) => {
  // clear the user auth cookie
  setCookie(event, 'user', '', {
    maxAge: 0,
    path: '/',
  })

  return { message: 'Logged out' }
})