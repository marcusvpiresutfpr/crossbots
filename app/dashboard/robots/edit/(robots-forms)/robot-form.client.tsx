"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import MemberSelector from "./member-selector";
import CompetitionSelector from "./competition-selector";

import { useState } from "react";
import { getRobotWithRelations } from "@/lib/queries";

interface RobotFormClientProps {
  membersNames: { id: number; name: string }[];
  competitionsNames: { id: number; name: string }[];
  initialValues: Awaited<ReturnType<typeof getRobotWithRelations>> | null;
  robotId: number | null;
}

export default function RobotFormClient({
  membersNames,
  competitionsNames,
  initialValues,
  robotId,
}: RobotFormClientProps) {
  const router = useRouter();
  const editMode = robotId !== null;

  // Controlled state for selectors
  const [selectedContributors, setSelectedContributors] = useState<{ id: number; name: string; active: boolean }[]>(
    initialValues?.contributors
      ? membersNames
          .filter((m) => initialValues.contributors.some((c) => c.memberId === m.id))
          .map((m) => ({
            ...m,
            active: !!initialValues.contributors.find((c) => c.memberId === m.id && c.isActive === 1),
          }))
      : []
  );
  const [selectedCompetitions, setSelectedCompetitions] = useState<{ id: number; name: string }[]>(
    initialValues?.competitions
      ? competitionsNames.filter((c) => initialValues.competitions.some((comp) => comp.competitionId === c.id))
      : []
  );

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Remove any memberIds/competitionIds from uncontrolled inputs
    formData.delete("memberIds");
    formData.delete("competitionIds");

    // Add controlled selector data
    selectedContributors.forEach((member) => {
      formData.append("memberIds", String(member.id));
      formData.append(`memberIds_active_${member.id}`, member.active ? "1" : "0");
    });
    selectedCompetitions.forEach((comp) => {
      formData.append("competitionIds", String(comp.id));
    });

    try {
      let res: Response;
      if (robotId) {
        res = await fetch(`/api/robots/${robotId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/robots", {
          method: "POST",
          body: formData,
        });
      }
      if (res.ok) {
        router.push("/dashboard/robots");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Failed to save robot");
      }
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="w-full space-y-4 overflow-hidden" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Name</legend>
        <input
          className="input w-full"
          name="name"
          placeholder="Name"
          required
          defaultValue={initialValues?.name || ""}
        />
      </fieldset>
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Description</legend>
        <textarea
          className="textarea w-full"
          name="description"
          rows={10}
          placeholder="Description"
          required
          defaultValue={initialValues?.description || ""}
        />
      </fieldset>
      <fieldset className="fieldset w-full">
        <select className="select w-full" name="status" defaultValue={initialValues?.status || "validation"}>
          <option value="validation">Validation</option>
          <option value="canceled">Canceled</option>
          <option value="active">Active</option>
          <option value="retiree">Retiree</option>
        </select>
      </fieldset>
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Image URL</legend>
        <input
          className="input w-full"
          name="image"
          placeholder="Image URL"
          required
          defaultValue={initialValues?.image || ""}
        />
        <p className="label">Post an image on crossbots google drive and paste the link here</p>
      </fieldset>
      <MemberSelector members={membersNames} selected={selectedContributors} setSelected={setSelectedContributors} />
      <CompetitionSelector
        competitions={competitionsNames}
        selected={selectedCompetitions}
        setSelected={setSelectedCompetitions}
      />
      <div className="flex gap-4">
        <button className="btn btn-success flex-1" type="submit" disabled={pending}>
          {pending ? (editMode ? "Saving..." : "Adding...") : editMode ? "Save Robot" : "Add Robot"}
        </button>
        <Link className="btn btn-neutral" type="button" href="/dashboard/robots">
          Cancel
        </Link>
      </div>
    </form>
  );
}
