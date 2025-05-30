import { getUser } from "@/lib/queries";
import LoginForm from "../(auth)/LoginForm";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user)
    return (
      <div className="flex h-screen w-full max-w-screen items-center justify-center">
        <div className="w-md">
          <LoginForm />
        </div>
      </div>
    );
  if (["admin", "Sovereign Lord", "member"].includes(user.role)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
    </div>
  );
}
