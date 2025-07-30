import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

// For demo purposes, we'll use a hardcoded user ID
const DEMO_USER_ID = "demo-user-1";

export default async function PurchasesPage() {
  // Ensure demo user exists
  let user = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        passwordHash: "demo-password-hash",
        role: "MEMBER",
      },
    });
  }

  // Get all purchases for the user
  const purchases = await prisma.shopPurchase.findMany({
    where: { userId: DEMO_USER_ID },
    include: {
      items: {
        include: {
          product: {
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
    orderBy: { purchasedAt: "desc" },
  });

  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Purchases</h1>
          <div className="bg-base-100 rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold mb-4">No purchases yet</h2>
            <p className="text-base-content/60 mb-6">
              Start shopping to see your purchase history here
            </p>
            <Link href="/examples/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = purchases.reduce((total, purchase) => total + purchase.totalCents, 0);
  const totalItems = purchases.reduce((total, purchase) => 
    total + purchase.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0
  );

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Purchases</h1>
          <Link href="/examples/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-base-100 p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-primary">
              ${(totalSpent / 100).toFixed(2)}
            </div>
            <div className="text-sm text-base-content/60">Total Spent</div>
          </div>
          <div className="bg-base-100 p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-secondary">
              {purchases.length}
            </div>
            <div className="text-sm text-base-content/60">Total Orders</div>
          </div>
          <div className="bg-base-100 p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-accent">
              {totalItems}
            </div>
            <div className="text-sm text-base-content/60">Items Purchased</div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-base-100 rounded-lg shadow">
              <div className="p-6 border-b border-base-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{purchase.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-base-content/60">
                      {purchase.purchasedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${(purchase.totalCents / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-base-content/60">
                      {purchase.items.length} items
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="flex-shrink-0">
                        <Link href={`/examples/product/${item.product.id}/view`}>
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-base-300">
                            <Image
                              src={item.product.imageUrl || "/default-product.png"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/examples/product/${item.product.id}/view`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-base-content/60 truncate">
                          {item.product.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.product.shopCategoryLinks.map((link) => (
                            <span key={link.category.id} className="badge badge-outline badge-xs">
                              {link.category.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          ${(item.priceAtPurchase / 100).toFixed(2)} × {item.quantity}
                        </div>
                        <div className="text-sm text-base-content/60">
                          Total: ${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-base-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-base-content/60">
                      Order Total
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${(purchase.totalCents / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
