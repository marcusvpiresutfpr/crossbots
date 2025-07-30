"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "../actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage("");
    setErrors([]);

    const result = await registerUser(formData, "/examples/user");
    
    if (result.success) {
      setMessage(result.message || "Registration successful!");
      router.push("/examples/user");
    } else {
      setErrors(result.errors?.map((e: any) => e.message) || ["Registration failed"]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-base-100 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Join CrossBots</h1>
          <p className="text-base-content/60 mt-2">Create your account to get started</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              className="input input-bordered w-full"
              required
              minLength={6}
            />
          </div>

          {errors.length > 0 && (
            <div className="alert alert-error">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {message && (
            <div className="alert alert-success">
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-base-content/60">
            Already have an account?{" "}
            <Link href="/examples/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            <Link href="/examples" className="text-primary hover:underline">
              Back to Examples
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
