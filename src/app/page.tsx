"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tool, setTool] = useState("");
  const [plan, setPlan] = useState("");
  const [cost, setCost] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [result, setResult] = useState("");
  const [savings, setSavings] = useState(0);

  // Save form data to localStorage
  useEffect(() => {
    const formData = {
      tool,
      plan,
      cost,
      teamSize,
    };

    localStorage.setItem("auditForm", JSON.stringify(formData));
  }, [tool, plan, cost, teamSize]);

  // Load form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("auditForm");

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      setTool(parsedData.tool || "");
      setPlan(parsedData.plan || "");
      setCost(parsedData.cost || "");
      setTeamSize(parsedData.teamSize || "");
    }
  }, []);

  // Audit Logic
  const analyzeSpend = () => {
    if (!tool || !plan || !cost || !teamSize) {
      setResult("Please fill all fields.");
      setSavings(0);
      return;
    }
    let message = "";
    let moneySaved = 0;

    const team = Number(teamSize);
    const monthlyCost = Number(cost);

    // CHATGPT
    if (tool === "chatgpt") {
      if (plan === "individual" && team > 1) {
        message =
          "Your team is using ChatGPT individual plans for multiple users. Switching to a team plan could improve collaboration and reduce costs.";

        moneySaved = 15;
      } else if (plan === "enterprise" && team < 5) {
        message =
          "Your company appears too small for ChatGPT Enterprise pricing. A lower-tier plan may provide better value.";

        moneySaved = 30;
      } else {
        message =
          "Your ChatGPT spending appears optimized for your current team usage.";
      }
    }

    // CLAUDE
    else if (tool === "claude") {
      if (monthlyCost > 100) {
        message =
          "Your Claude usage cost is relatively high. You may benefit from optimizing usage or moving some workloads to lower-cost models.";

        moneySaved = 25;
      } else {
        message = "Your Claude configuration looks reasonably optimized.";
      }
    }

    // GITHUB COPILOT
    else if (tool === "copilot") {
      if (team > 3 && plan === "individual") {
        message =
          "Your engineering team is using GitHub Copilot individual plans. Switching to a business plan may provide better management features and pricing efficiency.";

        moneySaved = 40;
      } else {
        message =
          "Your GitHub Copilot setup appears efficient for your current team.";
      }
    }

    // CURSOR
    else if (tool === "cursor") {
      if (monthlyCost > 50) {
        message =
          "Your Cursor spending is higher than average for your current team size. Reviewing inactive seats or plan levels could reduce costs.";

        moneySaved = 20;
      } else {
        message = "Your Cursor spending appears healthy and optimized.";
      }
    }

    // DEFAULT
    else {
      message = "Please select a valid tool.";
    }

    setResult(message);
    setSavings(moneySaved);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Spend Optimizer
        </h1>

        {/* Tool Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Tool</label>

          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Choose Tool</option>

            <option value="chatgpt">ChatGPT</option>

            <option value="claude">Claude</option>

            <option value="copilot">GitHub Copilot</option>

            <option value="cursor">Cursor</option>
          </select>
        </div>

        {/* Plan Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Plan</label>

          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Choose Plan</option>

            <option value="individual">Individual</option>

            <option value="team">Team</option>

            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        {/* Monthly Cost */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Monthly Cost ($)</label>

          <input
            type="number"
            placeholder="Enter monthly spend"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Team Size */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Team Size</label>

          <input
            type="number"
            placeholder="Enter team size"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Analyze Button */}
        <button
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          onClick={analyzeSpend}
        >
          Analyze Spend
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-3">Audit Result</h2>

            <p className="mb-3 text-gray-700">{result}</p>

            <p className="font-bold text-green-600">
              Potential Savings: ${savings}/month ($
              {savings * 12}/year)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
