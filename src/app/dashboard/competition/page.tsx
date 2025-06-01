import prisma from "@/lib/prisma";
import CompetitionForm from "./competition-form";

interface SearchParams {
  id?: string;
}

export default async function CompetitionFormPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialCompetitionId = resolvedSearchParams.id;

  const initialData = initialCompetitionId
    ? await prisma.competition.findUnique({
        where: { id: initialCompetitionId },
      })
    : null;

  return <CompetitionForm initialData={initialData} />;
}
