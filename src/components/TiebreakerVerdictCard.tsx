import React, { useState } from 'react';
import { Award, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, Zap, RefreshCw, BookmarkCheck } from 'lucide-react';
import { TiebreakerVerdict } from '../types';

interface TiebreakerVerdictCardProps {
  verdict: TiebreakerVerdict;
  decisionFrameworkTakeaway: string;
  onNavigateToTab: (tab: 'proscons' | 'comparison' | 'swot' | 'simulator') => void;
}

export const TiebreakerVerdictCard: React.FC<TiebreakerVerdictCardProps> = ({
  verdict,
  decisionFrameworkTakeaway,
  onNavigateToTab,
}) => {
  const [gutCheckReaction, setGutCheckReaction] = useState<'relief' | 'resistance' | null>(null);

  return (
    <div className="space-y-6">
      {/* Primary Verdict Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-stone-700/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>THE TIEBREAKER VERDICT</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-stone-200 backdrop-blur-xs">
              <span>Decision Confidence:</span>
              <span className="font-bold text-amber-400">{verdict.confidencePercentage}%</span>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-display">
              Recommended Path: <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-4">{verdict.recommendedOptionTitle}</span>
            </h2>
            <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {verdict.summaryRationale}
            </p>
          </div>

          {/* The Tiebreaker Factor - The Core Deadlock Breaker */}
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 sm:p-5 backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950 shadow-xs">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  The Deciding Factor
                </span>
                <p className="mt-1 text-sm sm:text-base font-semibold text-white leading-snug">
                  {verdict.theTiebreakerFactor}
                </p>
              </div>
            </div>
          </div>

          {/* Key Risks & Next Steps Columns */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risks to Watch */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Critical Blind Spots to Watch</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
                {verdict.keyRisksToWatch.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Action Plan (Next 48h - 7 Days)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
                {verdict.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gut Check & Intuition Mirror */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                The Gut-Check Mirror
              </span>
              <span className="text-xs text-stone-400">• Intuitive Alignment</span>
            </div>
            <p className="mt-1 text-sm sm:text-base font-semibold text-stone-900 leading-snug">
              "{verdict.gutCheckQuestion}"
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="gutcheck-relief-btn"
                onClick={() => setGutCheckReaction('relief')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  gutCheckReaction === 'relief'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <BookmarkCheck className="h-4 w-4" />
                <span>I feel relief (Verdict validated)</span>
              </button>

              <button
                type="button"
                id="gutcheck-resistance-btn"
                onClick={() => setGutCheckReaction('resistance')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  gutCheckReaction === 'resistance'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                <span>I feel resistance (Test different weights)</span>
              </button>
            </div>

            {gutCheckReaction === 'relief' && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                <strong>Strong intuitive coherence:</strong> When an external recommendation delivers immediate relief, your subconscious values and conscious analysis are in harmony. Proceed with confidence.
              </div>
            )}

            {gutCheckReaction === 'resistance' && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <strong>Valuable diagnostic signal:</strong> Resistance means an unspoken priority (such as safety, family impact, or autonomy) is weighted higher in your heart than standard logic suggests. Use the <strong>Weight Simulator</strong> tab to calibrate your true priorities!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mental Framework Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50/80 p-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Cognitive Model Takeaway
          </span>
          <p className="mt-0.5 text-sm font-medium text-stone-800">
            {decisionFrameworkTakeaway}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToTab('proscons')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span>Pros & Cons</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab('comparison')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span>Comparison Matrix</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab('swot')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span>SWOT</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
