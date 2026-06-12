import React, { useState } from "react";
import { User, Award, Flame, Archive, Sparkles, LogOut, CheckSquare } from "lucide-react";
import { UserProfile, Badge } from "../types";

interface ProfilePanelProps {
  user: UserProfile;
  onLogout: () => void;
  onSelectTopic: (slug: string) => void;
}

export default function ProfilePanel({ user, onLogout, onSelectTopic }: ProfilePanelProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const progressArray = Object.values(user.progress || {});
  const completedCount = progressArray.filter((p) => p.completedAll).length;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-1.5 leading-tight">
              {user.username}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                Level {Math.max(1, Math.floor(user.badges.length * 1.5))} Student
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Ready to learn another beautiful craft today?</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors cursor-pointer w-full md:w-auto"
        >
          <LogOut size={14} />
          Switch Profile / Logout
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center text-amber-500 mb-1">
            <Flame size={24} className="fill-current animate-bounce" />
          </div>
          <p className="text-2xl font-black text-amber-700 font-mono">{user.streak}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Active Streak</p>
        </div>

        <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center text-purple-500 mb-1">
            <Award size={24} />
          </div>
          <p className="text-2xl font-black text-purple-700 font-mono">{user.badges.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Badges Earned</p>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <CheckSquare size={24} />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">{completedCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Finished Topics</p>
        </div>

        <div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center text-cyan-500 mb-1">
            <Sparkles size={24} />
          </div>
          <p className="text-2xl font-black text-cyan-700 font-mono">
            {progressArray.reduce((acc, curr) => acc + (curr.score || 0), 0)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Experience Pts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unlocked Badges Shelf */}
        <div className="lg:col-span-2">
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-4">
            <Award size={16} className="text-purple-600" />
            MY BADGE WALL ({user.badges.length})
          </h4>

          {user.badges.length === 0 ? (
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-xs">
              <p className="mb-2">Your badge wall is currently clean and cozy.</p>
              <p className="font-semibold text-indigo-600">Complete any learning topic to lock in your first medal! 🏆</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.badges.map((badge, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBadge(badge)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center hover:scale-102 hover:bg-slate-100/50 transition-all cursor-pointer flex flex-col items-center justify-center relative group"
                >
                  <span className="text-3xl mb-2 filter drop-shadow-sm select-none">{badge.emoji || "🏆"}</span>
                  <p className="font-bold text-xs text-slate-800 line-clamp-1">{badge.title}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Click to view</p>
                </button>
              ))}
            </div>
          )}

          {/* Badge modal description overlay */}
          {selectedBadge && (
            <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedBadge.emoji}</span>
                  <div>
                    <h5 className="font-bold text-xs text-purple-900">{selectedBadge.title}</h5>
                    <p className="text-[10px] text-purple-700">Unlocked Medal Certification</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-xs font-bold text-purple-500 hover:text-purple-700 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-xs text-purple-950 mt-2 italic bg-white p-2.5 rounded-lg border border-purple-100/40">
                "{selectedBadge.unlock_message}"
              </p>
            </div>
          )}
        </div>

        {/* History / Saved Progress Log */}
        <div>
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-4">
            <Archive size={16} className="text-emerald-600" />
            CLASSROOM HISTORY
          </h4>

          {progressArray.length === 0 ? (
            <div className="border border-dashed border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-xs">
              No previous classes recorded. Search a topic above to initiate!
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {progressArray.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0 select-none">{p.emoji || "📚"}</span>
                    <div>
                      <h6 className="font-bold text-xs text-slate-800 line-clamp-1">{p.topicTitle}</h6>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {p.completedAll ? "🎉 Conquered" : `Modules: ${p.completedModules?.length || 0}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTopic(p.topicId)}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
