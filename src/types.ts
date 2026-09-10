export type ImpactWeight = 'high' | 'medium' | 'low';

export interface ProConItem {
  id: string;
  text: string;
  weight: ImpactWeight;
  category?: string;
  score: number; // e.g. 1 to 3 for pros, -1 to -3 for cons
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  title: string;
  description?: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotAnalysis;
  overallScore: number;
  summary: string;
  reversibility: 'Easy' | 'Moderate' | 'Difficult' | 'Irreversible';
}

export type RatingLevel = 'Superior' | 'Good' | 'Neutral' | 'Challenging' | 'High Risk';

export interface DimensionCell {
  rating: RatingLevel;
  score: number; // 1 to 5
  explanation: string;
}

export interface ComparisonDimension {
  dimension: string;
  weight: number; // 1 to 10
  description?: string;
  ratings: Record<string, DimensionCell>; // optionId -> DimensionCell
  winnerOptionId?: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  recommendedOptionTitle: string;
  confidencePercentage: number;
  theTiebreakerFactor: string; // The core reason breaking the deadlock
  summaryRationale: string;
  keyRisksToWatch: string[];
  recommendedNextSteps: string[];
  gutCheckQuestion: string; // Provocative reflective question for intuitive verification
}

export interface DecisionResult {
  id: string;
  createdAt: string;
  question: string;
  context: string;
  options: OptionAnalysis[];
  comparisonDimensions: ComparisonDimension[];
  verdict: TiebreakerVerdict;
  decisionFrameworkTakeaway: string;
}

export interface SavedDecisionItem {
  id: string;
  question: string;
  createdAt: string;
  recommendedOptionTitle: string;
  optionsCount: number;
  data: DecisionResult;
}

export type ActiveTab = 'overview' | 'proscons' | 'comparison' | 'swot' | 'simulator';
