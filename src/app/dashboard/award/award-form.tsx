"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createAward } from "./actions.server";

interface AwardFormProps {
  robots: { id: string; name: string }[];
  competitions: { id: string; name: string }[];
}

type FormState = "Initial" | "Pending" | "Success" | "Error";

export default function AwardForm({ robots, competitions }: AwardFormProps) {
  const [formState, setFormState] = useState<FormState>("Initial");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("Pending");
    setMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const result = await createAward(formData);
      if (!result.success) throw new Error(result.message || "Failed to create award.");
      setFormState("Success");
      setMessage(result.message);
    } catch (error) {
      setFormState("Error");
      setMessage((error as Error).message || "An error occurred while creating the award.");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Create Award</h2>
        <div className="divider"></div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Award Name</legend>
          <input
            type="text"
            name="name"
            className="input w-full"
            placeholder="Award name"
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Robot</legend>
          <select name="robotId" className="select w-full" required defaultValue="">
            <option value="" disabled>
              Select a robot
            </option>
            {robots.map((robot) => (
              <option key={robot.id} value={robot.id}>
                {robot.name}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Competition</legend>
          <select name="competitionId" className="select w-full" required defaultValue="">
            <option value="" disabled>
              Select a competition
            </option>
            {competitions.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>
        </fieldset>
        {message && (
          <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`}>{message}</p>
        )}
        <button type="submit" disabled={formState === "Pending"} className="btn btn-block btn-neutral">
          {formState === "Pending" ? "Saving..." : "Create Award"}
        </button>
        <Link href="/dashboard" className="btn btn-block">
          Return
        </Link>
      </form>
    </div>
  );
}
