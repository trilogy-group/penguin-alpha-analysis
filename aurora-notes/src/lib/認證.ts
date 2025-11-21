import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { 資料庫 } from '@/lib/資料庫'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(資料庫),
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

        const 使用者 = await 資料庫.使用者.findUnique({
          where: { 電子郵件: credentials.電子郵件 as string },
        })

        if (!使用者 || !使用者.密碼) {
          return null
        }

        const 密碼正確 = await bcrypt.compare(
          credentials.密碼 as string,
          使用者.密碼
        )

        if (!密碼正確) {
          return null
        }

        return {
          id: 使用者.id,
          電子郵件: 使用者.電子郵件,
          name: 使用者.使用者名稱,
          image: 使用者.頭像,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/登入',
    signUp: '/註冊',
  },
})
