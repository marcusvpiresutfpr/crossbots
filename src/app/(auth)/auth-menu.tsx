import dynamic from "next/dynamic";
import AuthForm from "./auth-forms";
import UserDropdown from "./user-dropdown";

import { getUser } from "@/lib/session";

export async function AuthMenu() {
  const user = await getUser();

  if (user) return <UserDropdown user={user} />;

  return (
    <>
      <button className="btn" popoverTarget="popover-login" style={{ anchorName: "--anchor-login" } as React.CSSProperties}>
        Login
      </button>
      <ul
        className="dropdown w-full max-w-md rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-login"
        style={{ positionAnchor: "--anchor-login" } as React.CSSProperties}
      >
        <AuthForm />
      </ul>
    </>
  );
}
