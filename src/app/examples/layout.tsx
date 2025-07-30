import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { CartIndicator } from "./cart-indicator";

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href="/examples" className="btn btn-ghost text-xl">CrossBots</Link>
          <div className="hidden lg:flex ml-4">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/examples/robots">Robots</Link></li>
              <li><Link href="/examples/products">Products</Link></li>
              <li><Link href="/examples/user/shopping-list">Shopping List</Link></li>
              <li><Link href="/examples/user/purchases">Purchases</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex-none">
          <CartIndicator />
          <UserDropdown />
        </div>
      </div>
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
}
