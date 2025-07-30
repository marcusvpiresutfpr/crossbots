import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const c = await cookies();
  c.delete("session");
  
  return NextResponse.json({ success: true, message: "Session cleared" });
}
