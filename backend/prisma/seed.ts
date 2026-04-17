import { prisma } from "../src/config/prisma";
import bcrypt from "bcryptjs";
import "dotenv/config";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create a default admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@barber.com" },
    update: {},
    create: {
      email: "admin@barber.com",
      name: "Admin Principal",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);

  // Create some basic services
  const services = [
    { name: "Corte Masculino", price: 35.0, durationMinutes: 30 },
    { name: "Barba", price: 25.0, durationMinutes: 20 },
    { name: "Corte + Barba", price: 50.0, durationMinutes: 50 },
    { name: "Sobrancelha", price: 15.0, durationMinutes: 10 },
  ];

  for (const service of services) {
    const exists = await prisma.service.findFirst({ where: { name: service.name } });
    if (!exists) {
        await prisma.service.create({ data: service });
        console.log(`Service created: ${service.name}`);
    }
  }

  console.log("Seed finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

