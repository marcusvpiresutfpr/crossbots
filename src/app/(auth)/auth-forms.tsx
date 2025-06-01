"use client";

import React from "react";
import { registerUser, loginUser } from "./actions"
import { usePathname } from "next/navigation";

type FormState = 'Initial' | 'Pending' | 'Success' | 'Error';

export default function AuthForm() {
  const [mode, setMode] = React.useState<'Register' | 'Login'>("Login");
  const [formState, setFormState] = React.useState<FormState>('Initial');
  const [message, setMessage] = React.useState<string[]>(['']);
  const pathname = usePathname();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormState('Pending');
    setMessage([]);

    try {
      const action = mode === "Register" ? registerUser : loginUser;

      action(formData, pathname).then(result => {
        if (!result.success) {
          setFormState('Error');
          setMessage(
            Array.isArray(result.errors)
              ? result.errors.map(e => e.message)
              : [result.message || "An error occurred while processing your request."]
          );
        } else {
          setFormState('Success');
          setMessage([result.message || (mode === "Register" ? "Registration successful!" : "Login successful!")]);
        }
      })
    } catch (error) {
      setFormState('Error');
      setMessage([(error as Error)?.message || "An error occurred while processing your request."]);
    }
  }

  return (
    <form className="space-y-4 p-4 w-full" onSubmit={handleSubmit}>
      <h2 className="text-md font-bold">{mode}</h2>
      <div className="divider"></div>
      {
        mode === "Register" && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Enter your name"
              required
            />
          </fieldset>
        )
      }

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input
          type="email"
          name="email"
          className="input w-full"
          placeholder="Enter your email"
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <input
          type="password"
          name="password"
          className="input w-full"
          placeholder="Enter your password"
          required
        />
      </fieldset>

      {message.map((message, index) => (
        <p className={`text-sm ${formState === "Error" ? "text-error" : "text-success"}`} key={index}>
          {message}
        </p>
      ))}

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>

      <button
        type="button"
        className="btn btn-ghost btn-sm btn-block"
        onClick={() => setMode(mode === "Register" ? "Login" : "Register")}
      >
        Switch to {mode === "Register" ? "Login" : "Register"}
      </button>
    </form>
  );
}