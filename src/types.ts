/**
 * Types for LearnAnything - Interactive Learning Platform
 */

export interface Hotspot {
  id: string;
  label: string;
  x: string;
  y: string;
  text: string;
}

export interface BlueprintElement {
  type: "circle" | "rect" | "line" | "text" | "path" | "ellipse";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  r?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  d?: string;
  label?: string;
  color?: "cyan" | "indigo" | "amber" | "rose" | "emerald" | "violet" | "slate";
  strokeWidth?: number;
  filled?: boolean;
}

export interface Visual {
  type: "illustration" | "diagram" | "step_sequence" | "comparison" | "labeled_image";
  description: string;
  alt_text: string;
  hotspots?: Hotspot[];
  blueprint_elements?: BlueprintElement[];
}

export type InteractiveType =
  | "quiz"
  | "drag_drop"
  | "true_false"
  | "sequence_order"
  | "fill_in_blank"
  | "match_pairs"
  | "checklist"
  | "slider";

export interface Interactive {
  type: InteractiveType;
  prompt: string;
  options?: string[] | Record<string, string>;
  correct: string | string[];
  hint: string;
  explanation: string;
}

export interface Module {
  module_number: number;
  title: string;
  emoji: string;
  key_concept: string;
  lesson: string;
  visual: Visual;
  interactive: Interactive;
  fun_fact: string;
  real_world_tip: string;
}

export interface FinalChallenge {
  title: string;
  description: string;
  steps: string[];
  success_looks_like: string;
}

export interface Badge {
  title: string;
  emoji: string;
  unlock_message: string;
}

export interface Topic {
  topic: string;
  emoji: string;
  tagline: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_time: string;
  age_range: string;
  cover_visual: string;
  modules: Module[];
  final_challenge: FinalChallenge;
  badge_earned: Badge;
  next_topics: string[];
}

export interface UserProgress {
  topicId: string;
  topicTitle: string;
  emoji: string;
  completedModules: number[]; // Module numbers completed (e.g. [1, 2])
  completedAll: boolean;
  score: number;
  unlockedBadge?: Badge;
  completedAt?: string;
  challengePhotoUrl?: string;
  challengeNotes?: string;
}

export interface UserProfile {
  username: string;
  streak: number;
  lastActive: string | null;
  completedTopicsCount: number;
  badges: Badge[];
  progress: Record<string, UserProgress>; // key: topic ID (safely slugified)
}
