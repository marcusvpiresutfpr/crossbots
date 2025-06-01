"use server";

import prisma from "@/lib/prisma";

// Accept selectedCategories as argument
export async function createRobot(formData: FormData, selectedCategories: { id: string | null; name: string }[]) {
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
        // Create new category if not exists
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });
        if (existing) {
          return { categoryId: existing.id };
        }
        const newCat = await prisma.category.create({ data: { name: cat.name } });
        return { categoryId: newCat.id };
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
      }
    },
  });

  return { message: `Robot ${robot.name} created successfully!`, success: true, robotId: robot.id };
}

// Accept selectedCategories as argument
export async function updateRobot(id: string, formData: FormData, selectedCategories: { id: string | null; name: string }[]) {
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
        // Create new category if not exists
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });
        if (existing) {
          return { categoryId: existing.id };
        }
        const newCat = await prisma.category.create({ data: { name: cat.name } });
        return { categoryId: newCat.id };
      }
    })
  );

  // Remove all previous category relations, then add new ones
  await prisma.robotCategoryRelation.deleteMany({ where: { robotId: id } });

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
      }
    },
  });

  return { message: `Robot ${robot.name} updated successfully!`, success: true, robotId: robot.id };
}