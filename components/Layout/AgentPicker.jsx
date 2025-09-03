"use client";
import { useEffect, useState } from "react";

export default function AgentPicker({ value, onChange }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(setAgents).catch(() => setAgents([]));
  }, []);

  return (
    <select
      className="border rounded-md px-2 py-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {agents.map(a => (
        <option key={a.id} value={a.id}>
          {a.label}
        </option>
      ))}
    </select>
  );
}
