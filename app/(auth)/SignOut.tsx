"use client";

import { User } from "@/db/schema";
import React from "react";

// roles = "admin" | "Sovereign Lord" | "member" | "viewer"

const links = [
  { href: "/account", label: "Account", allowedRoles: ["admin", "Sovereign Lord", "member", "viewer"] },
  { href: "/dashboard", label: "Dashboard", allowedRoles: ["admin", "Sovereign Lord", "member"] },
  { href: "/admin", label: "Admin", allowedRoles: ["admin"] },
  { href: "/sanctuary", label: "Sanctuary", allowedRoles: ["Sovereign Lord"] },
];

export default function SignOut({ username, role }: { username: string; role: User["role"] }) {
  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost" type="button">
        {username}
      </button>
      <div className="dropdown-content z-[1] card bg-base-100 shadow p-4 w-80">
        <ul className="menu w-full p-0 m-0">
          {links.map((link) => {
            if (link.allowedRoles.includes(role)) {
              return (
                <li key={link.href}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              );
            }
            return null;
          })}
        </ul>
        <div className="divider"></div>
        <button type="submit" className="btn btn-sm btn-neutral w-full">
          Sign out
        </button>
      </div>
    </div>
  );
}
