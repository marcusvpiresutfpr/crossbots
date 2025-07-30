"use client";

import { useEffect } from "react";
import { clearInvalidSession } from "./auth/actions";

interface SessionErrorHandlerProps {
  children: React.ReactNode;
}

export function SessionErrorHandler({ children }: SessionErrorHandlerProps) {
  useEffect(() => {
    // Listen for unhandled promise rejections related to JWT
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
        console.log("Clearing invalid session due to JWT error");
        clearInvalidSession();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return <>{children}</>;
}
