"use client";

import { useState } from "react";
import { purchaseAllItems } from "./actions";

interface PurchaseAllButtonProps {
  totalAmount: number;
  itemCount: number;
}

export function PurchaseAllButton({ totalAmount, itemCount }: PurchaseAllButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePurchaseAll = async () => {
    setIsLoading(true);
    setMessage("");
    
    const result = await purchaseAllItems();
    
    setMessage(result.message);
    setIsLoading(false);
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(""), 5000);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-lg font-semibold">
          Purchase all {itemCount} items for ${(totalAmount / 100).toFixed(2)}
        </div>
      </div>
      
      <button
        className="btn btn-primary btn-lg"
        onClick={handlePurchaseAll}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          <>
            🛒 Purchase All Items
          </>
        )}
      </button>

      {message && (
        <div className={`alert mt-4 ${
          message.includes("success") ? "alert-success" : "alert-error"
        }`}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
