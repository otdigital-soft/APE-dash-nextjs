import 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    address?: string
    signature?: string
    jwt?: string
    user?: Session['user']
  }
}
