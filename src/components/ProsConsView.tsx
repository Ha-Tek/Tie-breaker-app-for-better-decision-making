import React, { useState } from 'react';
import { Check, X, Plus, ThumbsUp, ThumbsDown, Sparkles, Filter } from 'lucide-react';
import { OptionAnalysis, ImpactWeight, ProConItem } from '../types';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onAddCustomItem: (optionId: string, type: 'pro' | 'con', text: string, weight: ImpactWeight) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onAddCustomItem }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [showSideBySide, setShowSideBySide] = useState<boolean>(true);
  const [filterWeight, setFilterWeight] = useState<string>('all');

  // Input states for adding a custom item
  const [newItemText, setNewItemText] = useState('');
  const [newItemType, setNewItemType] = useState<'pro' | 'con'>('pro');
  const [newItemWeight, setNewItemWeight] = useState<ImpactWeight>('medium');
  const [targetOptionId, setTargetOptionId] = useState<string>(options[0]?.id || '');
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddCustomItem(targetOptionId, newItemType, newItemText.trim(), newItemWeight);
    setNewItemText('');
    setIsAddingOpen(false);
  };

  const calculateNetScore = (option: OptionAnalysis) => {
    const prosScore = option.pros.reduce((acc, p) => acc + (p.score || (p.weight === 'high' ? 3 : p.weight === 'medium' ? 2 : 1)), 0);
    const consScore = option.cons.reduce((acc, c) => acc + (c.score || (c.weight === 'high' ? -3 : c.weight === 'medium' ? -2 : -1)), 0);
    return prosScore + consScore;
  };

  const renderOptionCard = (opt: OptionAnalysis) => {
    const net = calculateNetScore(opt);
    const filteredPros = opt.pros.filter((p) => filterWeight === 'all' || p.weight === filterWeight);
    const filteredCons = opt.cons.filter((c) => filterWeight === 'all' || c.weight === filterWeight);

    return (
      <div key={opt.id} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700">
                {opt.title}
              </span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                Reversibility: {opt.reversibility}
              </span>
            </div>
            {opt.description && (
              <p className="mt-1 text-xs text-stone-500 line-clamp-2">{opt.description}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-stone-400 block font-medium">Net Balance</span>
            <span
              className={`text-lg font-bold ${
                net > 0 ? 'text-emerald-700' : net < 0 ? 'text-rose-700' : 'text-stone-700'
              }`}
            >
              {net > 0 ? `+${net}` : net}
            </span>
          </div>
        </div>

        {/* Pros Section */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Pros ({opt.pros.length})</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">Impact weight</span>
            </div>

            <div className="space-y-2">
              {filteredPros.map((pro) => (
                <div
                  key={pro.id}
                  className="group flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-2.5 sm:p-3 transition-colors hover:bg-emerald-50/70"
                >
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                        {pro.text}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {pro.category && (
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                            {pro.category}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                            pro.weight === 'high'
                              ? 'bg-emerald-200 text-emerald-900'
                              : pro.weight === 'medium'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {pro.weight === 'high' ? '+3 High' : pro.weight === 'medium' ? '+2 Med' : '+1 Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPros.length === 0 && (
                <p className="text-xs text-stone-400 italic py-2">No pros match the filter.</p>
              )}
            </div>
          </div>

          {/* Cons Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>Cons ({opt.cons.length})</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">Severity weight</span>
            </div>

            <div className="space-y-2">
              {filteredCons.map((con) => (
                <div
                  key={con.id}
                  className="group flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/40 p-2.5 sm:p-3 transition-colors hover:bg-rose-50/70"
                >
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                    <X className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                        {con.text}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {con.category && (
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                            {con.category}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                            con.weight === 'high'
                              ? 'bg-rose-200 text-rose-900'
                              : con.weight === 'medium'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {con.weight === 'high' ? '-3 High' : con.weight === 'medium' ? '-2 Med' : '-1 Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCons.length === 0 && (
                <p className="text-xs text-stone-400 italic py-2">No cons match the filter.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Add trigger for this option */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setTargetOptionId(opt.id);
              setIsAddingOpen(true);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add personal Pro/Con to this option</span>
          </button>
          <span className="text-[11px] text-stone-400 font-medium">
            Overall Score: {opt.overallScore}/100
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-stone-100 p-1">
            <button
              type="button"
              id="view-side-by-side-btn"
              onClick={() => setShowSideBySide(true)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                showSideBySide ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              id="view-tabbed-btn"
              onClick={() => setShowSideBySide(false)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                !showSideBySide ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Single Option
            </button>
          </div>

          {!showSideBySide && (
            <div className="flex items-center gap-1">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedOptionId === opt.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {opt.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Weight Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Filter className="h-3.5 w-3.5 text-stone-400" />
            <span>Filter:</span>
            <select
              value={filterWeight}
              onChange={(e) => setFilterWeight(e.target.value)}
              className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-800 focus:outline-hidden"
            >
              <option value="all">All weights</option>
              <option value="high">High impact only</option>
              <option value="medium">Medium impact only</option>
              <option value="low">Low impact only</option>
            </select>
          </div>

          <button
            type="button"
            id="open-add-procon-btn"
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Factor</span>
          </button>
        </div>
      </div>

      {/* Add Custom Item Drawer / Inline Form */}
      {isAddingOpen && (
        <form
          onSubmit={handleCreateItem}
          className="rounded-2xl border-2 border-stone-300 bg-stone-50 p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-stone-900">Add Your Personal Factor</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingOpen(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Apply to Option</label>
              <select
                value={targetOptionId}
                onChange={(e) => setTargetOptionId(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800"
              >
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Type</label>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-stone-200/70 p-0.5">
                <button
                  type="button"
                  onClick={() => setNewItemType('pro')}
                  className={`rounded-md py-1 text-xs font-semibold transition-all ${
                    newItemType === 'pro' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Pro (+)
                </button>
                <button
                  type="button"
                  onClick={() => setNewItemType('con')}
                  className={`rounded-md py-1 text-xs font-semibold transition-all ${
                    newItemType === 'con' ? 'bg-white text-rose-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Con (-)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Impact Level</label>
              <select
                value={newItemWeight}
                onChange={(e) => setNewItemWeight(e.target.value as ImpactWeight)}
                className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800"
              >
                <option value="high">High Impact (3 pts)</option>
                <option value="medium">Medium Impact (2 pts)</option>
                <option value="low">Low Impact (1 pt)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="e.g. My partner strongly prefers living closer to their work..."
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="rounded-lg bg-stone-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              Add Factor
            </button>
          </div>
        </form>
      )}

      {/* Grid of Options */}
      {showSideBySide ? (
        <div className={`grid grid-cols-1 ${options.length === 2 ? 'md:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
          {options.map((opt) => renderOptionCard(opt))}
        </div>
      ) : (
        renderOptionCard(activeOption)
      )}
    </div>
  );
};
