"use client"

import React, { useState } from "react";
import Link from "next/link";

import { Competition } from "@prisma/client";
import { DayPicker } from "react-day-picker";
import { createCompetition, updateCompetition } from "./actions.server";

type FormState = "Initial" | "Pending" | "Success" | "Error";

interface CompetitionFormProps {
  initialData: Competition | null;
}

export default function CompetitionForm({ initialData }: CompetitionFormProps) {
  const [formState, setFormState] = useState<FormState>("Initial");
  const [message, setMessage] = useState<string>("");
  const [competitionId, setCompetitionId] = useState<string | null>(initialData?.id || null);
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("Pending");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.set("date", date.toISOString());
    }

    try {
      let result;
      if (competitionId) {
        result = await updateCompetition(competitionId, formData);
      } else {
        result = await createCompetition(formData);
      }
      if (!result.success) throw new Error(result.message || "Failed to save competition.");
      setFormState("Success");
      setMessage(result.message);
      setCompetitionId(result.competitionId);
    } catch (error) {
      setFormState("Error");
      setMessage((error as Error).message || "An error occurred while saving the competition.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Create new competition</h2>
        <div className="divider"></div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Competition Name</legend>
          <input
            type="text"
            name="name"
            className="input w-full"
            placeholder="Type here"
            defaultValue={initialData?.name || ""}
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            name="description"
            className="textarea w-full"
            placeholder="Type here"
            defaultValue={initialData?.description || ""}
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Image URL</legend>
          <input
            type="url"
            name="imageUrl"
            className="input validator w-full"
            pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9-].*[a-zA-Z0-9])?.)+[a-zA-Z].*$" 
            placeholder="https://"
            defaultValue={initialData?.imageUrl || "https://"}
            required
          />
          <p className="validator-hint">Must be valid URL</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Location</legend>
          <input
            type="text"
            name="location"
            className="input w-full"
            placeholder="Type here"
            defaultValue={initialData?.location || ""}
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Date</legend>
          <button
            type="button"
            popoverTarget="rdp-popover"
            className="input input-border w-full"
            style={{ anchorName: "--rdp" } as React.CSSProperties}
          >
            {date ? date.toLocaleDateString() : "Pick a date"}
          </button>
          <div
            popover="auto"
            id="rdp-popover"
            className="dropdown"
            style={{ positionAnchor: "--rdp" } as React.CSSProperties}
          >
            <DayPicker
              className="react-day-picker"
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </div>
        </fieldset>
        {message && (
          <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`}>{message}</p>
        )}
        <button type="submit" className="btn btn-neutral btn-block">
          {competitionId ? "Update Competition" : "Create Competition"}
        </button>
        <Link href="/dashboard/competitions" className="btn btn-block">
          Return
        </Link>
      </form>
    </div>
  );
}