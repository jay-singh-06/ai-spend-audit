"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tool, setTool] = useState("");
  const [plan, setPlan] = useState("");
  const [cost, setCost] = useState("");
  const [teamSize, setTeamSize] = useState("");

  // Save to localStorage
  useEffect(() => {
    const data = { tool, plan, cost, teamSize };
    localStorage.setItem("formData", JSON.stringify(data));
  }, [tool, plan, cost, teamSize]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      const data = JSON.parse(saved);
      setTool(data.tool || "");
      setPlan(data.plan || "");
      setCost(data.cost || "");
      setTeamSize(data.teamSize || "");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Spend Audit
        </h1>

        {/* Tool */}
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Tool</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="copilot">GitHub Copilot</option>
          <option value="claude">Claude</option>
        </select>

        {/* Plan */}
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Plan</option>
          <option value="individual">Individual</option>
          <option value="team">Team</option>
          <option value="enterprise">Enterprise</option>
        </select>

        {/* Cost */}
        <input
          type="number"
          placeholder="Monthly Cost ($)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Team Size */}
        <input
          type="number"
          placeholder="Team Size"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Button */}
        <button
          className="w-full bg-black text-white py-2 rounded"
          onClick={() => alert("Next step: add logic")}
        >
          Analyze
        </button>
      </div>
    </div>
  );
}