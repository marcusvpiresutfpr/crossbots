import { PrismaClient, UserRole } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

async function main() {
  // Load JSON data
  const users: any[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const robots: any[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'robots.json'), 'utf-8'));
  const competitions: any[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'competitions.json'), 'utf-8'));

  // 1. Create Categories (from robots' descriptions, just for demo)
  const categoryNames = [
    'Autonomous Navigation',
    'Manipulator',
    'Vision',
    'AI',
    'Mechanical',
    'Electronics',
    'Strategy',
    'Speed',
    'Heavyweight',
    'Lightweight',
  ];
  const categories = await Promise.all(
    categoryNames.map((name) => prisma.category.create({ data: { name } }))
  );

  // 2. Create Users
  const userRoleValues = Object.values(UserRole);
  const createdUsers = await Promise.all(
    users.map((user, idx) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: `user${idx + 1}@robotics.org`,
          passwordHash: `hashed_pw_${idx + 1}`,
          role: userRoleValues.includes(user.role)
            ? user.role
            : userRoleValues[getRandomInt(0, userRoleValues.length - 1)],
          bio: user.bio || '',
          imageUrl: user.imageUrl || '',
        },
      })
    )
  );

  // 3. Create Competitions
  const createdCompetitions = await Promise.all(
    competitions.map((comp, idx) =>
      prisma.competition.create({
        data: {
          name: comp.name,
          date: comp.date ? new Date(comp.date) : new Date(),
          location: comp.location || '',
          description: comp.description || '',
          imageUrl: comp.imageUrl || '',
        },
      })
    )
  );

  // 4. Create Robots with random category and user relations
  const createdRobots = [];
  for (let i = 0; i < robots.length; i++) {
    const robot = robots[i];
    // Random categories (1-3)
    const robotCategories = shuffle(categories).slice(0, getRandomInt(1, 3));
    // Random users (3-6)
    const robotUsers = shuffle(createdUsers).slice(0, getRandomInt(3, 6));

    const createdRobot = await prisma.robot.create({
      data: {
        name: robot.name,
        description: robot.description || '',
        imageUrl: robot.imageUrl || '',
        categories: {
          create: robotCategories.map((cat) => ({
            categoryId: cat.id,
          })),
        },
        users: {
          create: robotUsers.map((user) => ({
            userId: user.id,
          })),
        },
      },
    });
    createdRobots.push(createdRobot);
  }

  // 5. Create Awards for each robot (2-7 awards per robot)
  const placeSuffix = (n: number) => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
  };
  for (const robot of createdRobots) {
    const numAwards = getRandomInt(2, 7);
    for (let i = 0; i < numAwards; i++) {
      const place = getRandomInt(1, 32);
      const comp = createdCompetitions[getRandomInt(0, createdCompetitions.length - 1)];
      await prisma.award.create({
        data: {
          name: `${placeSuffix(place)} Place`,
          robotId: robot.id,
          competitionId: comp.id,
        },
      });
    }
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
