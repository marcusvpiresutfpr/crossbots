import { getUser } from "@/lib/queries";
import LoginForm from "../(auth)/LoginForm";
import Link from "next/link";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user)
    return (
      <div className="flex h-screen w-full max-w-screen items-center justify-center">
        <div className="w-md">
          <LoginForm />
        </div>
      </div>
    );

  if (!["admin", "Sovereign Lord", "member"].includes(user.role)) {
    // If the user is not an admin or Sovereign Lord, show a message
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-80 p-4">
            <li>
              <span className="text-2xl font-bold">Dashboard</span>
            </li>
            <div className="divider"></div>
            <li>
              <Link href="/dashboard/overview">Overview</Link>
            </li>
            <li>
              <Link href="/dashboard/robots">Robots</Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
}
