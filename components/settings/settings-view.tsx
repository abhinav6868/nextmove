"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";

interface SettingsViewProps {
  initialConfig: {
    top_n: number;
    weights: {
      timing: number;
      fit: number;
      reach: number;
      base_factor: number;
      confidence_factor: number;
    };
    icp: {
      target: string;
      stage_bands: string[];
      size_bands: string[];
      location: string;
      business_model: string;
    };
  };
}

export function SettingsView({ initialConfig }: SettingsViewProps) {
  const [topN, setTopN] = React.useState(initialConfig.top_n);
  const [timingWeight, setTimingWeight] = React.useState(
    initialConfig.weights.timing
  );
  const [fitWeight, setFitWeight] = React.useState(initialConfig.weights.fit);
  const [reachWeight, setReachWeight] = React.useState(
    initialConfig.weights.reach
  );
  const [saved, setSaved] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "top_n", value: topN }),
      });

      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "weights",
          value: {
            timing: timingWeight,
            fit: fitWeight,
            reach: reachWeight,
            base_factor: 0.6,
            confidence_factor: 0.4,
          },
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-hairline">
        <h1 className="text-[22px] font-semibold text-text tracking-tight">
          System Configuration & ICP Parameters
        </h1>
        <p className="text-[12px] text-text-muted mt-0.5 font-mono">
          Scoring weights, Top N thresholds, and persona definitions
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Output Size (Task 9) */}
          <div className="rounded-[12px] border border-hairline bg-surface p-6 shadow-xs">
          <h3 className="text-[14px] font-semibold text-text mb-1 font-mono uppercase tracking-wider">
            Output Size (Top N Cutoff)
          </h3>
          <p className="text-[12px] text-text-muted mb-4">
            Defines how many companies make the primary Today card deck before being relegated to the &quot;Dropped today&quot; rationale list.
          </p>

          <div className="flex items-center gap-3">
            {[5, 10, 15].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTopN(val)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-mono font-medium border cursor-pointer transition-colors ${
                  topN === val
                    ? "bg-text text-surface font-semibold border-text"
                    : "bg-surface text-text-muted border-hairline hover:bg-surface-2"
                }`}
              >
                Top {val} {val === 5 ? "(Focus mode)" : val === 10 ? "(Default)" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring Model Weights */}
        <div className="rounded-[12px] border border-hairline bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text mb-1 font-mono uppercase tracking-wider">
            Scoring Model Weights
          </h3>
          <p className="text-[12px] text-text-muted mb-4 font-mono">
            Formula: base = {timingWeight}·Timing + {fitWeight}·Fit + {reachWeight}·Reach
          </p>

          <div className="space-y-4 font-mono text-[13px]">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-text font-medium">Timing Weight (Trigger Recency)</span>
                <span className="text-text-muted">{Math.round(timingWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={timingWeight}
                onChange={(e) => setTimingWeight(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-text font-medium">ICP Fit Weight</span>
                <span className="text-text-muted">{Math.round(fitWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={fitWeight}
                onChange={(e) => setFitWeight(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-text font-medium">Reach Weight (Decision-Maker Contact)</span>
                <span className="text-text-muted">{Math.round(reachWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={reachWeight}
                onChange={(e) => setReachWeight(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>
        </div>

        {/* Persona & ICP Definition */}
        <div className="rounded-[12px] border border-hairline bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text mb-2 font-mono uppercase tracking-wider">
            Ideal Customer Profile (PRD A1)
          </h3>
          <div className="space-y-2 text-[13px] text-text-muted">
            <div className="flex justify-between py-1 border-b border-hairline/60">
              <span className="font-medium text-text">Target User:</span>
              <span>{initialConfig.icp.target}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-hairline/60">
              <span className="font-medium text-text">Target Stage:</span>
              <span className="font-mono">{initialConfig.icp.stage_bands.join(", ")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-hairline/60">
              <span className="font-medium text-text">Target Headcount:</span>
              <span className="font-mono">{initialConfig.icp.size_bands.join(", ")}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-text">Target Geography:</span>
              <span>{initialConfig.icp.location}</span>
            </div>
          </div>
        </div>
      </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-[12px] text-green-600 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Settings persisted
            </span>
          )}
          <Button type="submit" variant="primary" size="default" className="gap-1.5">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
