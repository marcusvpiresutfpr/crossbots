import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ResetPasswordButton from "./reset-password-button";

export default async function MemberPwdResetPage() {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "LEADER") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true }
  });

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Member Password Reset</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Reset Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <ResetPasswordButton userId={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
