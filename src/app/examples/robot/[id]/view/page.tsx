import prisma from "@/lib/prisma";
import Image from "next/image";

interface Props {
  params: {
    id: string;
  };
}

export default async function RobotDetail({ params }: Props) {
  const robotId = params.id;

  const robot = await prisma.robot.findUnique({
    where: { id: robotId },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      robotCategories: {
        include: {
          robotCategory: {
            include: {
              relatedProducts: {
                include: {
                  shopCategoryLinks: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      robotAwards: {
        include: {
          competition: true,
        },
      },
      relatedProducts: {
        include: {
          shopCategoryLinks: {
            include: {
              category: true,
            },
          },
          relatedCompetition: true,
          relatedRobotCategory: true,
        },
      },
    },
  });

  if (!robot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-2xl font-semibold text-base-content/60">Robot not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 py-12">
      <div className="max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-xl p-10 flex flex-col md:flex-row gap-10">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border border-base-300 bg-base-300">
            <Image
              src={robot.imageUrl}
              alt={robot.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-extrabold text-base-content mb-2">{robot.name}</h1>
            <p className="text-base-content/60">{robot.description}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-2">Categories</h2>
            <ul className="space-y-2">
              {robot.robotCategories.map((rc) => (
                <li key={rc.robotCategory.id} className="bg-primary/10 rounded px-3 py-2">
                  <span className="font-medium">{rc.robotCategory.name}</span>
                  {rc.robotCategory.relatedProducts.length > 0 && (
                    <ul className="ml-4 mt-1 text-sm text-base-content/70 list-disc">
                      {rc.robotCategory.relatedProducts.map((prod) => (
                        <li key={prod.id}>
                          {prod.name} <span className="text-primary font-semibold">${(prod.priceCents / 100).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-secondary mb-2">Awards</h2>
            {robot.robotAwards.length === 0 ? (
              <div className="text-base-content/40 italic">No awards yet.</div>
            ) : (
              <ul className="space-y-1">
                {robot.robotAwards.map((award) => (
                  <li key={award.id} className="bg-secondary/10 rounded px-3 py-1">
                    <span className="font-medium">{award.name}</span>
                    <span className="ml-2 text-xs text-secondary">(Competition: {award.competition.name})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-accent mb-2">Related Products</h2>
            {robot.relatedProducts.length === 0 ? (
              <div className="text-base-content/40 italic">No related products.</div>
            ) : (
              <ul className="space-y-1">
                {robot.relatedProducts.map((prod) => (
                  <li key={prod.id} className="bg-accent/10 rounded px-3 py-1">
                    <span className="font-medium">{prod.name}</span>
                    <span className="ml-2 text-accent font-semibold">${(prod.priceCents / 100).toFixed(2)}</span>
                    {prod.relatedCompetition && (
                      <span className="ml-2 text-xs text-accent">(Competition: {prod.relatedCompetition.name})</span>
                    )}
                    {prod.relatedRobotCategory && (
                      <span className="ml-2 text-xs text-accent">(Category: {prod.relatedRobotCategory.name})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-info mb-2">Users</h2>
            {robot.users.length === 0 ? (
              <div className="text-base-content/40 italic">No users yet.</div>
            ) : (
              <ul className="space-y-1">
                {robot.users.map((engagement) => (
                  <li key={engagement.user.id} className="bg-info/10 rounded px-3 py-1">
                    <span className="font-medium">{engagement.user.name}</span>
                    <span className="ml-2 text-xs text-info">({engagement.user.email})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="mt-6 text-xs text-base-content/40 flex gap-6">
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {robot.createdAt.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Updated:</span>{" "}
              {robot.updatedAt.toLocaleString()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
