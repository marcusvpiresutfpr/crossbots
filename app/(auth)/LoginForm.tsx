"use client";

import React, { useState, startTransition } from "react";

export default function LoginForm() {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        // Handle successful login or registration
        startTransition(() => {
          window.location.reload();
        });
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        className="btn"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } as React.CSSProperties}
      >
        Button
      </button>
      <div
        className="dropdown menu w-sm max-w-screen rounded-box bg-base-100 shadow-sm p-4"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          <h2 className="text-2xl font-bold">{mode === "login" ? "Login" : "Register"}</h2>
          <div className="divider"></div>

          {mode === "register" && (
            <fieldset>
              <input
                type="text"
                name="name"
                className="input w-full validator"
                required
                placeholder="Name"
                minLength={3}
                title="Must be more than 3 characters"
              />
              <p className="validator-hint">Must be more than 3 characters</p>
            </fieldset>
          )}

          <fieldset>
            <input
              type="text"
              name="username"
              className="input w-full validator"
              required
              placeholder="Username"
              minLength={3}
              title="Must be more than 3 characters"
            />
            <p className="validator-hint">Must be more than 3 characters</p>
          </fieldset>

          <fieldset>
            <input
              name="password"
              type="password"
              className="input w-full validator"
              required
              placeholder="Password"
              minLength={8}
              title="Must be more than 8 characters"
            />
            <p className="validator-hint">Must be more than 8 characters, including</p>
          </fieldset>

          {error && <p className="text-error">{error}</p>}

          <button className="btn btn-neutral btn-block" disabled={pending}>
            {pending ? "Loading..." : mode === "login" ? "Login" : "Register"}
          </button>
          <button
            className="btn btn-sm btn-ghost btn-block"
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            disabled={pending}
          >
            {mode === "login" ? "Register" : "Login"} instead
          </button>
        </form>
      </div>
    </>
  );
}
