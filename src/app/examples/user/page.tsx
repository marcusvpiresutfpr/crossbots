import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function UserProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/examples/auth/login");
  }

  // Get user's shopping statistics
  const [shoppingList, purchases, robotEngagements] = await Promise.all([
    prisma.shopList.findFirst({
      where: { 
        userId: user.id,
        isArchived: false,
      },
      include: {
        items: {
          where: { isPurchased: false },
          include: { product: true },
        },
      },
    }),
    prisma.shopPurchase.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { purchasedAt: "desc" },
      take: 5,
    }),
    prisma.userRobotEngagement.findMany({
      where: { 
        userId: user.id,
        isActive: true,
      },
      include: {
        robot: {
          include: {
            robotAwards: {
              include: { competition: true },
            },
          },
        },
      },
    }),
  ]);

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalCents, 0);
  const totalItemsPurchased = purchases.reduce((sum, purchase) => 
    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const cartItemsCount = shoppingList?.items.length || 0;
  const cartTotal = shoppingList?.items.reduce((sum, item) => 
    sum + (item.product.priceCents * item.quantity), 0
  ) || 0;

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "LEADER": return "badge-error";
      case "ADMIN": return "badge-warning";
      case "MEMBER": return "badge-success";
      default: return "badge-ghost";
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full border-4 border-white">
                  <Image
                    src={user.imageUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-white/80 mb-2">{user.email}</p>
                <div className="flex justify-center md:justify-start">
                  <span className={`badge ${getRoleBadgeClass(user.role)} badge-lg`}>
                    {user.role}
                  </span>
                </div>
                {user.bio && (
                  <p className="mt-3 text-white/90">{user.bio}</p>
                )}
              </div>
              <div className="text-center">
                <div className="text-sm text-white/80">Member since</div>
                <div className="font-semibold">
                  {user.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat bg-primary/10 rounded-lg p-4 text-center">
                <div className="stat-value text-primary">${(totalSpent / 100).toFixed(2)}</div>
                <div className="stat-title">Total Spent</div>
              </div>
              <div className="stat bg-secondary/10 rounded-lg p-4 text-center">
                <div className="stat-value text-secondary">{purchases.length}</div>
                <div className="stat-title">Orders Made</div>
              </div>
              <div className="stat bg-accent/10 rounded-lg p-4 text-center">
                <div className="stat-value text-accent">{totalItemsPurchased}</div>
                <div className="stat-title">Items Bought</div>
              </div>
              <div className="stat bg-info/10 rounded-lg p-4 text-center">
                <div className="stat-value text-info">{robotEngagements.length}</div>
                <div className="stat-title">Active Robots</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                  <h3 className="card-title">Shopping Cart</h3>
                  <p>{cartItemsCount} items • ${(cartTotal / 100).toFixed(2)}</p>
                  <div className="card-actions justify-end">
                    <Link href="/examples/user/shopping-list" className="btn btn-primary btn-sm">
                      View Cart
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                  <h3 className="card-title">Purchase History</h3>
                  <p>{purchases.length} total orders</p>
                  <div className="card-actions justify-end">
                    <Link href="/examples/user/purchases" className="btn btn-secondary btn-sm">
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Purchases */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Recent Purchases</h3>
                {purchases.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <div className="text-4xl mb-2">🛒</div>
                    <p>No purchases yet</p>
                    <Link href="/examples/products" className="btn btn-sm btn-primary mt-2">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.slice(0, 3).map((purchase) => (
                      <div key={purchase.id} className="flex justify-between items-center p-3 bg-base-200 rounded">
                        <div>
                          <div className="font-medium">
                            Order #{purchase.id.slice(-8)}
                          </div>
                          <div className="text-sm text-base-content/60">
                            {purchase.items.length} items • {purchase.purchasedAt.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            ${(purchase.totalCents / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link href="/examples/user/purchases" className="btn btn-outline btn-sm btn-block">
                      View All Orders
                    </Link>
                  </div>
                )}
              </div>

              {/* Active Robots */}
              <div>
                <h3 className="text-xl font-semibold mb-4">My Robots</h3>
                {robotEngagements.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <div className="text-4xl mb-2">🤖</div>
                    <p>No robots yet</p>
                    <Link href="/examples/robots" className="btn btn-sm btn-primary mt-2">
                      Browse Robots
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {robotEngagements.slice(0, 3).map((engagement) => (
                      <div key={engagement.robotId} className="flex justify-between items-center p-3 bg-base-200 rounded">
                        <div>
                          <div className="font-medium">
                            <Link 
                              href={`/examples/robot/${engagement.robot.id}/view`}
                              className="hover:text-primary transition-colors"
                            >
                              {engagement.robot.name}
                            </Link>
                          </div>
                          <div className="text-sm text-base-content/60">
                            {engagement.robot.robotAwards.length} awards
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="badge badge-success badge-sm">Active</div>
                        </div>
                      </div>
                    ))}
                    <Link href="/examples/robots" className="btn btn-outline btn-sm btn-block">
                      View All Robots
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="mt-8 pt-6 border-t border-base-300">
              <div className="flex flex-wrap gap-4">
                <Link href="/my-profile" className="btn btn-outline">
                  Edit Profile
                </Link>
                <Link href="/examples/products" className="btn btn-primary">
                  Browse Products
                </Link>
                <Link href="/examples/robots" className="btn btn-secondary">
                  Browse Robots
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
