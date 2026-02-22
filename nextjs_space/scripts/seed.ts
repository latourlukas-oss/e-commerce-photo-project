import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Classic Photo Cube',
    description: 'A beautiful 3D rotating cube featuring your cherished photos on all sides. Perfect for displaying multiple memories in one elegant piece.',
    price: 24.99,
    category: 'photo-cube',
    imageUrl: '/products/photo-cube.jpg'
  },
  {
    name: 'Memory Keychain',
    description: 'Keep your loved ones close wherever you go with this durable photo keychain. Made with premium materials for lasting quality.',
    price: 12.99,
    category: 'keychain',
    imageUrl: '/products/keychain.jpg'
  },
  {
    name: 'Custom Fridge Magnet',
    description: 'Display your favorite moments on any magnetic surface. Strong magnet backing ensures your memories stay put.',
    price: 9.99,
    category: 'fridge-magnet',
    imageUrl: '/products/fridge-magnet.jpg'
  },
  {
    name: 'Premium Canvas Print',
    description: 'Gallery-quality canvas prints that transform your photos into stunning wall art. Stretched on solid wood frames.',
    price: 49.99,
    category: 'canvas-print',
    imageUrl: '/products/canvas.jpg'
  }
];

async function main() {
  console.log('Starting seed...');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('Cleared existing products');

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
    console.log(`Created product: ${product?.name}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
