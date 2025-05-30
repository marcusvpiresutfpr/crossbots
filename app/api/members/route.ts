import { getCrossbotsMembersNames } from "@/lib/queries";

export async function GET() {
  const members = await getCrossbotsMembersNames();
  return Response.json(members);
}
