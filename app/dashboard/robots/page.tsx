"use client";

import { useEffect, useState } from "react";
import { Robot } from "@/db/schema";
import Link from "next/link";

export default function RobotsPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRobots = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/robots");
      if (!response.ok) {
        throw new Error("Failed to fetch robots");
      }
      const data = await response.json();
      setRobots(data);
    } catch (error) {
      console.error("Error fetching robots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  return (
    <div className="p-8">
      <div className="p-2 flex justify-between">
        <h1 className="text-2xl font-bold">Robots</h1>
        <div className="space-x-4">
          <button className="btn btn-neutral" onClick={fetchRobots} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Robots"}
          </button>
          <Link href="/dashboard/robots/new" className="btn btn-primary">
            Add Robot
          </Link>
        </div>
      </div>
      <div className="divider" />
      {/* Card for each robot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {robots.map((robot) => (
          <div key={robot.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{robot.name}</h2>
              <p>{robot.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
