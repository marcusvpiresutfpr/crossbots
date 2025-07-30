"use client";

import { useState } from "react";
import { addToShoppingList, buyProduct } from "./actions";

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: number;
}

export function BuyButton({ productId, productName, price }: BuyButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage("");
    
    const result = await addToShoppingList(productId, quantity);
    
    setMessage(result.message);
    setIsLoading(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    setMessage("");
    
    const result = await buyProduct(productId, quantity);
    
    setMessage(result.message);
    setIsLoading(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Purchase Options</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="label">
            <span className="label-text">Quantity:</span>
          </label>
          <div className="flex items-center">
            <button 
              className="btn btn-sm btn-circle btn-outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="mx-4 text-lg font-semibold min-w-[3rem] text-center">
              {quantity}
            </span>
            <button 
              className="btn btn-sm btn-circle btn-outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="text-lg font-bold text-primary mb-4">
          Total: ${((price * quantity) / 100).toFixed(2)}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          className="btn btn-primary btn-block"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Buy Now"
          )}
        </button>
        
        <button 
          className="btn btn-outline btn-block"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>

      {message && (
        <div className={`alert mt-4 ${message.includes("success") || message.includes("completed") ? "alert-success" : "alert-error"}`}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
