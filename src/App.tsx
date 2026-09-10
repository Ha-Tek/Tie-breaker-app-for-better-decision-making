import React, { useState, useEffect } from 'react';
import {
  Award,
  ListOrdered,
  Table,
  Grid,
  Sliders,
  Sparkles,
  ArrowLeft,
  Calendar,
  Share2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Header } from './components/Header';
import { DecisionInputForm } from './components/DecisionInputForm';
import { TiebreakerVerdictCard } from './components/TiebreakerVerdictCard';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { DecisionSimulator } from './components/DecisionSimulator';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { ExportModal } from './components/ExportModal';
import {
  DecisionResult,
  SavedDecisionItem,
  ActiveTab,
  ImpactWeight,
} from './types';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Saved decisions state
  const [savedDecisions, setSavedDecisions] = useState<SavedDecisionItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedDecisions]);

  const handleAnalyzeDecision = async (inputData: {
    question: string;
    context: string;
    options: Array<{ id: string; title: string; description: string }>;
    criteria: string[];
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Structuring dilemma architecture...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Generating balanced pros & cons...');
    }, 900);
    const timer2 = setTimeout(() => {
      setLoadingStep('Constructing comparison matrix & SWOT quadrants...');
    }, 2200);
    const timer3 = setTimeout(() => {
      setLoadingStep('Synthesizing the Tiebreaker Verdict...');
    }, 3800);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        throw new Error('Failed to analyze decision. Please try again.');
      }

      const result: DecisionResult = await response.json();
      setCurrentDecision(result);
      setActiveTab('overview');

      // Auto-save to history
      const newSavedItem: SavedDecisionItem = {
        id: result.id,
        question: result.question,
        createdAt: result.createdAt,
        recommendedOptionTitle: result.verdict.recommendedOptionTitle,
        optionsCount: result.options.length,
        data: result,
      };

      setSavedDecisions((prev) => [newSavedItem, ...prev.filter((item) => item.id !== result.id)]);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing the decision.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleAddCustomFactor = (
    optionId: string,
    type: 'pro' | 'con',
    text: string,
    weight: ImpactWeight
  ) => {
    if (!currentDecision) return;

    const scoreValue = weight === 'high' ? 3 : weight === 'medium' ? 2 : 1;
    const finalScore = type === 'pro' ? scoreValue : -scoreValue;

    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id !== optionId) return opt;

      const newItem = {
        id: `custom-${Date.now()}`,
        text,
        weight,
        category: 'Personal Note',
        score: finalScore,
      };

      return {
        ...opt,
        pros: type === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: type === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    const updatedDecision = {
      ...currentDecision,
      options: updatedOptions,
    };

    setCurrentDecision(updatedDecision);

    // Update in saved items too
    setSavedDecisions((prev) =>
      prev.map((item) => (item.id === currentDecision.id ? { ...item, data: updatedDecision } : item))
    );
  };

  const handleLoadDecision = (item: SavedDecisionItem) => {
    setCurrentDecision(item.data);
    setActiveTab('overview');
  };

  const handleDeleteDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllDecisions = () => {
    setSavedDecisions([]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Header
        onNewDecision={() => setCurrentDecision(null)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveResult={Boolean(currentDecision)}
      />

      <main className="flex-1">
        {errorMessage && (
          <div className="mx-auto max-w-4xl px-4 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {!currentDecision ? (
          <DecisionInputForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
            {/* Active Decision Context Bar */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="back-to-new-decision-btn"
                      onClick={() => setCurrentDecision(null)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Start New</span>
                    </button>
                    <span className="text-stone-300">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                      <Calendar className="h-3 w-3" />
                      {new Date(currentDecision.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
                    {currentDecision.question}
                  </h1>
                  {currentDecision.context && (
                    <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
                      {currentDecision.context}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    id="trigger-export-btn"
                    onClick={() => setIsExportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Export Brief</span>
                  </button>
                </div>
              </div>

              {/* Competing Options Chips */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-1">
                  Options:
                </span>
                {currentDecision.options.map((opt, idx) => {
                  const isWinner = opt.id === currentDecision.verdict.recommendedOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium ${
                        isWinner
                          ? 'border border-amber-300 bg-amber-50 text-amber-900 font-bold'
                          : 'border border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span>{opt.title}</span>
                      {isWinner && (
                        <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-extrabold text-stone-950">
                          ★ RECOMMENDED
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xs no-scrollbar">
              <button
                type="button"
                id="tab-overview-btn"
                onClick={() => setActiveTab('overview')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>The Verdict</span>
              </button>

              <button
                type="button"
                id="tab-proscons-btn"
                onClick={() => setActiveTab('proscons')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'proscons'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <ListOrdered className="h-4 w-4" />
                <span>Pros & Cons List</span>
              </button>

              <button
                type="button"
                id="tab-comparison-btn"
                onClick={() => setActiveTab('comparison')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'comparison'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>Comparison Table</span>
              </button>

              <button
                type="button"
                id="tab-swot-btn"
                onClick={() => setActiveTab('swot')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'swot'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>SWOT Analysis</span>
              </button>

              <button
                type="button"
                id="tab-simulator-btn"
                onClick={() => setActiveTab('simulator')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'simulator'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>Priority Simulator</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="transition-all duration-200">
              {activeTab === 'overview' && (
                <TiebreakerVerdictCard
                  verdict={currentDecision.verdict}
                  decisionFrameworkTakeaway={currentDecision.decisionFrameworkTakeaway}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'proscons' && (
                <ProsConsView
                  options={currentDecision.options}
                  onAddCustomItem={handleAddCustomFactor}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonTableView
                  dimensions={currentDecision.comparisonDimensions}
                  options={currentDecision.options}
                />
              )}

              {activeTab === 'swot' && (
                <SwotAnalysisView options={currentDecision.options} />
              )}

              {activeTab === 'simulator' && (
                <DecisionSimulator
                  dimensions={currentDecision.comparisonDimensions}
                  options={currentDecision.options}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SavedDecisionsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedDecisions={savedDecisions}
        onLoadDecision={handleLoadDecision}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllDecisions}
      />

      {currentDecision && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          decision={currentDecision}
        />
      )}
    </div>
  );
}
