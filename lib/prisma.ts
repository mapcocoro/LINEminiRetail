import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Only create client at runtime, not during build
  if (typeof window === 'undefined' && process.env.DATABASE_URL) {
    return new PrismaClient()
  }
  // Return a dummy during build if no DATABASE_URL
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
