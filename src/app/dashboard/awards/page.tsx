import Link from "next/link";
import prisma from "@/lib/prisma";
import { Eye, Pencil } from "lucide-react";

const PAGE_SIZE = 10;

interface SearchParams {
  page?: string;
}

export default async function AwardsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;

  const [awards, total] = await Promise.all([
    prisma.award.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        robot: true,
        competition: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.award.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Awards</h1>
        <Link href="/dashboard/award">
          <button className="btn btn-primary">New Award</button>
        </Link>
      </div>
      <ul className="list">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">All awards</li>
        {awards.map((award) => (
          <li className="list-row" key={award.id}>
            <div className="text-4xl font-thin opacity-30 tabular-nums">
              {award.name && !isNaN(parseInt(award.name))
                ? `0${parseInt(award.name)}`.slice(-2)
                : "?!"}
            </div>
            <div>
              <div className="font-semibold">{award.name}</div>
              <div className="text-xs opacity-80">
                Robot: <span className="font-medium">{award.robot?.name}</span>
                {" | "}
                Competition: <span className="font-medium">{award.competition?.name}</span>
              </div>
            </div>
            <Link href={`/competition/${award.id}`} className="btn btn-square btn-ghost" title="View">
              <Eye className="size-[1.2em]" />
            </Link>
            <Link href={`/dashboard/competition?id=${award.id}`} className="btn btn-square btn-ghost" title="Edit">
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
