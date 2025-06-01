import prisma from "@/lib/prisma";
import CompetitionForm from "./competition-form";

export default async function CompetitionFormPage({ searchParams }: { searchParams: { id?: string } }) {
  const initialCompetitionId = searchParams.id;

  const initialData = initialCompetitionId ? await prisma.competition.findUnique({
    where: { id: initialCompetitionId },
  }) : null;

  return <CompetitionForm initialData={initialData} />;
}

