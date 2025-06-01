import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";

const PAGE_SIZE = 10;

export default async function RobotsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;

  const [robots, total] = await Promise.all([
    prisma.robot.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        categories: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.robot.count()
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Robots</h1>
        <Link href="/dashboard/robot">
          <button className="btn btn-primary">New Robot</button>
        </Link>
      </div>
      <ul className="list">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">All robots</li>
        {robots.map((robot) => (
          <li className="list-row" key={robot.id}>
            <div>
              <Image width={100} height={100} alt="" className="size-10 rounded-box" src={robot.imageUrl || "/robot-placeholder.png"} />
            </div>
            <div>
              <div>{robot.name}</div>
              <div className="text-xs opacity-80 uppercase">
                {robot.categories.map((c) => c.category.name).join(", ")}
              </div>
              <div className="text-xs font-semibold opacity-60 line-clamp-3">{robot.description}</div>
            </div>
            <Link href={`/robot/${robot.id}`} className="btn btn-square btn-ghost" title="View">
              <Eye className="size-[1.2em]" />
            </Link>
            <Link href={`/dashboard/robot?id=${robot.id}`} className="btn btn-square btn-ghost" title="Edit">
              <Pencil className="size-[1.2em]" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="join mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`?page=${i + 1}`}
            className={`join-item btn${page === i + 1 ? " btn-primary" : ""}`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
