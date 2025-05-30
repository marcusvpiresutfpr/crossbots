import { getUser } from "@/lib/queries";

import LoginForm from "./LoginForm";
import SignOut from "./SignOut";

export async function AuthButton() {
  const user = await getUser();
  console.log("AuthServer user:", user);
  // TODO: Could dynamic load the sign-in/sign-up and sign-out components as they're not used on initial render
  if (!user)
    return (
      <>
        <button
          className="btn"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" } as React.CSSProperties}
        >
          Login
        </button>
        <div
          className="dropdown menu w-sm max-w-screen rounded-box bg-base-100 shadow-sm p-4"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
        >
          <AuthButton />
        </div>
      </>
    );
  else return <SignOut username={user.username} role={user.role} />;
}
