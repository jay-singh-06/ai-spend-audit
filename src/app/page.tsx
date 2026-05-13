"use client";

import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

import { useEffect, useState } from "react";

type ToolItem = {
  tool: string;
  plan: string;
  cost: string;
  seats: string;
  useCase: string;
};

type AuditResult = {
  tool: string;
  message: string;
  savings: number;
};

export default function Home() {
  // Multiple tools state
  const [tools, setTools] = useState<ToolItem[]>([
    {
      tool: "",
      plan: "",
      cost: "",
      seats: "",
      useCase: "",
    },
  ]);

  // Other states
  const [teamSize, setTeamSize] = useState("");
  const [results, setResults] = useState<AuditResult[]>([]);
  const [savings, setSavings] = useState(0);
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [savingAudit, setSavingAudit] = useState(false);
  const [website, setWebsite] = useState("");

  // Save to localStorage
  useEffect(() => {
    const data = {
      tools,
      teamSize,
    };

    localStorage.setItem("auditForm", JSON.stringify(data));
  }, [tools, teamSize]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("auditForm");

    if (saved) {
      const data = JSON.parse(saved);

      setTools(
        data.tools || [
          {
            tool: "",
            plan: "",
            cost: "",
          },
        ],
      );

      setTeamSize(data.teamSize || "");
    }
  }, []);

  // Handle input changes
  const handleToolChange = (index: number, field: string, value: string) => {
    const updatedTools = [...tools];

    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    };

    setTools(updatedTools);
  };

  // Add another tool
  const addTool = () => {
    setTools([
      ...tools,
      {
        tool: "",
        plan: "",
        cost: "",
        seats: "",
        useCase: "",
      },
    ]);
  };

  // AI summary
  const generateSummary = async (
    auditResults: AuditResult[],
    totalSavings: number,
  ) => {
    try {
      setLoadingSummary(true);

      const response = await fetch("/api/summary", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          results: auditResults,
          savings: totalSavings,
        }),
      });

      const data = await response.json();

      setSummary(data.summary);
    } catch (error) {
      console.log(error);

      setSummary("Unable to generate AI summary right now.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Save audit
  const saveLead = async () => {
    if (website) {
      return;
    }

    <input
      type="text"
      value={website}
      onChange={(e) => setWebsite(e.target.value)}
      className="hidden"
    />;
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setSavingAudit(true);

      const { data, error } = await supabase
        .from("leads")
        .insert([
          {
            email,
            company,
            role,
            team_size: Number(teamSize),
            savings,
            audit_results: results,
            summary,
          },
        ])
        .select();

      if (error) {
        console.log(error);
        alert("Failed to save lead");
        return;
      }

      const auditId = data?.[0]?.id;

      alert("Audit saved successfully!");

      window.open(`/audit/${auditId}`, "_blank");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSavingAudit(false);
    }
  };

  // PDF download function
  const downloadPDF = () => {
    try {
      const pdf = new jsPDF();

      pdf.setFontSize(22);
      pdf.text("AI Spend Audit Report", 20, 20);

      pdf.setFontSize(14);
      pdf.text(`Team Size: ${teamSize}`, 20, 40);
      pdf.text(`Monthly Savings: $${savings}`, 20, 50);
      pdf.text(`Yearly Savings: $${savings * 12}`, 20, 60);

      let y = 80;

      results.forEach((item, index) => {
        pdf.setFontSize(16);
        pdf.text(`${index + 1}. ${item.tool}`, 20, y);

        y += 10;

        pdf.setFontSize(12);

        const lines = pdf.splitTextToSize(item.message, 170);
        pdf.text(lines, 20, y);

        y += lines.length * 7;

        pdf.text(`Savings: $${item.savings}/month`, 20, y);

        y += 15;
      });

      if (summary) {
        pdf.addPage();

        pdf.setFontSize(18);
        pdf.text("AI Generated Summary", 20, 20);

        pdf.setFontSize(12);

        const summaryLines = pdf.splitTextToSize(summary, 170);

        pdf.text(summaryLines, 20, 40);
      }

      pdf.save("AI-Spend-Audit-Report.pdf");
    } catch (error) {
      console.log(error);
      alert("Failed to generate PDF");
    }
  };

  // Audit Logic
  const analyzeSpend = () => {
    if (!teamSize) {
      alert("Please enter team size");

      setResults([]);
      setSavings(0);

      return;
    }

    let totalSavings = 0;

    setSummary("");

    const auditResults: AuditResult[] = [];

    const team = Number(teamSize);

    tools.forEach((item) => {
      const monthlyCost = Number(item.cost);

      // CHATGPT
      if (item.tool === "chatgpt") {
        if (item.plan === "individual" && team > 1) {
          auditResults.push({
            tool: "ChatGPT",
            message:
              "Your team is currently using ChatGPT individual plans across multiple users. Upgrading to a collaborative team plan may improve workspace management, shared access, and overall cost efficiency.",
            savings: 15,
          });

          totalSavings += 15;
        } else if (item.plan === "enterprise" && team < 5) {
          auditResults.push({
            tool: "ChatGPT",
            message:
              "Your organization appears too small for ChatGPT Enterprise pricing. Downgrading to a lower-tier plan may provide similar functionality at a significantly lower cost.",
            savings: 30,
          });

          totalSavings += 30;
        } else {
          auditResults.push({
            tool: "ChatGPT",
            message:
              "Your current ChatGPT setup appears appropriately optimized for your team's size and usage pattern.",
            savings: 0,
          });
        }
      }

      // CLAUDE
      else if (item.tool === "claude") {
        if (monthlyCost > 100) {
          auditResults.push({
            tool: "Claude",
            message:
              "Your Claude usage cost is relatively high for your current team configuration. Reviewing API usage patterns or shifting lightweight tasks to lower-cost models may reduce expenses.",
            savings: 25,
          });

          totalSavings += 25;
        } else {
          auditResults.push({
            tool: "Claude",
            message:
              "Your Claude configuration appears cost-efficient based on your current usage and team size.",
            savings: 0,
          });
        }
      }

      // GITHUB COPILOT
      else if (item.tool === "copilot") {
        if (item.plan === "individual" && team > 3) {
          auditResults.push({
            tool: "GitHub Copilot",
            message:
              "Your engineering team is currently operating on individual GitHub Copilot plans. Migrating to a business plan may improve administrative control, centralized billing, and pricing efficiency.",
            savings: 40,
          });

          totalSavings += 40;
        } else if (item.plan === "enterprise" && team < 10) {
          auditResults.push({
            tool: "GitHub Copilot",
            message:
              "GitHub Copilot Enterprise may be excessive for your current team size. A lower-tier plan could deliver similar value at a reduced operational cost.",
            savings: 20,
          });

          totalSavings += 20;
        } else {
          auditResults.push({
            tool: "GitHub Copilot",
            message:
              "Your GitHub Copilot setup appears well-matched to your current engineering team requirements.",
            savings: 0,
          });
        }
      }

      // CURSOR
      else if (item.tool === "cursor") {
        if (monthlyCost > 50) {
          auditResults.push({
            tool: "Cursor",
            message:
              "Your Cursor spending is above average for your reported team size. Reviewing inactive seats or adjusting subscription tiers may help optimize overall costs.",
            savings: 20,
          });

          totalSavings += 20;
        } else {
          auditResults.push({
            tool: "Cursor",
            message:
              "Your Cursor subscription appears healthy and reasonably optimized for your current usage.",
            savings: 0,
          });
        }
      }
    });

    setResults(auditResults);

    setSavings(totalSavings);

    generateSummary(auditResults, totalSavings);
  };

  return (
    <main
      id="audit-report"
      style={{ background: "#f3f4f6", color: "#000" }}
      className="min-h-screen flex items-center justify-center p-5"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Spend Optimizer
        </h1>

        {/* Multiple Tool Inputs */}
        {tools.map((item, index) => (
          <div key={index} className="border p-4 rounded-xl mb-4">
            <h2 className="font-bold text-lg mb-3">Tool {index + 1}</h2>

            {/* Tool */}
            <select
              value={item.tool}
              onChange={(e) => handleToolChange(index, "tool", e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg"
            >
              <option value="">Select Tool</option>
              <option value="chatgpt">ChatGPT</option>
              <option value="claude">Claude</option>
              <option value="copilot">GitHub Copilot</option>
              <option value="cursor">Cursor</option>
              <option value="anthropic-api">Anthropic API</option>
              <option value="openai-api">OpenAI API</option>
              <option value="gemini">Gemini</option>
              <option value="windsurf">Windsurf</option>
            </select>

            {/* Plan */}
            <select
              value={item.plan}
              onChange={(e) => handleToolChange(index, "plan", e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg"
            >
              <option value="">Select Plan</option>

              <option value="free">Free</option>
              <option value="hobby">Hobby</option>
              <option value="plus">Plus</option>
              <option value="pro">Pro</option>
              <option value="max">Max</option>
              <option value="team">Team</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
              <option value="api">API Direct</option>
            </select>

            {/* Cost */}
            <input
              type="number"
              placeholder="Monthly Cost ($)"
              value={item.cost}
              onChange={(e) => handleToolChange(index, "cost", e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg"
            />

            {/* Seats */}
            <input
              type="number"
              placeholder="Number of Seats"
              value={item.seats}
              onChange={(e) => handleToolChange(index, "seats", e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg"
            />

            {/* Use Case */}
            <select
              value={item.useCase}
              onChange={(e) =>
                handleToolChange(index, "useCase", e.target.value)
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Primary Use Case</option>

              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="research">Research</option>
              <option value="data">Data</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        ))}

        {/* Team Size */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Team Size</label>

          <input
            type="number"
            placeholder="Enter team size"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Add Tool Button */}
        <button
          onClick={addTool}
          className="w-full border border-black py-3 rounded-lg mb-4 hover:bg-gray-100 transition"
        >
          + Add Another Tool
        </button>

        {/* Analyze Button */}
        <button
          onClick={analyzeSpend}
          disabled={loadingSummary}
          className={`w-full py-3 rounded-lg transition text-white ${
            loadingSummary
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loadingSummary ? "Generating Summary..." : "Analyze Spend"}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div id="audit-report">
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Audit Results</h2>

              <div className="space-y-4">
                {results.map((item, index) => (
                  <div key={index} className="bg-gray-100 p-5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{item.tool}</h3>

                      <span className="text-green-600 font-bold">
                        ${item.savings}/mo
                      </span>
                    </div>

                    <p className="text-gray-700">{item.message}</p>
                  </div>
                ))}
              </div>

              {/* Total Savings */}
              <div className="mt-6 bg-black text-white p-5 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">
                  Total Potential Savings
                </h3>

                <p className="text-3xl font-bold">${savings}/month</p>

                <p className="text-lg text-gray-300">${savings * 12}/year</p>
              </div>

              {/* Save Audit */}
              <div className="mt-6 bg-white border p-5 rounded-xl">
                <h3 className="text-xl font-bold mb-4">
                  Save Your Audit Report
                </h3>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                />

                <input
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                />

                <input
                  type="text"
                  placeholder="Your Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4"
                />

                <button
                  onClick={saveLead}
                  disabled={savingAudit}
                  className={`w-full py-3 rounded-lg text-white transition ${
                    savingAudit
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {savingAudit ? "Saving..." : "Save Audit Report"}
                </button>
              </div>

              {/* PDF Button */}
              <button
                onClick={downloadPDF}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Download PDF Report
              </button>

              {/* AI Summary */}
              {summary && (
                <div className="mt-6 bg-white border p-5 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">
                    AI-Generated Summary
                  </h3>

                  <p className="text-gray-700 leading-7">{summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
