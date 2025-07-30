"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// For demo purposes, we'll use a hardcoded user ID
const DEMO_USER_ID = "demo-user-1";

export async function updateQuantity(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.shopListItem.delete({
        where: { id: itemId },
      });
    } else {
      await prisma.shopListItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    revalidatePath("/examples/user/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Error updating quantity:", error);
    return { success: false, message: "Failed to update quantity" };
  }
}

export async function removeFromList(itemId: string) {
  try {
    await prisma.shopListItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/examples/user/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Error removing item:", error);
    return { success: false, message: "Failed to remove item" };
  }
}

export async function togglePurchased(itemId: string, isPurchased: boolean) {
  try {
    await prisma.shopListItem.update({
      where: { id: itemId },
      data: { 
        isPurchased,
        purchasedAt: isPurchased ? new Date() : null,
      },
    });

    revalidatePath("/examples/user/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Error toggling purchased status:", error);
    return { success: false, message: "Failed to update item" };
  }
}

export async function purchaseAllItems() {
  try {
    // Get all unpurchased items from the user's shopping list
    const shoppingList = await prisma.shopList.findFirst({
      where: { 
        userId: DEMO_USER_ID,
        isArchived: false,
      },
      include: {
        items: {
          where: { isPurchased: false },
          include: { product: true },
        },
      },
    });

    if (!shoppingList || shoppingList.items.length === 0) {
      return { success: false, message: "No items to purchase" };
    }

    // Calculate total
    const totalCents = shoppingList.items.reduce((total, item) => {
      return total + (item.product.priceCents * item.quantity);
    }, 0);

    // Create purchase
    const purchase = await prisma.shopPurchase.create({
      data: {
        userId: DEMO_USER_ID,
        totalCents,
        items: {
          create: shoppingList.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.priceCents,
          })),
        },
      },
    });

    // Mark all items as purchased
    await prisma.shopListItem.updateMany({
      where: {
        listId: shoppingList.id,
        isPurchased: false,
      },
      data: {
        isPurchased: true,
        purchasedAt: new Date(),
      },
    });

    revalidatePath("/examples/user/shopping-list");
    revalidatePath("/examples/user/purchases");
    return { success: true, message: "All items purchased successfully!", purchaseId: purchase.id };
  } catch (error) {
    console.error("Error purchasing all items:", error);
    return { success: false, message: "Failed to complete purchase" };
  }
}
