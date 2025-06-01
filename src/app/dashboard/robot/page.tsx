import prisma from "@/lib/prisma";
import RobotForm from "./robot-form";

interface SearchParams {
  id?: string;
}

export default async function RobotFormPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialRobotId = resolvedSearchParams.id;

  const initialData = initialRobotId
    ? await prisma.robot.findUnique({
        where: { id: initialRobotId },
        include: {
          categories: { include: { category: true } },
          awards: true,
          users: { include: { user: true } },
        },
      })
    : null;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  
  if (!initialData && initialRobotId) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Robot not found</h1>
        <p className="mt-4">The robot you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <RobotForm
      initialData={initialData ?? {}}
      categories={categories}
      users={users}
    />
  );
}
