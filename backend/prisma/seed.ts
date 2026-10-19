import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEV_SEED_USER = {
  name: "Test User",
  email: "test@example.com",
  // Development-only password. Never used in production.
  password: "DevOnlyPassword123!",
};

async function main() {
  const passwordHash = await bcrypt.hash(DEV_SEED_USER.password, 10);

  await prisma.user.upsert({
    where: { email: DEV_SEED_USER.email },
    update: {},
    create: {
      name: DEV_SEED_USER.name,
      email: DEV_SEED_USER.email,
      passwordHash,
    },
  });

  console.log(`Seeded dev user: ${DEV_SEED_USER.email} / ${DEV_SEED_USER.password}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
