import { getUser } from "@/lib/session";

import AuthForm from "../(auth)/auth-forms";
import Link from "next/link";
import DashboardNavbar from "./navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) return <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content flex-col lg:flex-row-reverse lg:w-full lg:justify-around">
      <div className="text-center lg:text-left max-w-md">
        <h1 className="text-5xl font-bold">Welcome to the Dashboard</h1>
        <p className="py-6">
          Please log in to access your dashboard. If you are a crossbots member, create an account using your email address and request to a ADMIN to approve your membership. If you are not a member, you can still create an account but you does not have access to the dashboard.
        </p>
      </div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <AuthForm />
        </div>
      </div>
    </div>
  </div>

  // If role includes ADMIN, MEMBER or LEADER, allow access to the dashboard
  if (user.role && ["ADMIN", "MEMBER", "LEADER"].includes(user.role)) {
    return <DashboardNavbar>{children}</DashboardNavbar>;
  }

  return <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold text-error">Access Denied</h1>
        <p className="py-6">
          You do not have permission to access this dashboard. If you are a member of crossbots, please contact an ADMIN to request access. If you are not a member, you can still create an account but you will not have access to the dashboard.
        </p>
        <Link href={"/"} className="btn btn-neutral">Return to homepage</Link>
      </div>
    </div>
  </div>
}
