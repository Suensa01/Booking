import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!prismaInstance) {
    if (globalForPrisma.prisma) {
      prismaInstance = globalForPrisma.prisma;
    } else {
      try {
        const adapter = new PrismaPg({ connectionString });
        prismaInstance = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
        });
        if (process.env.NODE_ENV !== "production") {
          globalForPrisma.prisma = prismaInstance;
        }
      } catch (err) {
        console.warn("Prisma initialization warning:", err);
        return null;
      }
    }
  }

  return prismaInstance;
}
