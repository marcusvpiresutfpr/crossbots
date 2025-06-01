"use server";

import { revalidateTag } from 'next/cache';
import prisma from "@/lib/prisma";

export async function createAward(formData: FormData) {
  const name = formData.get("name") as string;
  const robotId = formData.get("robotId") as string;
  const competitionId = formData.get("competitionId") as string;

  if (!name || !robotId || !competitionId) {
    return { success: false, message: "All fields are required." };
  }

  try {
    const award = await prisma.award.create({
      data: { name, robotId, competitionId },
    });
    revalidateTag("awards");
    revalidateTag("competitions");
    revalidateTag("robots");
    return { success: true, message: `Award "${award.name}" created successfully!` };
  } catch (error) {
    console.error("Error creating award:", error);
    return { success: false, message: "Failed to create award." };
  }
}
