"use client";
import { useTransition } from "react";
import { resetUserPassword } from "./reset-password-actions";

export default function ResetPasswordButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-xs btn-warning"
      disabled={pending}
      onClick={() => startTransition(() => resetUserPassword(userId))}
    >
      Reset to default
    </button>
  );
}
