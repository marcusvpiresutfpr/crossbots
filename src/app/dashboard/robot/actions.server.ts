"use server";

import prisma from "@/lib/prisma";

export async function createRobot(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !description || !imageUrl) {
    throw new Error("All fields are required");
  }

  const robot = await prisma.robot.create({
    data: { name, description, imageUrl, },
  });

  return { message: `Robot ${robot.name} created successfully!`, success: true, robotId: robot.id };
}

export async function updateRobot(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !description || !imageUrl) {
    throw new Error("All fields are required");
  }

  const robot = await prisma.robot.update({
    where: { id },
    data: { name, description, imageUrl, },
  });

  return { message: `Robot ${robot.name} updated successfully!`, success: true, robotId: robot.id };
}