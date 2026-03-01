import { process } from "better-auth";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: '',
    authSecret: ''
    // databaseUrl: process.env.DATABASE_URL,
    // authSecret: process.env.AUTH_SECRET
  },
  modules: ['@nuxt/ui']
})