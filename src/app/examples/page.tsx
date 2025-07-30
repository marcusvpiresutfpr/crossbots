import Link from "next/link";
import { getUser } from "@/lib/session";

export default async function ExamplesPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to CrossBots</h1>
          <p className="text-xl text-base-content/70 mb-8">
            Explore our robotics community, browse products, and manage your account
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link href="/examples/auth/login" className="btn btn-primary btn-lg">
                Login
              </Link>
              <Link href="/examples/auth/register" className="btn btn-outline btn-lg">
                Sign Up
              </Link>
            </div>
          )}
          {user && (
            <div className="bg-base-100 rounded-lg p-6 shadow-lg inline-block">
              <p className="text-lg mb-4">Welcome back, <span className="font-semibold">{user.name}</span>!</p>
              <Link href="/examples/user" className="btn btn-primary">
                View Profile
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Robots Section */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">🤖</div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Robots</h2>
              <p>Explore our collection of amazing robots and their achievements</p>
              <div className="card-actions">
                <Link href="/examples/robots" className="btn btn-primary">
                  Browse Robots
                </Link>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">🛒</div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Products</h2>
              <p>Shop for robotics components, tools, and accessories</p>
              <div className="card-actions">
                <Link href="/examples/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>

          {/* User Account Section */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">👤</div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">My Account</h2>
              <p>Manage your profile, orders, and shopping preferences</p>
              <div className="card-actions">
                {user ? (
                  <Link href="/examples/user" className="btn btn-primary">
                    View Profile
                  </Link>
                ) : (
                  <Link href="/examples/auth/login" className="btn btn-primary">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Shopping List */}
          {user && (
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="text-6xl">📝</div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Shopping List</h2>
                <p>View and manage your saved products</p>
                <div className="card-actions">
                  <Link href="/examples/user/shopping-list" className="btn btn-secondary">
                    View List
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Purchase History */}
          {user && (
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="text-6xl">📦</div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Orders</h2>
                <p>Track your purchase history and orders</p>
                <div className="card-actions">
                  <Link href="/examples/user/purchases" className="btn btn-accent">
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard (for admins/leaders) */}
          {user && (user.role === "ADMIN" || user.role === "LEADER") && (
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="text-6xl">⚙️</div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Dashboard</h2>
                <p>Access admin features and management tools</p>
                <div className="card-actions">
                  <Link href="/dashboard" className="btn btn-warning">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {!user && (
          <div className="mt-16 text-center">
            <div className="bg-base-100 rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
              <p className="text-base-content/70 mb-6">
                Create an account to access all features, save your favorite products, and connect with other robotics enthusiasts.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/examples/auth/register" className="btn btn-primary">
                  Create Account
                </Link>
                <Link href="/examples/auth/login" className="btn btn-ghost">
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
