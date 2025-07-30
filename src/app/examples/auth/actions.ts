"use server";

import { loginUser as authLoginUser, registerUser as authRegisterUser, logoutUser as authLogoutUser } from "@/app/(auth)/actions";
import { cookies } from "next/headers";

export async function loginUser(formData: FormData, pathToRevalidate: string = "/examples/user") {
  return await authLoginUser(formData, pathToRevalidate);
}

export async function registerUser(formData: FormData, pathToRevalidate: string = "/examples/user") {
  return await authRegisterUser(formData, pathToRevalidate);
}

export async function logoutUser(pathToRevalidate: string = "/examples") {
  return await authLogoutUser(pathToRevalidate);
}

export async function clearInvalidSession() {
  const c = await cookies();
  c.delete("session");
}
