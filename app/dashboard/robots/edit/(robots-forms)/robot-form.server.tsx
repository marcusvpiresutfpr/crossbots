import RobotFormClient from "./robot-form.client";

import { Robot } from "@/db/schema";

import { users, robots, competitions } from "@/db/schema";
import { db } from "@/db";
import { eq, and, ne } from "drizzle-orm";
import { getRobotWithRelations } from "@/lib/queries";

interface RobotFormProps {
  robotId: number | null;
  initialValues: Awaited<ReturnType<typeof getRobotWithRelations>> | null;
}

export default async function RobotForm({ robotId, initialValues }: RobotFormProps) {
  const [membersNames, competitionsNames] = await Promise.all([
    db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(ne(users.role, "viewer"))
      .orderBy(users.name),
    db
      .select({ id: competitions.id, name: competitions.name })
      .from(competitions)
      .orderBy(competitions.startDate),
  ]);

  return (
    <RobotFormClient
      membersNames={membersNames}
      competitionsNames={competitionsNames}
      initialValues={initialValues}
      robotId={robotId}
    />
  );
}
