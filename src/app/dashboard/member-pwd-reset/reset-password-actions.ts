"use server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function resetUserPassword(userId: string) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "LEADER") return;

  const defaultPassword = "123456789";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/dashboard/member-pwd-reset");
}
