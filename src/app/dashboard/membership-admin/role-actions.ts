"use server";

import prisma from "@/lib/prisma";

import { getUser } from "@/lib/session";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRole: string) {
  const currentUser = await getUser();
  if (!currentUser) return;

  // Only allow LEADER or ADMIN to change roles
  if (!["LEADER", "ADMIN"].includes(currentUser.role)) return;

  // Prevent changing own role
  if (currentUser.id === userId) return;

  // Only allow ADMIN to set MEMBER or VISITOR, LEADER can set any role (including other leaders)
  if (
    (currentUser.role === "ADMIN" && !["MEMBER", "VISITOR"].includes(newRole)) ||
    (currentUser.role === "LEADER" && !["LEADER", "ADMIN", "MEMBER", "VISITOR"].includes(newRole))
  ) {
    return;
  }

  // Ensure newRole is of type UserRole
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as UserRole },
  });

  revalidatePath("/dashboard/membership-admin");
}
