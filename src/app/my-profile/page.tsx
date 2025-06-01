import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import ProfileForm from "./profile-form";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      bio: true,
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  return <ProfileForm initialData={dbUser} />;
}
