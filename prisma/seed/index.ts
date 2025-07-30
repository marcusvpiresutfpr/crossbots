import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const rawData = fs.readFileSync(path.join(__dirname, 'exampleData01.json'), 'utf-8');
  const data = JSON.parse(rawData);

    // Clear existing data before seeding
  await prisma.shopPurchaseItem.deleteMany();
  await prisma.shopPurchase.deleteMany();
  await prisma.shopListItem.deleteMany();
  await prisma.shopList.deleteMany();
  await prisma.shopProductCategory.deleteMany();
  await prisma.shopCategory.deleteMany();
  await prisma.robotAward.deleteMany();
  await prisma.robotCategoryRelation.deleteMany();
  await prisma.robotCategory.deleteMany();
  await prisma.robot.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.userRobotEngagement.deleteMany();
  await prisma.user.deleteMany();

  // USERS
  for (const [index, user] of data.users.entries()) {
    const imageNumber = String(index + 1).padStart(3, '0');
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        ...user,
        imageUrl: `/dev_people/${imageNumber}.jpg`,
      },
    });
  }

  // ROBOT CATEGORIES
  for (const cat of data.robotCategories) {
    await prisma.robotCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }

  // ROBOTS
  for (const [index, robot] of data.robots.entries()) {
    const imageNumber = String(index + 1).padStart(3, '0');
    await prisma.robot.create({
      data: {
        id: robot.id,
        name: robot.name,
        imageUrl: `/dev_robots/${imageNumber}.jpg`,
        description: robot.description,
        robotCategories: {
          create: robot.categoryIds.map((catId: string) => ({
            robotCategory: { connect: { id: catId } },
          })),
        },
      },
    });
  }

  // COMPETITIONS
  for (const [index, comp] of data.competitions.entries()) {
    const imageNumber = String(index + 1).padStart(3, '0');
    await prisma.competition.upsert({
      where: { id: comp.id },
      update: {},
      create: {
        ...comp,
        imageUrl: `/dev_comp/${imageNumber}.jpg`,
      },
    });
  }

  // SHOP CATEGORIES
  for (const cat of data.shopCategories) {
    await prisma.shopCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }

  // SHOP PRODUCTS
  for (const [index, product] of data.shopProducts.entries()) {
    const imageNumber = String(index + 1).padStart(3, '0');
    await prisma.shopProduct.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        robotId: product.robotId || undefined,
        competitionId: product.competitionId || undefined,
        robotCategoryId: product.robotCategoryId || undefined,
        imageUrl: `/dev_product/${imageNumber}.jpg`,
        shopCategoryLinks: {
          create: product.categoryIds.map((id: string) => ({
            category: { connect: { id } },
          })),
        },
      },
    });
  }

  // SHOPPING LISTS
  for (const list of data.shopLists) {
    await prisma.shopList.create({
      data: {
        id: list.id,
        name: list.name,
        userId: list.userId,
        items: {
          create: list.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  // PURCHASES
  for (const purchase of data.shopPurchases) {
    await prisma.shopPurchase.create({
      data: {
        id: purchase.id,
        userId: purchase.userId,
        totalCents: purchase.totalCents,
        items: {
          create: purchase.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
    });
  }

  console.log('✅ Dev database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
