import { comparePasswords, setSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt with username:", username, " and password:", password);

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const userResult = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);

  console.log("User query result:", userResult);

  if (userResult.length === 0) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const user = userResult[0];
  const isPasswordValid = await comparePasswords(password, user.passwordHash);

  console.log("Password validation result:", isPasswordValid);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await setSession(user);

  return NextResponse.json({ success: true });
}
