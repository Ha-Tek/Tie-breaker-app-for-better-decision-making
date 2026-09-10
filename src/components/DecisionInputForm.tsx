import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Lightbulb, Compass, ArrowRight, Loader2, Target, Check } from 'lucide-react';
import { PRESET_DECISIONS, DecisionPreset } from '../data/presets';

interface OptionDraft {
  id: string;
  title: string;
  description: string;
}

interface DecisionInputFormProps {
  onSubmit: (data: {
    question: string;
    context: string;
    options: Array<{ id: string; title: string; description: string }>;
    criteria: string[];
  }) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

const COMMON_CRITERIA_SUGGESTIONS = [
  'Long-Term Compounding Growth',
  'Emotional Peace & Low Stress',
  'Financial Upside & Safety',
  'Speed of Execution',
  'Reversibility & Worst-Case Risk',
  'Alignment with Core Personal Values',
];

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  onSubmit,
  isLoading,
  loadingStep,
}) => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<OptionDraft[]>([
    { id: 'opt-1', title: '', description: '' },
    { id: 'opt-2', title: '', description: '' },
  ]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([
    'Long-Term Compounding Growth',
    'Financial Upside & Safety',
  ]);
  const [customCriteriaInput, setCustomCriteriaInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length >= 4) return;
    const nextIndex = options.length + 1;
    setOptions([
      ...options,
      { id: `opt-${Date.now()}-${nextIndex}`, title: '', description: '' },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
    if (validationError) setValidationError(null);
  };

  const handleApplyPreset = (preset: DecisionPreset) => {
    setQuestion(preset.question);
    setContext(preset.context);
    setOptions(
      preset.options.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
      }))
    );
    setSelectedCriteria(preset.criteria);
    setValidationError(null);
  };

  const toggleCriteria = (item: string) => {
    if (selectedCriteria.includes(item)) {
      setSelectedCriteria(selectedCriteria.filter((c) => c !== item));
    } else {
      setSelectedCriteria([...selectedCriteria, item]);
    }
  };

  const handleAddCustomCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCriteriaInput.trim()) return;
    const val = customCriteriaInput.trim();
    if (!selectedCriteria.includes(val)) {
      setSelectedCriteria([...selectedCriteria, val]);
    }
    setCustomCriteriaInput('');
  };

  const handleAutoSuggest = async () => {
    if (!question.trim()) {
      setValidationError('Please enter a decision question first so AI can suggest options.');
      return;
    }
    setValidationError(null);
    setIsSuggesting(true);

    try {
      const response = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.options && Array.isArray(data.options)) {
          setOptions(
            data.options.slice(0, 3).map((o: any, idx: number) => ({
              id: `opt-suggested-${idx + 1}`,
              title: o.title || `Option ${idx + 1}`,
              description: o.description || '',
            }))
          );
        }
        if (data.criteria && Array.isArray(data.criteria)) {
          setSelectedCriteria(data.criteria);
        }
      }
    } catch (err) {
      console.error('Failed to suggest options:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setValidationError('Please enter the decision you are trying to make.');
      return;
    }

    const filledOptions = options.filter((o) => o.title.trim().length > 0);
    if (filledOptions.length < 2) {
      setValidationError('Please provide at least 2 distinct options to compare (e.g. Option A and Option B).');
      return;
    }

    setValidationError(null);
    await onSubmit({
      question: question.trim(),
      context: context.trim(),
      options: filledOptions,
      criteria: selectedCriteria,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Introduction Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-xs font-semibold text-amber-900 mb-3">
          <Compass className="h-3.5 w-3.5 text-amber-700" />
          <span>Structured Decision Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-display">
          Torn between choices? Let's break the tie.
        </h1>
        <p className="mt-2 text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          State your dilemma and competing paths. The Tiebreaker runs deep pros & cons, a weighted comparison matrix, and a 4-quadrant SWOT to deliver the decisive tiebreaking insight.
        </p>
      </div>

      {/* Quick Presets Pills */}
      <div className="mb-8 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Quick Inspiration Presets (Click to load):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_DECISIONS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`preset-${preset.id}`}
              onClick={() => handleApplyPreset(preset)}
              className="group flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-amber-400 hover:bg-amber-50/50 hover:text-stone-900 transition-all text-left"
            >
              <span className="font-semibold text-stone-900 group-hover:text-amber-900">{preset.category}:</span>
              <span className="truncate max-w-[200px] sm:max-w-[280px]">{preset.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="decision-question" className="block text-sm font-semibold text-stone-900 mb-1.5">
              1. What decision do you need to make? <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <input
                id="decision-question"
                type="text"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="e.g. Should I accept the senior startup offer or stay in my corporate job?"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Context & Stakes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="decision-context" className="block text-sm font-semibold text-stone-900">
                2. Context, stakes & personal constraints (Optional)
              </label>
              <span className="text-xs text-stone-400">Helps calibrate trade-offs</span>
            </div>
            <textarea
              id="decision-context"
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. I have 6 months emergency savings. I am prioritizing career acceleration over comfort, but I cannot work 70 hours a week due to health."
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 text-sm leading-relaxed"
              disabled={isLoading}
            />
          </div>

          {/* Competing Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-stone-900">
                3. The competing options to evaluate <span className="text-amber-600">*</span>
              </label>
              <button
                type="button"
                id="ai-suggest-options-btn"
                onClick={handleAutoSuggest}
                disabled={isSuggesting || isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50/80 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors disabled:opacity-50"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700" />
                    <span>Brainstorming...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>AI Suggest Options</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="rounded-xl border border-stone-200/90 bg-stone-50/40 p-3.5 sm:p-4 transition-all focus-within:border-stone-400 focus-within:bg-white"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center rounded-md bg-stone-200/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    {options.length > 2 && (
                      <button
                        type="button"
                        id={`remove-option-${idx}`}
                        onClick={() => handleRemoveOption(idx)}
                        disabled={isLoading}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded-sm"
                        title="Remove option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      id={`option-title-${idx}`}
                      value={opt.title}
                      onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                      placeholder={`e.g. ${idx === 0 ? 'Accept the Series-B Startup Offer' : 'Stay in current Corporate role'}`}
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900/10"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      id={`option-desc-${idx}`}
                      value={opt.description}
                      onChange={(e) => handleOptionChange(idx, 'description', e.target.value)}
                      placeholder="Brief note on what this entails (optional)"
                      className="w-full rounded-lg border border-stone-200 bg-stone-50/60 px-3 py-1.5 text-xs text-stone-700 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:outline-hidden"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>

            {options.length < 4 && (
              <button
                type="button"
                id="add-option-btn"
                onClick={handleAddOption}
                disabled={isLoading}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 hover:border-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Option (e.g. Option {String.fromCharCode(65 + options.length)})</span>
              </button>
            )}
          </div>

          {/* Criteria & Priorities Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-stone-900">
                4. What matters most to you in this decision?
              </label>
              <span className="text-xs text-stone-500">Pick or type your criteria</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_CRITERIA_SUGGESTIONS.map((crit) => {
                const isSelected = selectedCriteria.includes(crit);
                return (
                  <button
                    key={crit}
                    type="button"
                    onClick={() => toggleCriteria(crit)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? <Check className="h-3 w-3 text-amber-400" /> : <Target className="h-3 w-3 text-stone-400" />}
                    <span>{crit}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom criteria adder */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customCriteriaInput}
                onChange={(e) => setCustomCriteriaInput(e.target.value)}
                placeholder="Add custom criterion (e.g. Commute time, Alignment with family values)..."
                className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-hidden"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomCriteria(e);
                  }
                }}
              />
              <button
                type="button"
                id="add-custom-criteria-btn"
                onClick={handleAddCustomCriteria}
                disabled={isLoading || !customCriteriaInput.trim()}
                className="rounded-lg border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Validation error display */}
        {validationError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
            {validationError}
          </div>
        )}

        {/* Submit Button & Progression */}
        <div>
          <button
            type="submit"
            id="break-the-tie-btn"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-stone-800 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                <span className="font-semibold text-stone-100 font-display">
                  {loadingStep || 'Analyzing decision architecture...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="font-display">Break The Tie</span>
                <ArrowRight className="h-5 w-5 text-stone-300 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          {isLoading && (
            <div className="mt-3 text-center">
              <p className="text-xs text-stone-500 animate-pulse">
                Evaluating pros/cons, matrix dimensions, and 4-quadrant SWOTs...
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
