"use client";
import { useEffect, useState } from "react";

export default function AgentPicker({ value, onChange }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/agents");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError(err.message);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="border rounded-md px-2 py-1 bg-gray-100 text-gray-500">
        Loading agents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md px-2 py-1 bg-red-50 text-red-600">
        Error loading agents
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="agent-select" className="text-sm font-medium text-gray-700">
        AI Agent
      </label>
      <select
        id="agent-select"
        className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby="agent-description"
      >
        {agents.map(a => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
      <p id="agent-description" className="text-xs text-gray-500">
        Choose an AI agent to help with your task
      </p>
    </div>
  );
}
