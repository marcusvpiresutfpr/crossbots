import prisma from "../lib/prisma";
import { AuthMenu } from "./(auth)/auth-menu";

export default async function HomePage() {
  const robots = await prisma.robot.findMany();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg">This is a simple Next.js application.</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Robots List</h2>
        <ul className="list-disc pl-5">
          {robots.map((robot) => (
            <li key={robot.id} className="mb-2">
              {robot.name} - {robot.id}
            </li>
          ))}
        </ul>
      </div>

      <AuthMenu />
    </div>
  );
}
