import pkg from 'pg'

const { Pool } = pkg
const config = useRuntimeConfig()

export const pool = new Pool({
  connectionString: config.databaseUrl
})