"use client";
import { useTransition } from "react";
import { changeUserRole } from "./role-actions";
import { User } from "@prisma/client";

const roles = ["LEADER", "ADMIN", "MEMBER", "VISITOR"] as const;

export default function ChangeUserRoleButton({
  currentUserRole,
  userId,
  userRole,
}: {
  currentUserRole: User["role"];
  userId: string;
  userRole: string;
}) {
  const [pending, startTransition] = useTransition();

  // Don't allow changing own role
  if (currentUserRole === userRole && currentUserRole !== "LEADER") return null;

  let allowedRoles: string[] = [];
  if (currentUserRole === "LEADER") {
    allowedRoles = roles.filter((role) => role !== userRole);
  } else if (currentUserRole === "ADMIN") {
    allowedRoles = roles.filter(
      (role) => role !== "LEADER" && role !== "ADMIN" && role !== userRole
    );
  }

  // For LEADER, allow changing any user's role (including other leaders)
  // For ADMIN, only allow changing roles of users who are not ADMIN or LEADER

  return (
    <select
      className="select select-xs select-bordered"
      value={userRole}
      disabled={pending}
      onChange={(e) => {
        const newRole = e.target.value;
        if (newRole !== userRole) {
          startTransition(() => changeUserRole(userId, newRole));
        }
      }}
    >
      <option disabled value={userRole}>
        {userRole}
      </option>
      {allowedRoles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
