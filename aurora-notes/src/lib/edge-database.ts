import { PrismaClient } from '@prisma/client'

const globalForEdgePrisma = globalThis as unknown as {
  edgePrisma: PrismaClient | undefined
}

// Edge Runtime Prisma Client without Accelerate for middleware
export const Edge資料庫 = 
  globalForEdgePrisma.edgePrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForEdgePrisma.edgePrisma = Edge資料庫
}
