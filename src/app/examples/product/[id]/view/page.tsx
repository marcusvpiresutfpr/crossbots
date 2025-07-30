import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { addToShoppingList, buyProduct } from "./actions";
import { BuyButton } from "./buy-button";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductDetail({ params }: Props) {
  const productId = params.id;

  const product = await prisma.shopProduct.findUnique({
    where: { id: productId },
    include: {
      shopCategoryLinks: {
        include: {
          category: true,
        },
      },
      relatedRobot: {
        include: {
          robotCategories: {
            include: {
              robotCategory: true,
            },
          },
          robotAwards: {
            include: {
              competition: true,
            },
          },
        },
      },
      relatedCompetition: true,
      relatedRobotCategory: true,
      listItems: {
        include: {
          shopList: {
            include: {
              user: true,
            },
          },
        },
      },
      purchaseItems: {
        include: {
          purchase: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-2xl font-semibold text-base-content/60">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 py-12">
      <div className="max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-xl p-10 flex flex-col md:flex-row gap-10">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border border-base-300 bg-base-300">
            <Image
              src={product.imageUrl || "/default-product.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-extrabold text-base-content mb-2">{product.name}</h1>
            <p className="text-base-content/60 mb-4">{product.description}</p>
            <div className="text-3xl font-bold text-primary mb-6">
              ${(product.priceCents / 100).toFixed(2)}
            </div>
            <BuyButton 
              productId={product.id}
              productName={product.name}
              price={product.priceCents}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-2">Categories</h2>
            {product.shopCategoryLinks.length === 0 ? (
              <div className="text-base-content/40 italic">No categories assigned.</div>
            ) : (
              <ul className="space-y-2">
                {product.shopCategoryLinks.map((link) => (
                  <li key={link.category.id} className="bg-primary/10 rounded px-3 py-2">
                    <span className="font-medium">{link.category.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {product.relatedRobot && (
            <section>
              <h2 className="text-2xl font-semibold text-secondary mb-2">Related Robot</h2>
              <div className="bg-secondary/10 rounded p-4">
                <Link 
                  href={`/examples/robot/${product.relatedRobot.id}/view`}
                  className="hover:text-secondary transition-colors"
                >
                  <h3 className="font-bold text-lg">{product.relatedRobot.name}</h3>
                  <p className="text-sm text-base-content/70 mb-2">{product.relatedRobot.description}</p>
                </Link>
                {product.relatedRobot.robotCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.relatedRobot.robotCategories.map((rc) => (
                      <span key={rc.robotCategory.id} className="badge badge-secondary badge-sm">
                        {rc.robotCategory.name}
                      </span>
                    ))}
                  </div>
                )}
                {product.relatedRobot.robotAwards.length > 0 && (
                  <div className="text-xs text-secondary">
                    Awards: {product.relatedRobot.robotAwards.length}
                  </div>
                )}
              </div>
            </section>
          )}

          {product.relatedCompetition && (
            <section>
              <h2 className="text-2xl font-semibold text-accent mb-2">Related Competition</h2>
              <div className="bg-accent/10 rounded p-4">
                <h3 className="font-bold text-lg">{product.relatedCompetition.name}</h3>
                <p className="text-sm text-base-content/70">{product.relatedCompetition.description}</p>
                <div className="text-xs text-accent mt-2">
                  Date: {product.relatedCompetition.date.toLocaleDateString()}
                </div>
                {product.relatedCompetition.location && (
                  <div className="text-xs text-accent">
                    Location: {product.relatedCompetition.location}
                  </div>
                )}
              </div>
            </section>
          )}

          {product.relatedRobotCategory && (
            <section>
              <h2 className="text-2xl font-semibold text-info mb-2">Related Robot Category</h2>
              <div className="bg-info/10 rounded p-4">
                <span className="font-medium">{product.relatedRobotCategory.name}</span>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-warning mb-2">Shopping Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">In Shopping Lists</h3>
                {product.listItems.length === 0 ? (
                  <div className="text-base-content/40 italic text-sm">Not in any lists yet.</div>
                ) : (
                  <ul className="space-y-1">
                    {product.listItems.slice(0, 5).map((item) => (
                      <li key={item.id} className="bg-warning/10 rounded px-2 py-1 text-sm">
                        <span className="font-medium">{item.shopList.name}</span>
                        <span className="ml-2 text-xs text-warning">
                          (Qty: {item.quantity}, User: {item.shopList.user.name})
                        </span>
                      </li>
                    ))}
                    {product.listItems.length > 5 && (
                      <li className="text-xs text-warning">
                        +{product.listItems.length - 5} more...
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Purchase History</h3>
                {product.purchaseItems.length === 0 ? (
                  <div className="text-base-content/40 italic text-sm">Not purchased yet.</div>
                ) : (
                  <ul className="space-y-1">
                    {product.purchaseItems.slice(0, 5).map((item) => (
                      <li key={item.id} className="bg-success/10 rounded px-2 py-1 text-sm">
                        <span className="font-medium">
                          ${(item.priceAtPurchase / 100).toFixed(2)}
                        </span>
                        <span className="ml-2 text-xs text-success">
                          (Qty: {item.quantity}, User: {item.purchase.user.name})
                        </span>
                      </li>
                    ))}
                    {product.purchaseItems.length > 5 && (
                      <li className="text-xs text-success">
                        +{product.purchaseItems.length - 5} more...
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="mt-6 text-xs text-base-content/40 flex gap-6">
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {product.createdAt.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Updated:</span>{" "}
              {product.updatedAt.toLocaleString()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
