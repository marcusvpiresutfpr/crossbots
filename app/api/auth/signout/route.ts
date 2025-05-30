import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = await cookies();
  c.getAll().forEach((cookie) => c.delete(cookie.name));
  return NextResponse.json({ success: true });
}
