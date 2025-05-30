import { PrismaClient, Role } from "../app/generated/prisma"

const prisma = new PrismaClient();

async function main() {
  // Create users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Engineer',
      username: 'alice123',
      passwordHash: 'hashedpassword1',
      role: Role.admin,
      image: 'https://example.com/alice.png',
      description: 'Admin of the robotics club',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Builder',
      username: 'bobbuilder',
      passwordHash: 'hashedpassword2',
      role: Role.member,
      image: 'https://example.com/bob.png',
    },
  });

  // Create robots
  const robotA = await prisma.robot.create({
    data: {
      name: 'MechaBot',
      description: 'Autonomous combat robot',
      image: 'https://example.com/mechabot.png',
      users: {
        connect: [{ id: alice.id }, { id: bob.id }],
      },
    },
  });

  const robotB = await prisma.robot.create({
    data: {
      name: 'NanoCrawler',
      description: 'Micro exploration robot',
      users: {
        connect: [{ id: bob.id }],
      },
    },
  });

  // Create competitions
  const comp1 = await prisma.competition.create({
    data: {
      name: 'RoboWars 2024',
      description: 'National combat robotics tournament',
      image: 'https://example.com/robowars.png',
      date: new Date('2024-07-15'),
    },
  });

  const comp2 = await prisma.competition.create({
    data: {
      name: 'NanoTech Expo',
      description: 'Exhibition of micro-robotics',
      date: new Date('2024-11-03'),
    },
  });

  // Create awards
  await prisma.award.createMany({
    data: [
      {
        name: 'Best Combat Performance',
        robotId: robotA.id,
        competitionId: comp1.id,
      },
      {
        name: 'Innovation in Design',
        robotId: robotB.id,
        competitionId: comp2.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed complete');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
