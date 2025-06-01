import prisma from "@/lib/prisma";
import RobotForm from "./robot-form";

export default async function RobotFormPage({ searchParams }: { searchParams: { id?: string } }) {
  const initialRobotId = searchParams.id;

  const initialData = initialRobotId ? await prisma.robot.findUnique({
    where: { id: initialRobotId },
    include: {
      categories: { include: { category: true } },
      awards: true,
    }
  }) : null;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <RobotForm initialData={initialData} categories={categories} />;
}