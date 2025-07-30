"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// For demo purposes, we'll use a hardcoded user ID
// In a real app, you'd get this from authentication
const DEMO_USER_ID = "demo-user-1";

export async function addToShoppingList(productId: string, quantity: number = 1) {
  try {
    // First, ensure we have a demo user
    let user = await prisma.user.findUnique({
      where: { id: DEMO_USER_ID },
    });

    if (!user) {
      // Create a demo user if it doesn't exist
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

    // Get or create the user's default shopping list
    let shoppingList = await prisma.shopList.findFirst({
      where: { 
        userId: DEMO_USER_ID,
        isArchived: false,
      },
    });

    if (!shoppingList) {
      shoppingList = await prisma.shopList.create({
        data: {
          userId: DEMO_USER_ID,
          name: "My Shopping List",
        },
      });
    }

    // Check if the product is already in the list
    const existingItem = await prisma.shopListItem.findUnique({
      where: {
        listId_productId: {
          listId: shoppingList.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity if item already exists
      await prisma.shopListItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item to the list
      await prisma.shopListItem.create({
        data: {
          listId: shoppingList.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    revalidatePath("/examples/user/shopping-list");
    return { success: true, message: "Added to shopping list!" };
  } catch (error) {
    console.error("Error adding to shopping list:", error);
    return { success: false, message: "Failed to add to shopping list" };
  }
}

export async function buyProduct(productId: string, quantity: number = 1) {
  try {
    // Get the product to get its price
    const product = await prisma.shopProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Ensure we have a demo user
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

    const totalCents = product.priceCents * quantity;

    // Create a purchase
    const purchase = await prisma.shopPurchase.create({
      data: {
        userId: DEMO_USER_ID,
        totalCents: totalCents,
        items: {
          create: {
            productId: productId,
            quantity: quantity,
            priceAtPurchase: product.priceCents,
          },
        },
      },
    });

    revalidatePath("/examples/user/purchases");
    return { success: true, message: "Purchase completed!", purchaseId: purchase.id };
  } catch (error) {
    console.error("Error processing purchase:", error);
    return { success: false, message: "Purchase failed" };
  }
}
