"use client";

import React, { useState } from "react";
import { updateProfile } from "./profile-actions";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialData: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [formState, setFormState] = useState<"Initial" | "Pending" | "Success" | "Error">("Initial");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("Pending");
    setMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const result = await updateProfile(formData);
      if (!result.success) throw new Error(result.message || "Failed to update profile.");
      setFormState("Success");
      setMessage(result.message);
      router.refresh();
    } catch (error) {
      setFormState("Error");
      setMessage((error as Error).message || "An error occurred while updating the profile.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <div className="divider"></div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            name="name"
            className="input w-full"
            defaultValue={initialData.name}
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            name="email"
            className="input w-full"
            defaultValue={initialData.email}
            disabled
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Bio</legend>
          <textarea
            name="bio"
            className="textarea w-full"
            defaultValue={initialData.bio || ""}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Image URL</legend>
          <input
            type="url"
            name="imageUrl"
            className="input w-full"
            defaultValue={initialData.imageUrl || ""}
            placeholder="https://"
          />
        </fieldset>
        {message && (
          <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`}>{message}</p>
        )}
        <button type="submit" className="btn btn-neutral btn-block">
          Update Profile
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => router.push("/dashboard")}
        >
          Return to Dashboard
        </button>
      </form>
    </div>
  );
}
