import React from 'react';
import { X, Trash2, ExternalLink, Calendar, Scale, History } from 'lucide-react';
import { SavedDecisionItem } from '../types';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecisionItem[];
  onLoadDecision: (item: SavedDecisionItem) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onLoadDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-amber-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">Saved Decisions</h3>
              <p className="text-xs text-stone-500">
                {savedDecisions.length} decision{savedDecisions.length === 1 ? '' : 's'} recorded in your browser
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-saved-decisions-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-700">No saved decisions yet</p>
              <p className="text-xs text-stone-400 mt-1">
                Any decisions you analyze will be automatically saved here for quick review.
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50/40 p-4 hover:border-stone-400 hover:bg-white transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 rounded-md bg-stone-200/80 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                        Winner: {item.recommendedOptionTitle}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-stone-950">
                      {item.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id={`load-decision-${item.id}`}
                      onClick={() => {
                        onLoadDecision(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
                    >
                      <span>Load</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      id={`delete-decision-${item.id}`}
                      onClick={() => onDeleteDecision(item.id)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete decision"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {savedDecisions.length > 0 && (
          <div className="flex items-center justify-between border-t border-stone-200 px-6 py-3 bg-stone-50/80">
            <button
              type="button"
              id="clear-all-decisions-btn"
              onClick={onClearAll}
              className="text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors"
            >
              Clear All Saved Decisions
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
