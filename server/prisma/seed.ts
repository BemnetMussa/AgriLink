import { PrismaClient, UserRole, Language } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { phoneNumber: '911111111' },
    update: {},
    create: {
      phoneNumber: '911111111',
      email: 'admin@agrilink.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      language: Language.ENGLISH,
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.phoneNumber);

  // Create sample farmer
  const farmerPassword = await bcrypt.hash('farmer123', 10);
  const farmer = await prisma.user.upsert({
    where: { phoneNumber: '922222222' },
    update: {},
    create: {
      phoneNumber: '922222222',
      email: 'farmer@agrilink.com',
      passwordHash: farmerPassword,
      firstName: 'Abebe',
      lastName: 'Kebede',
      role: UserRole.FARMER,
      language: Language.ENGLISH,
      isVerified: true,
      isActive: true,
      farmerProfile: {
        create: {
          farmName: 'Kebede Organic Farm',
          farmLocation: 'Hawassa, Sidama Region',
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Farmer user created:', farmer.phoneNumber);

  // Create sample buyer
  const buyerPassword = await bcrypt.hash('buyer123', 10);
  const buyer = await prisma.user.upsert({
    where: { phoneNumber: '933333333' },
    update: {},
    create: {
      phoneNumber: '933333333',
      email: 'buyer@agrilink.com',
      passwordHash: buyerPassword,
      firstName: 'Tigist',
      lastName: 'Hailu',
      role: UserRole.BUYER,
      language: Language.ENGLISH,
      isVerified: true,
      isActive: true,
      buyerProfile: {
        create: {
          businessName: 'Hailu Trading',
          businessType: 'Retail',
          address: 'Addis Ababa, Ethiopia',
        },
      },
    },
  });

  console.log('✅ Buyer user created:', buyer.phoneNumber);

  // Create sample products
  const products = [
    {
      title: 'Organic Red Tomatoes',
      description: 'Premium quality red tomatoes, organically grown without pesticides.',
      category: 'Tomatoes',
      price: 60,
      quantity: 200,
      minOrder: 10,
      unit: 'kg',
      location: 'Addis Ababa',
      images: ['/tomatoes.png'],
    },
    {
      title: 'Premium Ethiopian Arabica Coffee Beans',
      description: 'World-renowned Sidama Arabica coffee beans. Hand-picked and sun-dried.',
      category: 'Coffee Beans',
      price: 450,
      quantity: 150,
      minOrder: 5,
      unit: 'kg',
      location: 'Sidama',
      images: ['/coffee.png'],
    },
    {
      title: 'Local Highland Potatoes',
      description: 'High-yield highland potatoes from the rich soils of Ambo.',
      category: 'Potatoes',
      price: 35,
      quantity: 500,
      minOrder: 50,
      unit: 'kg',
      location: 'Oromia Region',
      images: ['/potatoes.png'],
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        farmerId: farmer.id,
      },
    });
    console.log('✅ Product created:', product.title);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
