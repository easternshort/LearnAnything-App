import React, { useState } from "react";
import { ArrowLeft, Lightbulb, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Module } from "../types";
import VisualRenderer from "./VisualRenderer";
import InteractiveChallenge from "./InteractiveChallenge";

interface ModuleCardProps {
  module: Module;
  totalModulesCount: number;
  onGoBack: () => void;
  onNext: () => void;
  onMarkCompleted: (isCorrect: boolean) => void;
  themeColor: {
    primary: string;
    text: string;
    border: string;
    accentBg: string;
    accentText: string;
    badgeColor: string;
  };
}

export default function ModuleCard({
  module,
  totalModulesCount,
  onGoBack,
  onNext,
  onMarkCompleted,
  themeColor,
}: ModuleCardProps) {
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const handleChallengeComplete = (isCorrect: boolean) => {
    setChallengeCompleted(true);
    onMarkCompleted(isCorrect);
  };

  // Safe formatting for paragraph blocks
  const lessonParagraphs = (module.lesson || "").split("\n\n").filter(Boolean);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Sticky Top Module Progress Rail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs p-4 flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-250 cursor-pointer transition-colors"
        >
          <ArrowLeft size={13} />
          Subject Path
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Module {module.module_number} of {totalModulesCount}
          </span>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
            <div
              className={`h-full ${themeColor.badgeColor} transition-all`}
              style={{ width: `${(module.module_number / totalModulesCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Module Content Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-8">
        <div className="flex items-start gap-4 mb-5 pb-4 border-b border-gray-50">
          <span className="text-4xl p-1.5 bg-slate-50 rounded-2xl border border-gray-100 shadow-3xs select-none">
            {module.emoji || "✍️"}
          </span>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Step {module.module_number} Study Guide
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight mt-0.5">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Concept Card */}
        <div className={`p-4 rounded-2xl border ${themeColor.border} ${themeColor.accentBg} mb-6`}>
          <p className={`text-xs md:text-sm font-black flex items-center gap-1.5 leading-relaxed ${themeColor.accentText}`}>
            <Lightbulb size={16} />
            <span>Key Concept: {module.key_concept}</span>
          </p>
        </div>

        {/* Animated Custom Visuals */}
        {module.visual && (
          <VisualRenderer
            visual={module.visual}
            themeColor={{
              accentBg: themeColor.accentBg,
              text: themeColor.text,
              badgeColor: themeColor.badgeColor,
            }}
          />
        )}

        {/* Detailed Lesson Prose */}
        <div className="prose prose-slate max-w-none text-slate-700 text-xs md:text-sm leading-relaxed space-y-3 pt-2">
          {lessonParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Fun Facts & Tips Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
          {module.fun_fact && (
            <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50">
              <span className="text-lg block mb-1">🤯</span>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Surprising Fun Fact</p>
              <p className="text-xs text-indigo-900/90 leading-normal mt-1">{module.fun_fact}</p>
            </div>
          )}

          {module.real_world_tip && (
            <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50">
              <span className="text-lg block mb-1">💡</span>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Do This Right Now!</p>
              <p className="text-xs text-emerald-900/90 leading-normal mt-1">{module.real_world_tip}</p>
            </div>
          )}
        </div>

        {/* Dynamic Games/interactive challenges */}
        {module.interactive && (
          <InteractiveChallenge
            interactive={module.interactive}
            themeColor={themeColor}
            onComplete={handleChallengeComplete}
          />
        )}

        {/* Next module triggers */}
        <div className="mt-8 flex justify-end">
          <button
            disabled={!challengeCompleted}
            onClick={onNext}
            className={`py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              challengeCompleted
                ? `${themeColor.primary} text-white hover:scale-101 shadow-md hover:shadow-lg`
                : "bg-gray-100 text-slate-400 cursor-not-allowed border border-gray-150"
            }`}
          >
            <span>{module.module_number === totalModulesCount ? "Go to Final Mission 🔓" : "Next Module"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
