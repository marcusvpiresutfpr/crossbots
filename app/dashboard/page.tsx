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

  if (!["admin", "Sovereign Lord", "member"].includes(user.role)) {
    // If the user is not an admin or Sovereign Lord, show a message
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <p>Welcome to the dashboard. Use the sidebar to navigate.</p>
    </div>
  );
}
