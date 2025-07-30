import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

interface Props {
  searchParams: {
    category?: string;
    skip?: string;
  };
}

export default async function Robots({ searchParams }: Props) {
  const category = searchParams.category ?? "";
  const skip = searchParams.skip ?? "0";

  console.log("Category:", category);
  console.log("Skip:", skip);

  const skipCount = parseInt(skip, 10) || 0;

  const categories = await prisma.robotCategory.findMany();

  const robots = await (async () => {
    if (category) {
      return prisma.robot.findMany({
        where: {
          robotCategories: {
            some: {
              robotCategory: {
                name: category,
              },
            },
          },
        },
        skip: skipCount,
        take: 10,
      });
    }

    return prisma.robot.findMany({
      skip: skipCount,
      take: 10,
    });
  })();

  if (!robots || robots.length === 0) {
    return <div>No robots found for this category.</div>;
  }

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-w-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Robots</h1>
        <div className="flex justify-between items-center mb-4">
          <Link href="/examples/robots?skip=0" className="btn btn-primary">
            Reset
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              className="btn"
              href={`/examples/robots?category=${cat.name}&skip=0`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="divider"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {robots.map((robot) => (
            <Link
              key={robot.id}
              href={`/examples/robot/${robot.id}/view`}
              className="card bg-base-100 shadow-xl"
            >
              <figure className="h-64 overflow-hidden">
                <Image
                  width={300}
                  height={300}
                  src={robot.imageUrl || "/default-robot.png"}
                  alt={robot.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{robot.name}</h2>
                <p>{robot.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
