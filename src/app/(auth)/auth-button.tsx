import AuthForm from "./auth-forms";
import { getUser, signOut } from "@/lib/session";

export async function AuthButton() {
  const user = await getUser();

  if (user) return (
    <div>
      <p>You are log'in as</p>
      <div className="flex items-center gap-2">
        <img
          src={user.imageUrl || "https://example.com/user-image.jpg"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span>{user.name}</span>
        <span className="text-sm text-gray-500">{user.email}</span>
      </div>
      <form action={async () => { "use server"; await signOut(); }} method="post">
        <button type="submit" className="btn btn-primary mt-2">
          Sign Out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <button className="btn" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" } as React.CSSProperties}>
        Login
      </button>

      <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}>
        <AuthForm />
      </ul>
    </>
  );
}