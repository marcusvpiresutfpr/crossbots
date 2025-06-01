"use server";

import prisma from "@/lib/prisma";
import zod from "zod";
import { comparePasswords, hashPassword, setSession } from "@/lib/session";
import { cookies } from "next/headers";

const registerSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsedData = registerSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.errors };
  }

  const { name, email, password } = parsedData.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { success: false, errors: [{ message: "Email already in use" }] };

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await setSession(user);

  return { success: true, message: "Registration successful!" };
}

export async function loginUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsedData = loginSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.errors };
  }

  const { email, password } = parsedData.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, errors: [{ message: "Invalid email or password" }] };
  }

  const isPasswordValid = await comparePasswords(password, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, errors: [{ message: "Invalid email or password" }] };
  }

  await setSession(user);

  return { success: true, message: "Login successful!" };
}

export async function logoutUser() {
  const c = await cookies();
  c.getAll().forEach((cookie) => c.delete(cookie.name));
  
  return { success: true, message: "Logout successful!" };
}