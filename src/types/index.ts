export type TiltDimension = "resilience" | "humanity" | "courage" | "wisdom";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ReflectionSession {
  id: string;
  userId: string;
  timestamp: string;
  step: number;
  entryText: string;
  energyRating: number;
  activeTiltDimension: TiltDimension | null;
  patternNote: string;
  microAction: string;
  summary: string;
  completed: boolean;
  messages: Message[];
}

export interface PatternSummary {
  totalSessions: number;
  completedSessions: number;
  dimensionCounts: Record<TiltDimension, number>;
  averageEnergy: number;
  recentMicroActions: string[];
  streak: number;
}
