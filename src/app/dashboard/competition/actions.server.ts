"use server";

import { revalidateTag } from 'next/cache';
import prisma from "@/lib/prisma";

export async function createCompetition(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  if (!name || !description || !imageUrl || !location || !dateStr) {
    throw new Error("All fields are required");
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const competition = await prisma.competition.create({
    data: { name, description, imageUrl, location, date },
  });

  revalidateTag("competitions");
  return { message: `Competition ${competition.name} created successfully!`, success: true, competitionId: competition.id };
}

export async function updateCompetition(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  if (!name || !description || !imageUrl || !location || !dateStr) {
    throw new Error("All fields are required");
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const competition = await prisma.competition.update({
    where: { id },
    data: { name, description, imageUrl, location, date },
  });

  revalidateTag("competitions");
  return { message: `Competition ${competition.name} updated successfully!`, success: true, competitionId: competition.id };
}
