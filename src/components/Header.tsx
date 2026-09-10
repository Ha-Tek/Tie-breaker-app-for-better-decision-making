import React from 'react';
import { Scale, History, PlusCircle, Sparkles, Download } from 'lucide-react';
import { SavedDecisionItem } from '../types';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenExport?: () => void;
  savedCount: number;
  hasActiveResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenExport,
  savedCount,
  hasActiveResult,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-amber-400 shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-display">
                The Tiebreaker
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                <Sparkles className="h-3 w-3" />
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Cut through paralysis with balanced pros & cons, comparison matrices, and SWOT clarity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveResult && (
            <>
              <button
                type="button"
                id="header-export-btn"
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-xs"
                title="Export or Print Decision"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                id="header-new-btn"
                onClick={onNewDecision}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-xs"
              >
                <PlusCircle className="h-4 w-4 text-amber-600" />
                <span className="hidden sm:inline">New Decision</span>
              </button>
            </>
          )}

          <button
            type="button"
            id="header-history-btn"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-100/80 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <History className="h-4 w-4 text-stone-600" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 rounded-full bg-stone-900 px-1.5 py-0.2 text-[11px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
