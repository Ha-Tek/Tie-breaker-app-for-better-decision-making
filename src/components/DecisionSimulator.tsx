import React, { useState, useMemo } from 'react';
import { Sliders, RotateCcw, Trophy, Sparkles, TrendingUp, Info } from 'lucide-react';
import { ComparisonDimension, OptionAnalysis } from '../types';

interface DecisionSimulatorProps {
  dimensions: ComparisonDimension[];
  options: OptionAnalysis[];
}

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({ dimensions, options }) => {
  // Initialize weights from dimension defaults
  const [weights, setWeights] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    dimensions.forEach((dim, idx) => {
      initial[idx] = dim.weight || 5;
    });
    return initial;
  });

  const handleSliderChange = (idx: number, val: number) => {
    setWeights((prev) => ({ ...prev, [idx]: val }));
  };

  const handleReset = () => {
    const initial: Record<number, number> = {};
    dimensions.forEach((dim, idx) => {
      initial[idx] = dim.weight || 5;
    });
    setWeights(initial);
  };

  // Calculate dynamic weighted score for each option
  const simulationResults = useMemo(() => {
    const scores: Record<string, { totalPoints: number; maxPossible: number; percentage: number }> = {};

    options.forEach((opt) => {
      scores[opt.id] = { totalPoints: 0, maxPossible: 0, percentage: 0 };
    });

    dimensions.forEach((dim, idx) => {
      const weight = weights[idx] ?? 5;
      if (weight === 0) return; // skipped

      options.forEach((opt) => {
        const cell = dim.ratings?.[opt.id];
        const cellScore = cell?.score ?? 3; // 1 to 5
        scores[opt.id].totalPoints += cellScore * weight;
        scores[opt.id].maxPossible += 5 * weight;
      });
    });

    const calculated = options.map((opt) => {
      const data = scores[opt.id];
      const percentage = data.maxPossible > 0 ? Math.round((data.totalPoints / data.maxPossible) * 100) : 50;
      return {
        option: opt,
        percentage,
        totalPoints: data.totalPoints,
      };
    });

    // Sort descending
    calculated.sort((a, b) => b.percentage - a.percentage);

    const winner = calculated[0];
    const runnerUp = calculated[1];
    const margin = runnerUp ? winner.percentage - runnerUp.percentage : 0;

    return {
      scores: calculated,
      winner,
      margin,
    };
  }, [dimensions, options, weights]);

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 font-display">
              Live Priority Simulator
            </h3>
          </div>
          <p className="mt-1 text-xs text-stone-500 max-w-xl">
            Drag sliders to reflect what matters to you right now. Watch how shifting values directly changes the winning decision.
          </p>
        </div>

        <button
          type="button"
          id="reset-weights-btn"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Live Winner Banner */}
      <div className="rounded-2xl border-2 border-stone-900 bg-stone-900 p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-950 shadow-md">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Leading under your current weights
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                {simulationResults.winner?.option.title}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-400 block font-medium">Weighted Fit</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
              {simulationResults.winner?.percentage}%
            </span>
          </div>
        </div>

        {/* Options Score Bars Comparison */}
        <div className="mt-6 space-y-3 pt-5 border-t border-white/10">
          {simulationResults.scores.map((item, idx) => (
            <div key={item.option.id} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">
                  {idx === 0 ? '🏆 1st: ' : '2nd: '} {item.option.title}
                </span>
                <span className="text-white font-bold">{item.percentage}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    idx === 0 ? 'bg-amber-400' : 'bg-stone-500'
                  }`}
                  style={{ width: `${Math.max(item.percentage, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h4 className="text-sm font-bold text-stone-900 font-display">
            Adjust Importance for Each Dimension
          </h4>
          <span className="text-xs text-stone-400">Scale: 0 (Ignore) to 10 (Critical)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions.map((dim, idx) => {
            const currentWeight = weights[idx] ?? 5;
            return (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/80 bg-stone-50/40 p-4 transition-all hover:bg-stone-50"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-stone-900">{dim.dimension}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      currentWeight >= 8
                        ? 'bg-amber-100 text-amber-900'
                        : currentWeight >= 4
                        ? 'bg-stone-200 text-stone-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    Weight: {currentWeight}
                  </span>
                </div>

                {dim.description && (
                  <p className="text-[11px] text-stone-500 line-clamp-1 mb-2.5">{dim.description}</p>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-400 font-medium">0</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    id={`slider-dimension-${idx}`}
                    value={currentWeight}
                    onChange={(e) => handleSliderChange(idx, parseInt(e.target.value, 10))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-stone-900"
                  />
                  <span className="text-[10px] text-stone-400 font-medium">10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
