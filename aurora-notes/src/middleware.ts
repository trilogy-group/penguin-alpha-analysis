import NextAuth from 'next-auth'
import { auth } from '@/lib/認證'

export default NextAuth(auth)
