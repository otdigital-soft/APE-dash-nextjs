import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import api from './api'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'wallet',
      name: 'Wallet Credentials',
      credentials: {
        publicAddress: { label: 'Public Address', type: 'text' },
        signature: { label: 'Signature', type: 'password' }
      },
      async authorize(credentials) {
        const user = await api
          .post(`/auth/signature`, {
            publicAddress: credentials?.publicAddress,
            signature: credentials?.signature
          })
          .then(({ data }) => {
            return data
          })
          .catch((error) => {
            console.log(error.toString())
            return null
          })
        // If no error and we have user data, return it
        return user
      }
    }),
    CredentialsProvider({
      id: 'user',
      name: 'User Credentials',
      credentials: {
        nftId: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        // Make this secure!
        const user = await api
          .post(`/users/login`, {
            nftId: credentials?.nftId
          })
          .then(({ data }) => {
            return data
          })
          .catch((e) => {
            console.log(e)
            return null
          })
        // If no error and we have user data, return it
        return user
      }
    }),
    CredentialsProvider({
      id: 'jwt',
      name: 'JWT Credentials',
      credentials: {
        token: { label: 'token', type: 'password' }
      },
      async authorize(credentials) {
        const user = await api
          .get(`/users/me`, {
            headers: {
              Authorization: `Bearer ${credentials?.token}`
            }
          })
          .then(({ data }) => {
            return data
          })
          .catch((e) => {
            console.log(e)
            return null
          })
        const jwt = await api
          .post(`/users/login`, {
            nftId: user?.data?.nftId
          })
          .then(({ data }) => {
            return data
          })
          .catch(() => {
            // console.log(e)
            return null
          })
        if (!jwt) return
        // If no error and we have user data, return it
        return jwt
      }
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'User Credentials Login',
      credentials: {
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await api
          .post(`/auth/login`, {
            identifier: credentials?.identifier,
            password: credentials?.password
          })
          .then(({ data }) => {
            return data
          })
          .catch((e) => {
            console.log(e)
            return null
          })
        // If no error and we have user data, return it
        return user
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || '1234567890',

  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1 * 24 * 60 * 60, // 3 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60 // 24 hours
  },

  pages: {
    signIn: '/auth',
    signOut: '/auth'
    // error: '/auth' // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true
      } else {
        return false
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async session({ session, token }: any) {
      if (token?.type === 'wallet') {
        if (token?.user) {
          session.address = token?.user?.address
          session.jwt = token?.jwt
          session.signature = token.user?.signature
          session.id = token.user?.id
          session.role = token.user?.role
          session.user = {
            id: token?.user?._id,
            name: token?.user?.name,
            nftId: token?.user?.nftId,
            business: token?.user?.business?.map((v: any) => v?._id)
          }
        }
      }
      if (token?.type === 'user' || token?.type === 'jwt' || token?.type === 'credentials') {
        session.user = token.user
        session.jwt = token?.jwt
        session.iat = token?.iat
        session.exp = token?.exp
        session.jti = token?.jti
        session.role = token.user?.role
        delete (session.user as any)?.accounts
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (account?.provider === 'wallet') {
        token.user = {
          address: user?.address as string,
          signature: user?.signature as string,
          id: (user?.wallet as any)?._id as string,
          name: user?.user?.name,
          nftId: user?.user?.nftId,
          business: user?.user?.business
        } as any
        token.type = 'wallet'
        token.jwt = user?.token as string
        return token
      }
      if (account?.provider === 'user' || account?.provider === 'jwt' || account?.provider === 'credentials') {
        token.user = user?.user
        token.type = user?.type || 'user'
        token.jwt = user?.token as string

        return token
      }
      return token
    }
  },

  events: {},

  theme: {
    colorScheme: 'light'
  },

  debug: false
}
