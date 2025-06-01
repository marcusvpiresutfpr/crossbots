"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

import { createRobot, updateRobot } from "./actions.server";
import { Robot } from "@prisma/client";
import { X } from "lucide-react";

type FormState = 'Initial' | 'Pending' | 'Success' | 'Error';

interface RobotFormProps {
  initialData: Robot | null;
  categories?: { id: string; name: string }[];
}

export default function RobotForm({ initialData, categories }: RobotFormProps) {

  const [formState, setFormState] = React.useState<FormState>('Initial');
  const [message, setMessage] = React.useState<string>('');
  const [robotId, setRobotId] = React.useState<string | null>(initialData?.id || null);
  const [selectedCategories, setSelectedCategories] = React.useState<{ id: string | null; name: string }[]>([]);
  const [categoryInput, setCategoryInput] = React.useState<string>('');

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const fuse = new Fuse(categories, { keys: ['name'], threshold: 0.3, });
    // If exact match is not found, add the current input as a new category
    if (categoryInput && !categories.some(c => c.name.toLowerCase() === categoryInput.toLowerCase())) {
      return [{ id: null, name: categoryInput }, ...categories];
    }
    return fuse.search(categoryInput).map(result => result.item);
  }, [categories, categoryInput]);


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
    <div className="h-full w-full flex items-center justify-center p-4">

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
            defaultValue={initialData?.name || ""}
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Categories</legend>
          <ul className="menu w-full">
            {
              selectedCategories.map((category, index) => (
                <li key={index}>
                  <a className="hover:text-error" onClick={() => {
                    setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
                  }}>
                    <X className="w-4 h-4" />
                    {category.name}
                  </a>
                </li>
              ))
            }
          </ul>
          <div className="dropdown">
            <input tabIndex={0} type="text" className="input w-full" value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
            />
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm w-full">
              {filteredCategories.map((category, index) => (
                <li key={index}>
                  <a
                    onClick={() => {
                      setSelectedCategories([...selectedCategories, category]);
                      setCategoryInput('');
                    }}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
              {filteredCategories.length === 0 && (
                <li>
                  <a className="text-gray-500">No categories found</a>
                </li>
              )}
            </ul>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            name="description"
            className="textarea w-full"
            placeholder="Describe your robot"
            defaultValue={initialData?.description || ""}
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
            defaultValue={initialData?.imageUrl || ""}
            required
          />
        </fieldset>

        {message && (
          <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`}>{message}</p>
        )}

        <button type="submit" disabled={formState === "Pending"} className="btn btn-block btn-neutral">
          {formState === "Pending" ? "Saving..." : robotId ? "Update Robot" : "Create Robot"}
        </button>
        <Link href={"/dashboard/robots"} className="btn btn-block">
          Return
        </Link>
      </form>
    </div>
  );
}