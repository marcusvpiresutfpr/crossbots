"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const bio = formData.get("bio") as string;

  if (!name) {
    return { success: false, message: "Name is required." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        imageUrl: imageUrl || "",
        bio: bio || "",
      },
    });
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update profile." };
  }
}
