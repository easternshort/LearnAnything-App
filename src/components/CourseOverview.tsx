import React from "react";
import { ArrowLeft, Clock, Shield, Award, PlayCircle, BookOpen, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Topic, UserProgress } from "../types";

interface CourseOverviewProps {
  topic: Topic;
  progress: UserProgress | null;
  onGoBack: () => void;
  onStartModule: (moduleNumber: number) => void;
  onStartChallenge: () => void;
  themeColor: {
    primary: string;
    text: string;
    border: string;
    accentBg: string;
    accentText: string;
    badgeColor: string;
  };
}

export default function CourseOverview({
  topic,
  progress,
  onGoBack,
  onStartModule,
  onStartChallenge,
  themeColor,
}: CourseOverviewProps) {
  const completedModules = progress?.completedModules || [];
  const completedAll = progress?.completedAll || false;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Cover Header */}
      <div className={`relative px-6 py-12 md:py-16 ${themeColor.accentBg} text-center border-b ${themeColor.border}`}>
        {/* Back navigation */}
        <button
          onClick={onGoBack}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to list
        </button>

        <span className="text-6xl md:text-7xl block mb-4 filter drop-shadow-sm select-none animate-bounce">
          {topic.emoji}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
          {topic.topic}
        </h1>
        <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto mt-2">
          {topic.tagline}
        </p>

        {/* Specs tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-1 text-xs font-bold bg-white px-3.5 py-1.5 rounded-full border border-gray-200 text-slate-700 shadow-3xs">
            <Clock size={13} className="text-slate-400" />
            <span>Time: {topic.estimated_time || "15 mins"}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold bg-white px-3.5 py-1.5 rounded-full border border-gray-200 text-slate-700 shadow-3xs">
            <Shield size={13} className="text-slate-400" />
            <span>Age: {topic.age_range || "7 and up"}</span>
          </div>

          <div className={`flex items-center gap-1 text-xs font-black px-3.5 py-1.5 rounded-full text-white shadow-3xs ${themeColor.badgeColor}`}>
            <span>{topic.difficulty || "Beginner"}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Lesson Modules Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-gray-800 text-sm tracking-mid uppercase flex items-center gap-2 mb-2">
            <BookOpen size={16} className={themeColor.text} />
            CONQUER THESE MODULES SEQUENTIALLY
          </h3>

          <div className="space-y-3">
            {topic.modules?.map((mod, i) => {
              const isCompleted = completedModules.includes(mod.module_number);
              // Safe sequential gate: you can access it if you already completed it OR it is the next immediately up
              const isUnlocked = i === 0 || completedModules.includes(topic.modules[i - 1]?.module_number);

              return (
                <div
                  key={mod.module_number}
                  className={`border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? "bg-slate-50/70 border-slate-200/80"
                      : isUnlocked
                      ? "bg-white border-indigo-200 shadow-3xs hover:border-indigo-400"
                      : "bg-slate-50/40 border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-1 bg-white rounded-xl border border-gray-100 shadow-3xs select-none">
                      {mod.emoji || "💡"}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-black text-slate-400">
                          Module {mod.module_number}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mt-0.5">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {mod.key_concept}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!isUnlocked}
                    onClick={() => onStartModule(mod.module_number)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      isCompleted
                        ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                        : isUnlocked
                        ? `${themeColor.primary} text-white hover:scale-101 shadow-3xs`
                        : "bg-gray-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? "Review Lesson" : "Study Lesson"}
                  </button>
                </div>
              );
            })}

            {/* Final Hands-On Challenge Box */}
            {topic.final_challenge && (
              <div
                className={`border rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  completedAll
                    ? "bg-slate-50/70 border-slate-200/80"
                    : completedModules.length === topic.modules.length
                    ? "bg-amber-50/40 border-amber-300 shadow-3xs hover:border-amber-500"
                    : "bg-slate-50/40 border-slate-100 opacity-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-1 bg-white rounded-xl border border-gray-100 shadow-3xs select-none">
                    🏆
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400">
                      Final Practical Challenge
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-0.5">
                      {topic.final_challenge.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {topic.final_challenge.description}
                    </p>
                  </div>
                </div>

                <button
                  disabled={completedModules.length < topic.modules.length}
                  onClick={onStartChallenge}
                  className={`py-2.5 px-5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    completedAll
                      ? "bg-slate-200 hover:bg-slate-300 text-slate-850"
                      : completedModules.length === topic.modules.length
                      ? "bg-amber-500 hover:bg-amber-600 text-white hover:scale-102 shadow-sm animate-pulse"
                      : "bg-gray-100 text-slate-450 cursor-not-allowed"
                  }`}
                >
                  {completedAll ? "Review Challenge" : "Unlock Challenge 🔓"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Card Summary sidebar */}
        <div className="space-y-6">
          {/* Card detailing graphic representation */}
          <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/50">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest mb-3.5">
              Subject Blueprint
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs text-slate-600 italic leading-relaxed">
              <span className="text-lg block not-italic font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" />
                Vivid Sketch Visual
              </span>
              "{topic.cover_visual || "An informative illustration explaining the core theme elements in bright, friendly vector cards."}"
            </div>
          </div>

          {/* Badge Preview */}
          {topic.badge_earned && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-150 rounded-2xl p-5 text-center">
              <div className="text-4xl select-none mb-2 mb-1.5">{topic.badge_earned.emoji || "🏅"}</div>
              <p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Subject Trophy</p>
              <h5 className="font-black text-sm text-indigo-900 mt-1">{topic.badge_earned.title}</h5>
              <p className="text-slate-500 text-[11px] mt-1 leading-normal">
                Earn this certification medal after checking off modules & completing the physical solo flight!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
