import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Edge資料庫 } from '@/lib/edge-database'
import bcrypt from 'bcryptjs'

const config = {
  adapter: PrismaAdapter(Edge資料庫),
  providers: [
    Credentials({
      credentials: {
        電子郵件: { label: '電子郵件', type: 'email' },
        密碼: { label: '密碼', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.電子郵件 || !credentials?.密碼) {
          return null
        }

        const 使用者 = await Edge資料庫.user.findUnique({
          where: { email: credentials.電子郵件 as string },
        })

        if (!使用者 || !使用者.password) {
          return null
        }

        const 密碼正確 = await bcrypt.compare(
          credentials.密碼 as string,
          使用者.password
        )

        if (!密碼正確) {
          return null
        }

        return {
          id: 使用者.id,
          電子郵件: 使用者.email,
          name: 使用者.username,
          image: 使用者.avatar,
        }
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user: Record<string, unknown> | null }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: { user: { id?: string } }; token: Record<string, unknown> }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/登入',
    signUp: '/註冊',
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
