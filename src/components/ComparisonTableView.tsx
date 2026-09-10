import React from 'react';
import { Award, CheckCircle2, Sliders, Info } from 'lucide-react';
import { ComparisonDimension, OptionAnalysis, RatingLevel } from '../types';

interface ComparisonTableViewProps {
  dimensions: ComparisonDimension[];
  options: OptionAnalysis[];
}

const RATING_BADGES: Record<RatingLevel, { bg: string; text: string; border: string }> = {
  Superior: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Good: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  Neutral: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
  Challenging: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'High Risk': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({ dimensions, options }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-stone-900 font-display">
            Multi-Dimensional Decision Matrix
          </h3>
          <p className="text-xs text-stone-500">
            Side-by-side evaluation across weighted strategic factors. The winning option for each category is badged.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Superior / Leader</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Challenging</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80">
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-stone-600 w-1/4">
                Dimension & Weight
              </th>
              {options.map((opt) => (
                <th key={opt.id} className="py-4 px-5 text-xs font-bold text-stone-900">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-stone-900 px-2 py-0.5 text-xs font-bold text-white">
                      {opt.title}
                    </span>
                  </div>
                  {opt.description && (
                    <span className="block font-normal text-[11px] text-stone-500 mt-1 line-clamp-1">
                      {opt.description}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {dimensions.map((dim, idx) => (
              <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                {/* Dimension info */}
                <td className="py-4 px-5 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{dim.dimension}</span>
                    </div>
                    {dim.description && (
                      <p className="text-xs text-stone-500 leading-relaxed">{dim.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 pt-1">
                      <Sliders className="h-3 w-3 text-stone-400" />
                      <span className="text-[11px] font-semibold text-stone-500">
                        Weight: {dim.weight}/10
                      </span>
                    </div>
                  </div>
                </td>

                {/* Option cells */}
                {options.map((opt) => {
                  const cell = dim.ratings?.[opt.id];
                  const isWinner = dim.winnerOptionId === opt.id;
                  const rating = cell?.rating || 'Neutral';
                  const badgeStyle = RATING_BADGES[rating] || RATING_BADGES.Neutral;

                  return (
                    <td
                      key={opt.id}
                      className={`py-4 px-5 align-top ${
                        isWinner ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                          >
                            {rating}
                          </span>
                          {isWinner && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-900 border border-amber-300">
                              <Award className="h-3 w-3 text-amber-600" />
                              <span>LEADER</span>
                            </span>
                          )}
                        </div>

                        {cell && (
                          <>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    star <= (cell.score || 3)
                                      ? cell.score >= 4
                                        ? 'bg-emerald-500'
                                        : cell.score === 3
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                      : 'bg-stone-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed">
                              {cell.explanation}
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
