import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Compass, Flame, Check, HelpCircle } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface SwotAnalysisViewProps {
  options: OptionAnalysis[];
}

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-stone-900 font-display">
            4-Quadrant SWOT Matrix
          </h3>
          <p className="text-xs text-stone-500">
            Strategic breakdown mapping internal capabilities against external environment forces.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 p-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              id={`swot-tab-${opt.id}`}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedOptionId === opt.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Option Info Pill */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Analyzing:
          </span>
          <span className="text-sm font-bold text-stone-900 font-display">
            {activeOption.title}
          </span>
          <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
            Reversibility: {activeOption.reversibility}
          </span>
        </div>
        <p className="text-xs text-stone-600 italic max-w-xl">
          "{activeOption.summary}"
        </p>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quadrant 1: Strengths (Internal Positives) */}
        <div className="flex flex-col rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-emerald-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 font-display">
                  Strengths (Internal)
                </h4>
                <span className="text-[11px] text-emerald-800 font-medium">Inherent advantages & resources</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
              {activeOption.swot?.strengths?.length || 0} Points
            </span>
          </div>

          <ul className="space-y-2.5 flex-1 text-xs sm:text-sm text-stone-800">
            {activeOption.swot?.strengths?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 2: Weaknesses (Internal Negatives) */}
        <div className="flex flex-col rounded-2xl border-2 border-amber-200 bg-amber-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950 font-display">
                  Weaknesses (Internal)
                </h4>
                <span className="text-[11px] text-amber-800 font-medium">Inherent constraints & deficits</span>
              </div>
            </div>
            <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              {activeOption.swot?.weaknesses?.length || 0} Points
            </span>
          </div>

          <ul className="space-y-2.5 flex-1 text-xs sm:text-sm text-stone-800">
            {activeOption.swot?.weaknesses?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 3: Opportunities (External Upsides) */}
        <div className="flex flex-col rounded-2xl border-2 border-sky-200 bg-sky-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-sky-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sky-950 font-display">
                  Opportunities (External)
                </h4>
                <span className="text-[11px] text-sky-800 font-medium">Tailwinds, trends & compounding future bets</span>
              </div>
            </div>
            <span className="rounded-full bg-sky-200/80 px-2 py-0.5 text-[10px] font-bold text-sky-900">
              {activeOption.swot?.opportunities?.length || 0} Points
            </span>
          </div>

          <ul className="space-y-2.5 flex-1 text-xs sm:text-sm text-stone-800">
            {activeOption.swot?.opportunities?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 4: Threats (External Hazards) */}
        <div className="flex flex-col rounded-2xl border-2 border-rose-200 bg-rose-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-rose-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-950 font-display">
                  Threats (External)
                </h4>
                <span className="text-[11px] text-rose-800 font-medium">Macro headwinds, market shifts & competitor actions</span>
              </div>
            </div>
            <span className="rounded-full bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-900">
              {activeOption.swot?.threats?.length || 0} Points
            </span>
          </div>

          <ul className="space-y-2.5 flex-1 text-xs sm:text-sm text-stone-800">
            {activeOption.swot?.threats?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
