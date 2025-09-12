import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("🚀 Prisma connected to DB"))
  .catch((err) => console.error("❌ Prisma connection error:", err.message));

export default prisma;
