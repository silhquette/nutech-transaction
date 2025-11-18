import { PrismaClient } from "./../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();

  // Seed users data
  console.log('👤 Seeding users...')
  await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: '$2b$10$WHFAqVWzNnG.Jc.89TqOf.1/xvl2EzadpdXkUWDraeEKXtBMs7JHm', // password: password
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  // Seed banners data
  console.log('📢 Seeding banners...')
  const banners = [
    {
      banner_name: "Banner 1",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    },
    {
      banner_name: "Banner 2",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    },
    {
      banner_name: "Banner 3",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    },
    {
      banner_name: "Banner 4",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    },
    {
      banner_name: "Banner 5",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    },
    {
      banner_name: "Banner 6",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet"
    }
  ];
  await prisma.banner.createMany({ data: banners });

  console.log('✅ Database seeded successfully!')  
  console.log(`👤 Created ${1} user`)
  console.log(`📢 Created ${banners.length} banners`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })