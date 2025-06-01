"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

import { createRobot, updateRobot } from "./actions.server";
import { X } from "lucide-react";

type FormState = 'Initial' | 'Pending' | 'Success' | 'Error';

interface Category {
  id: string | null;
  name: string;
}

interface User {
  id: string | null;
  name: string;
}

interface RobotCategoryRelation {
  category: Category;
}

interface RobotUserRelation {
  user: User;
}

interface RobotFormProps {
  initialData: {
    id?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    categories?: RobotCategoryRelation[];
    users?: RobotUserRelation[];
  };
  categories?: { id: string; name: string }[];
  users?: { id: string; name: string }[];
}

export default function RobotForm({ initialData, categories, users }: RobotFormProps) {

  const [formState, setFormState] = React.useState<FormState>('Initial');
  const [message, setMessage] = React.useState<string>('');
  const [robotId, setRobotId] = React.useState<string | null>(initialData?.id || null);
  // Initialize selectedCategories from initialData if present
  const [selectedCategories, setSelectedCategories] = React.useState<Category[]>(
    initialData?.categories
      ? initialData.categories.map((rel: RobotCategoryRelation) => ({
        id: rel.category.id,
        name: rel.category.name,
      }))
      : []
  );
  const [categoryInput, setCategoryInput] = React.useState<string>('');

  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    const fuse = new Fuse(categories, { keys: ['name'], threshold: 0.3 });

    const results = categoryInput
      ? fuse.search(categoryInput).map(result => result.item)
      : categories;

    const limitedResults = results.slice(0, 5);

    if (
      categoryInput &&
      !categories.some(c => c.name.toLowerCase() === categoryInput.toLowerCase())
    ) {
      return [{ id: null, name: categoryInput }, ...limitedResults.slice(0, 4)];
    }

    return limitedResults;
  }, [categories, categoryInput]);


  // User selection state
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>(
    initialData?.users
      ? initialData.users.map((rel: RobotUserRelation) => ({
        id: rel.user.id,
        name: rel.user.name,
      }))
      : []
  );
  const [userInput, setUserInput] = React.useState<string>("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    const fuse = new Fuse(users, { keys: ['name'], threshold: 0.3 });

    const results = userInput
      ? fuse.search(userInput).map(result => result.item)
      : users;

    const limitedResults = results.slice(0, 5);

    if (
      userInput &&
      !users.some(u => u.name.toLowerCase() === userInput.toLowerCase())
    ) {
      return [{ id: null, name: userInput }, ...limitedResults.slice(0, 4)];
    }

    return limitedResults;
  }, [users, userInput]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState('Pending');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    try {
      let result;
      // Pass selectedCategories and selectedUsers to server
      if (robotId) {
        result = await updateRobot(robotId, formData, selectedCategories, selectedUsers);
      } else {
        result = await createRobot(formData, selectedCategories, selectedUsers);
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
        <h2 className="text-2xl font-bold">{robotId ? "Edit robot" : "Create new robot"}</h2>
        <div className="divider"></div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your robot&apos;s name?</legend>
          <input
            type="text"
            name="name"
            className="input w-full"
            placeholder="Type here"
            defaultValue={initialData?.name || ""}
            required
          />
        </fieldset>

        {/* Categories input */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Categories</legend>
          <ul className="menu w-full">
            {
              selectedCategories.map((category, index) => (
                <li key={index}>
                  <a className="hover:text-error" onClick={() => {
                    setSelectedCategories(selectedCategories.filter((_, i) => i !== index));
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
                      // Prevent duplicates
                      if (!selectedCategories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
                        setSelectedCategories([...selectedCategories, category]);
                      }
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

        {/* Users input */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Users</legend>
          <ul className="menu w-full">
            {selectedUsers.map((user, index) => (
              <li key={index}>
                <a className="hover:text-error" onClick={() => {
                  setSelectedUsers(selectedUsers.filter((_, i) => i !== index));
                }}>
                  <X className="w-4 h-4" />
                  {user.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="dropdown">
            <input tabIndex={0} type="text" className="input w-full" value={userInput}
              onChange={e => setUserInput(e.target.value)}
            />
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm w-full">
              {filteredUsers.map((user, index) => (
                <li key={index}>
                  <a
                    onClick={() => {
                      if (!selectedUsers.some(u => u.name.toLowerCase() === user.name.toLowerCase())) {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                      setUserInput('');
                    }}
                  >
                    {user.name}
                  </a>
                </li>
              ))}
              {filteredUsers.length === 0 && (
                <li>
                  <a className="text-gray-500">No users found</a>
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