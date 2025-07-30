import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export async function CartIndicator() {
  const user = await getUser();
  
  if (!user) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="badge badge-sm indicator-item">0</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
          <div className="card-body">
            <span className="text-lg font-bold">Cart Empty</span>
            <span className="text-info">Please login to shop</span>
            <div className="card-actions">
              <Link href="/examples/auth/login" className="btn btn-primary btn-block btn-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get user's shopping list
  const shoppingList = await prisma.shopList.findFirst({
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
  });

  const itemCount = shoppingList?.items.length || 0;
  const cartTotal = shoppingList?.items.reduce((sum, item) => 
    sum + (item.product.priceCents * item.quantity), 0
  ) || 0;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="badge badge-sm indicator-item">{itemCount}</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div className="card-body">
          <span className="text-lg font-bold">{itemCount} Items</span>
          <span className="text-info">Subtotal: ${(cartTotal / 100).toFixed(2)}</span>
          <div className="card-actions">
            <Link href="/examples/user/shopping-list" className="btn btn-primary btn-block">
              View cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
