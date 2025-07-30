import { getUser } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "./logout-button";

export async function UserDropdown() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/examples/auth/login" className="btn btn-ghost btn-sm">
          Login
        </Link>
        <Link href="/examples/auth/register" className="btn btn-primary btn-sm">
          Sign Up
        </Link>
      </div>
    );
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "LEADER": return "badge-error";
      case "ADMIN": return "badge-warning";
      case "MEMBER": return "badge-success";
      default: return "badge-ghost";
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <Image
            alt={user.name}
            src={user.imageUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300">
        <li className="menu-title">
          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs opacity-60">{user.email}</span>
            <span className={`badge ${getRoleBadgeClass(user.role)} badge-xs mt-1`}>
              {user.role}
            </span>
          </div>
        </li>
        <div className="divider my-1"></div>
        <li>
          <Link href="/examples/user" className="justify-between">
            Profile
            <span className="badge badge-primary badge-xs">View</span>
          </Link>
        </li>
        <li>
          <Link href="/examples/user/shopping-list">Shopping List</Link>
        </li>
        <li>
          <Link href="/examples/user/purchases">Purchase History</Link>
        </li>
        <li>
          <Link href="/my-profile">Settings</Link>
        </li>
        <div className="divider my-1"></div>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
}
