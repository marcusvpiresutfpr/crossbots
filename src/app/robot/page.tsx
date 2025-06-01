"use client";

import React from "react";
import Link from "next/link";

import { createRobot, updateRobot } from "./actions.server";
import { useSearchParams } from 'next/navigation'

type FormState = 'Initial' | 'Pending' | 'Success' | 'Error';

export default function RobotFormPage() {
  const searchParams = useSearchParams();
  const initialRobotId = searchParams.get('id');

  const [formState, setFormState] = React.useState<FormState>('Initial');
  const [message, setMessage] = React.useState<string>('');
  const [robotId, setRobotId] = React.useState<string | null>(initialRobotId || null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState('Pending');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    try {
      let result;
      if (robotId) {
        result = await updateRobot(robotId, formData);
      } else {
        result = await createRobot(formData);
      }
      if (!result.success) throw new Error(result.message || "Failed to save robot.");
      setFormState('Success');
      setMessage(result.message);
      setRobotId(result.robotId);
    } catch (error) {
      setFormState('Error');
      setMessage((error as Error).message || "An error occurred while saving the robot.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Create new robot</h2>
        <div className="divider"></div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your robot's name?</legend>
          <input
            type="text"
            name="name"
            className="input w-full"
            placeholder="Type here"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            name="description"
            className="textarea w-full"
            placeholder="Describe your robot"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Image URL</legend>
          <input
            type="url"
            name="imageUrl"
            className="input w-full"
            placeholder="https://example.com/robot.jpg"
            required
          />
        </fieldset>

        {message && (
          <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`}>{message}</p>
        )}

        <button type="submit" disabled={formState === "Pending"} className="btn btn-block btn-neutral">
          {formState === "Pending" ? "Saving..." : robotId ? "Update Robot" : "Create Robot"}
        </button>
        <Link href={"/"} className="btn btn-block">
          Back to Home
        </Link>


      </form>
    </div>
  );
}