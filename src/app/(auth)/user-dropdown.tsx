"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { logoutUser } from "./actions";
import { User } from "@prisma/client";

const menuLinks = [
  { href: "/my-profile", label: "My profile", allowed: ["LEADER", "ADMIN", "MEMBER", "VISITOR"] },
  { href: "/dashboard", label: "Dashboard", allowed: ["LEADER", "ADMIN", "MEMBER"] },
  { href: "/dashboard/membership-admin", label: "Membership Admin", allowed: ["ADMIN", "LEADER"] },
  { href: "/member-pwd-reset", label: "Member Password Reset", allowed: ["LEADER"] },
];

export default function UserDropdown({ user }: { user: User }) {

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn avatar btn-ghost btn-circle">
        <div className="mask mask-squircle w-full">
          <Image
            src={user.imageUrl || "https://picsum.photos/id/237/200/300"}
            alt={user.name || "User Avatar"}
            width={32}
            height={32}
          />
        </div>
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {
          menuLinks.map((link) => (
            user.role && link.allowed.includes(user.role) && (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            )
          ))
        }
        <div className="divider my-1"></div>
        <li>
          <button className="btn btn-sm btn-block btn-neutral" onClick={() => logoutUser()}>
            Logout
          </button>
        </li>
      </ul>
    </details>
  );
}
