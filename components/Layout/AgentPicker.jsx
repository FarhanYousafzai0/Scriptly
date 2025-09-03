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
      <div className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
        Loading AI agents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-3 text-sm border border-red-200 rounded-xl bg-red-50 text-red-600">
        Error loading agents
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {agents.map(a => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        Choose an AI agent specialized for your content type
      </p>
    </div>
  );
}
