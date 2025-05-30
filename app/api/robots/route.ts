import { NextResponse, NextRequest } from "next/server";
import { getRobots } from "@/lib/queries";
import { db } from "@/db";
import { robots, robotUsers, robotCompetitions, awardsRelations } from "@/db/schema";
import { z } from "zod";

// Match robotStatusEnum from schema.ts
const robotStatusEnum = z.enum(["validation", "canceled", "active", "retiree"]);

// Accept arrays for members, competitions, and awards
const addRobotSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  status: robotStatusEnum.optional(),
  memberIds: z.array(z.number().int()).optional(),
  memberIdsActive: z.record(z.string(), z.enum(["0", "1"])).optional(),
  competitionIds: z.array(z.number().int()).optional(),
});

export async function GET() {
  const robots = await getRobots();
  return NextResponse.json(robots);
}

export async function POST(req: NextRequest) {
  // Accept both JSON and FormData
  let data: any;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await req.json();
  } else if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    data = {};
    for (const [key, value] of form.entries()) {
      if (key === "memberIds" || key === "competitionIds") {
        if (!data[key]) data[key] = [];
        data[key].push(Number(value));
      } else if (key.startsWith("memberIds_active_")) {
        if (!data.memberIdsActive) data.memberIdsActive = {};
        const memberId = key.replace("memberIds_active_", "");
        data.memberIdsActive[memberId] = value as string;
      } else {
        data[key] = value;
      }
    }

    // Convert types
    if (data.memberIds) data.memberIds = data.memberIds.map(Number);
    if (data.competitionIds) data.competitionIds = data.competitionIds.map(Number);
  } else {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  // Validate
  const parseResult = addRobotSchema.safeParse(data);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid input", details: parseResult.error.errors }, { status: 400 });
  }
  
  try {
    const robotData = parseResult.data;
    // Insert robot
    const [robot] = await db
      .insert(robots)
      .values({
        name: robotData.name,
        description: robotData.description,
        image: robotData.image,
        status: robotData.status ?? "validation",
      })
      .returning();

    // Connect members (robotUsers)
    if (Array.isArray(robotData.memberIds) && robotData.memberIds.length > 0) {
      await db.insert(robotUsers).values(
        robotData.memberIds.map((userId: number) => ({
          robotId: robot.id,
          userId,
          isActive: robotData.memberIdsActive?.[String(userId)] === "1" ? 1 : 0,
        }))
      );
    }

    // Connect competitions (robotCompetitions)
    if (Array.isArray(robotData.competitionIds) && robotData.competitionIds.length > 0) {
      await db.insert(robotCompetitions).values(
        robotData.competitionIds.map((competitionId: number) => ({
          robotId: robot.id,
          competitionId,
        }))
      );
    }

    return NextResponse.json({ success: true, robotId: robot.id });
  } catch (e) {
    console.error("Error adding robot:", e);
    return NextResponse.json({ error: "Failed to add robot" }, { status: 400 });
  }
}
