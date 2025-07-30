import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ShoppingListItem } from "./shopping-list-item";
import { PurchaseAllButton } from "./purchase-all-button";

// For demo purposes, we'll use a hardcoded user ID
const DEMO_USER_ID = "demo-user-1";

export default async function ShoppingListPage() {
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

  // Get the user's shopping list
  const shoppingList = await prisma.shopList.findFirst({
    where: { 
      userId: DEMO_USER_ID,
      isArchived: false,
    },
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
        orderBy: { addedAt: "desc" },
      },
    },
  });

  if (!shoppingList || shoppingList.items.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Shopping List</h1>
          <div className="bg-base-100 rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your shopping list is empty</h2>
            <p className="text-base-content/60 mb-6">
              Browse our products and add items to your shopping list
            </p>
            <Link href="/examples/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unpurchasedItems = shoppingList.items.filter(item => !item.isPurchased);
  const purchasedItems = shoppingList.items.filter(item => item.isPurchased);
  
  const totalUnpurchased = unpurchasedItems.reduce((total, item) => {
    return total + (item.product.priceCents * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Shopping List</h1>
          <Link href="/examples/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>

        {unpurchasedItems.length > 0 && (
          <div className="bg-base-100 rounded-lg shadow mb-8">
            <div className="p-6 border-b border-base-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items to Purchase</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${(totalUnpurchased / 100).toFixed(2)}
                  </div>
                  <div className="text-sm text-base-content/60">
                    {unpurchasedItems.length} items
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {unpurchasedItems.map((item) => (
                  <ShoppingListItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="border-t border-base-300 pt-4">
                <PurchaseAllButton 
                  totalAmount={totalUnpurchased}
                  itemCount={unpurchasedItems.length}
                />
              </div>
            </div>
          </div>
        )}

        {purchasedItems.length > 0 && (
          <div className="bg-base-100 rounded-lg shadow">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold text-success">Recently Purchased</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {purchasedItems.map((item) => (
                  <ShoppingListItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
