import { getUser } from "@/lib/queries";

import LoginForm from "./LoginForm";
import SignOut from "./SignOut";

export async function AuthServer() {
  const user = await getUser();
  console.log("AuthServer user:", user);
  // TODO: Could dynamic load the sign-in/sign-up and sign-out components as they're not used on initial render
  if (!user) return <LoginForm />;
  else return <SignOut username={user.username} role={user.role} />;
}
