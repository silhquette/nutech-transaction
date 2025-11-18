import { PrismaClient } from "./../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.service.deleteMany();

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

  // Seed services data
  console.log('🔧 Seeding services...')
  const services = [
    {
      service_code: "PAJAK",
      service_name: "Pajak PBB",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 40000
    },
    {
      service_code: "PLN",
      service_name: "Listrik",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 10000
    },
    {
      service_code: "PDAM",
      service_name: "PDAM Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 40000
    },
    {
      service_code: "PULSA",
      service_name: "Pulsa",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 40000
    },
    {
      service_code: "PGN",
      service_name: "PGN Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 50000
    },
    {
      service_code: "MUSIK",
      service_name: "Musik Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 50000
    },
    {
      service_code: "TV",
      service_name: "TV Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 50000
    },
    {
      service_code: "PAKET_DATA",
      service_name: "Paket data",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 50000
    },
    {
      service_code: "VOUCHER_GAME",
      service_name: "Voucher Game",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 100000
    },
    {
      service_code: "VOUCHER_MAKANAN",
      service_name: "Voucher Makanan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 100000
    },
    {
      service_code: "QURBAN",
      service_name: "Qurban",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 200000
    },
    {
      service_code: "ZAKAT",
      service_name: "Zakat",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tarif: 300000
    }
  ];
  await prisma.service.createMany({ data: services });

  console.log('✅ Database seeded successfully!')  
  console.log(`👤 Created ${1} user`)
  console.log(`📢 Created ${banners.length} banners`)
  console.log(`🔧 Created ${services.length} services`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })