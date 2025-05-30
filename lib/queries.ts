import { cookies } from "next/headers";
import { verifyToken } from "./session";
import { users, robots } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== "number") {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getRobots() {
  return db.select().from(robots);
}

export async function getRobotWithRelations(id: number) {
  return db.query.robots.findFirst({
    where: (robots, { eq }) => eq(robots.id, id),
    with: {
      users: true,
      competitions: true,
      contributors: true,
      awards: true,
    },
  });
}