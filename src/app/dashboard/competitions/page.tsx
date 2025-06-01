import Link from "next/link";
import prisma from "@/lib/prisma";
import { Eye, Pencil } from "lucide-react";
import Image from "next/image";

const PAGE_SIZE = 10;

export default async function CompetitionsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;

  const [competitions, total] = await Promise.all([
    prisma.competition.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { date: "desc" }
    }),
    prisma.competition.count()
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Competitions</h1>
        <Link href="/dashboard/competition">
          <button className="btn btn-primary">New Competition</button>
        </Link>
      </div>
      <ul className="list">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">All competitions</li>
        {competitions.map((comp) => (
          <li className="list-row" key={comp.id}>
            <div>
              <Image
                width={100}
                height={100}
                alt=""
                className="size-10 rounded-box"
                src={new URL(comp.imageUrl || "/competition-placeholder.png", process.env.NEXT_PUBLIC_BASE_URL).toString()}
                overrideSrc="https://picsum.photos/seed/picsum/200/200"
              />
            </div>
            <div>
              <div>{comp.name} - {new Date(comp.date).toDateString()}</div>
              <div className="text-xs opacity-80">{comp.description}</div>
            </div>
              <Link href={`/competition/${comp.id}`} className="btn btn-square btn-ghost" title="View">
                <Eye className="size-[1.2em]" />
              </Link>
              <Link href={`/dashboard/competition?id=${comp.id}`} className="btn btn-square btn-ghost" title="Edit">
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
