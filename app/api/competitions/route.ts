import { getCompetitions } from "@/lib/queries";

export async function GET() {
  const competitions = await getCompetitions();
  return Response.json(competitions);
}
