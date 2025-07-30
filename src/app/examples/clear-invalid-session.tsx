"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ClearInvalidSession() {
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const clearSession = async () => {
    setIsClearing(true);
    try {
      await fetch("/api/clear-session", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Failed to clear session:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="alert alert-warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <div>
        <h3 className="font-bold">Session Issue Detected</h3>
        <div className="text-xs">Invalid session token found. Please clear your session.</div>
      </div>
      <button
        className="btn btn-sm"
        onClick={clearSession}
        disabled={isClearing}
      >
        {isClearing ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Clearing...
          </>
        ) : (
          "Clear Session"
        )}
      </button>
    </div>
  );
}
