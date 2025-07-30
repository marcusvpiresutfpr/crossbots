"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { updateQuantity, removeFromList, togglePurchased } from "./actions";

interface ShoppingListItemProps {
  item: {
    id: string;
    quantity: number;
    isPurchased: boolean;
    purchasedAt: Date | null;
    product: {
      id: string;
      name: string;
      description: string;
      priceCents: number;
      imageUrl: string;
      shopCategoryLinks: Array<{
        category: {
          id: string;
          name: string;
        };
      }>;
    };
  };
}

export function ShoppingListItem({ item }: ShoppingListItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsLoading(true);
    setQuantity(newQuantity);
    
    await updateQuantity(item.id, newQuantity);
    setIsLoading(false);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    await removeFromList(item.id);
    setIsLoading(false);
  };

  const handleTogglePurchased = async () => {
    setIsLoading(true);
    await togglePurchased(item.id, !item.isPurchased);
    setIsLoading(false);
  };

  const itemTotal = item.product.priceCents * quantity;

  return (
    <div className={`flex gap-4 p-4 border border-base-300 rounded-lg ${
      item.isPurchased ? "opacity-60 bg-success/5" : "bg-base-100"
    }`}>
      <div className="flex-shrink-0">
        <Link href={`/examples/product/${item.product.id}/view`}>
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-base-300">
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
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link 
              href={`/examples/product/${item.product.id}/view`}
              className="font-semibold hover:text-primary transition-colors"
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
            <div className="font-bold text-primary">
              ${(itemTotal / 100).toFixed(2)}
            </div>
            <div className="text-xs text-base-content/60">
              ${(item.product.priceCents / 100).toFixed(2)} each
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!item.isPurchased && (
              <>
                <button
                  className="btn btn-sm btn-circle btn-outline"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={isLoading || quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2 font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  className="btn btn-sm btn-circle btn-outline"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isLoading}
                >
                  +
                </button>
              </>
            )}
            
            {item.isPurchased && (
              <div className="flex items-center gap-2">
                <span className="badge badge-success">Purchased</span>
                <span className="text-sm text-base-content/60">
                  Qty: {quantity}
                </span>
                {item.purchasedAt && (
                  <span className="text-xs text-base-content/40">
                    {item.purchasedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${
                item.isPurchased ? "btn-outline" : "btn-success btn-outline"
              }`}
              onClick={handleTogglePurchased}
              disabled={isLoading}
            >
              {item.isPurchased ? "Mark Unpurchased" : "Mark Purchased"}
            </button>
            <button
              className="btn btn-sm btn-error btn-outline"
              onClick={handleRemove}
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
