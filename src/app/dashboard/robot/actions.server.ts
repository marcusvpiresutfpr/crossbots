"use server";

import prisma from "@/lib/prisma";

// Accept selectedCategories and selectedUsers as arguments
export async function createRobot(
  formData: FormData,
  selectedCategories: { id: string | null; name: string }[],
  selectedUsers: { id: string | null; name: string }[]
) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !description || !imageUrl) {
    throw new Error("All fields are required");
  }

  // Prepare categories: create new if id is null, otherwise connect
  const categoryConnectOrCreate = await Promise.all(
    selectedCategories.map(async (cat) => {
      if (cat.id) {
        return { categoryId: cat.id };
      } else {
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });
        if (existing) {
          return { categoryId: existing.id };
        }
        const newCat = await prisma.category.create({ data: { name: cat.name } });
        return { categoryId: newCat.id };
      }
    })
  );

  // Prepare users: create new if id is null, otherwise connect
  const userConnectOrCreate = await Promise.all(
    selectedUsers.map(async (user) => {
      if (user.id) {
        return { userId: user.id };
      } else {
        const existing = await prisma.user.findFirst({ where: { name: user.name } });
        if (existing) {
          return { userId: existing.id };
        }
        const newUser = await prisma.user.create({ data: { name: user.name, email: `${user.name.toLowerCase().replace(/\s/g, "")}@example.com`, passwordHash: "" } });
        return { userId: newUser.id };
      }
    })
  );

  const robot = await prisma.robot.create({
    data: {
      name,
      description,
      imageUrl,
      categories: {
        create: categoryConnectOrCreate.map(rel => ({
          category: { connect: { id: rel.categoryId } }
        }))
      },
      users: {
        create: userConnectOrCreate.map(rel => ({
          user: { connect: { id: rel.userId } }
        }))
      }
    },
  });

  return { message: `Robot ${robot.name} created successfully!`, success: true, robotId: robot.id };
}

// Accept selectedCategories and selectedUsers as arguments
export async function updateRobot(
  id: string,
  formData: FormData,
  selectedCategories: { id: string | null; name: string }[],
  selectedUsers: { id: string | null; name: string }[]
) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !description || !imageUrl) {
    throw new Error("All fields are required");
  }

  // Prepare categories: create new if id is null, otherwise connect
  const categoryConnectOrCreate = await Promise.all(
    selectedCategories.map(async (cat) => {
      if (cat.id) {
        return { categoryId: cat.id };
      } else {
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });
        if (existing) {
          return { categoryId: existing.id };
        }
        const newCat = await prisma.category.create({ data: { name: cat.name } });
        return { categoryId: newCat.id };
      }
    })
  );

  // Prepare users: create new if id is null, otherwise connect
  const userConnectOrCreate = await Promise.all(
    selectedUsers.map(async (user) => {
      if (user.id) {
        return { userId: user.id };
      } else {
        const existing = await prisma.user.findFirst({ where: { name: user.name } });
        if (existing) {
          return { userId: existing.id };
        }
        const newUser = await prisma.user.create({ data: { name: user.name, email: `${user.name.toLowerCase().replace(/\s/g, "")}@example.com`, passwordHash: "" } });
        return { userId: newUser.id };
      }
    })
  );

  // Remove all previous category and user relations, then add new ones
  await prisma.robotCategoryRelation.deleteMany({ where: { robotId: id } });
  await prisma.userRobotEngagement.deleteMany({ where: { robotId: id } });

  const robot = await prisma.robot.update({
    where: { id },
    data: {
      name,
      description,
      imageUrl,
      categories: {
        create: categoryConnectOrCreate.map(rel => ({
          category: { connect: { id: rel.categoryId } }
        }))
      },
      users: {
        create: userConnectOrCreate.map(rel => ({
          user: { connect: { id: rel.userId } }
        }))
      }
    },
  });

  return { message: `Robot ${robot.name} updated successfully!`, success: true, robotId: robot.id };
}