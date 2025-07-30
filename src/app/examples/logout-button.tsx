"use client";

import { logoutUser } from "./auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutUser("/examples");
    router.push("/examples");
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center w-full text-left"
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs mr-2"></span>
          Logging out...
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
}
