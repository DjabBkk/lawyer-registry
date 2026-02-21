import { createBrowserClient } from '@supabase/ssr'

const getPublicEnv = (name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    getPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  )
