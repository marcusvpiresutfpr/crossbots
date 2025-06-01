import prisma from "@/lib/prisma";
import AwardForm from "./award-form";

export default async function AwardPage() {
  const robots = await prisma.robot.findMany({ select: { id: true, name: true } });
  const competitions = await prisma.competition.findMany({ select: { id: true, name: true } });

  return <AwardForm robots={robots} competitions={competitions} />;
}
