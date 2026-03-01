export default defineEventHandler((event) => {
  // return the current user stored in context by the auth middleware
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  return event.context.user
})