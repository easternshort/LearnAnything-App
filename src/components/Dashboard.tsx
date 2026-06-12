import React, { useState } from "react";
import { Search, Sparkles, Sliders, Play, Award, Flame, User, CheckCircle2, ChevronRight, HelpCircle, GraduationCap } from "lucide-react";
import { Topic, UserProfile } from "../types";

interface DashboardProps {
  topicsList: any[];
  user: UserProfile;
  onSelectTopic: (slug: string) => void;
  onGenerateTopic: (topicName: string) => void;
  loading: boolean;
  onViewProfile: () => void;
}

export default function Dashboard({
  topicsList,
  user,
  onSelectTopic,
  onGenerateTopic,
  loading,
  onViewProfile,
}: DashboardProps) {
  const [searchVal, setSearchVal] = useState("");
  const [filterAge, setFilterAge] = useState<string>("All");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim() || loading) return;
    onGenerateTopic(searchVal.trim());
  };

  // Safe categorization logic for aesthetic UI tag colors
  const getCardAesthetic = (title: string) => {
    const name = title.toLowerCase();
    if (name.includes("drone") || name.includes("internet") || name.includes("code") || name.includes("python") || name.includes("tech")) {
      return { bg: "bg-sky-50 text-sky-700 border-sky-100", emoji: "🚁", tagColor: "bg-sky-500" };
    }
    if (name.includes("knife") || name.includes("cook") || name.includes("pasta") || name.includes("kitchen")) {
      return { bg: "bg-orange-50 text-orange-700 border-orange-100", emoji: "🍝", tagColor: "bg-orange-500" };
    }
    if (name.includes("soil") || name.includes("garden") || name.includes("plant") || name.includes("bee") || name.includes("nature")) {
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", emoji: "🌱", tagColor: "bg-emerald-500" };
    }
    return { bg: "bg-purple-50 text-purple-700 border-purple-100", emoji: "🎨", tagColor: "bg-purple-500" };
  };

  // Filter topics
  const filteredTopics = topicsList.filter((t) => {
    // Suitability filters
    if (filterDifficulty !== "All" && t.difficulty !== filterDifficulty) return false;
    
    if (filterAge !== "All") {
      const ageLower = (t.age_range || "").toLowerCase();
      if (filterAge === "Kids" && ageLower.includes("10") && !ageLower.includes("7")) return false;
      if (filterAge === "Teens" && (ageLower.includes("7") || ageLower.includes("all"))) return false;
    }

    if (searchVal.trim() !== "") {
      const query = searchVal.toLowerCase();
      return (
        t.topic.toLowerCase().includes(query) ||
        t.tagline.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-tr from-indigo-700 via-indigo-800 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-25"></div>
        
        {/* User Mini status bar */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-10">
          <button
            onClick={onViewProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/10 transition-colors text-xs font-semibold cursor-pointer text-white"
          >
            <User size={13} />
            Profile ({user.username})
          </button>

          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold leading-none select-none">
            <Flame size={13} className="fill-current" />
            <span>{user.streak} Days</span>
          </div>
        </div>

        <div className="relative max-w-2xl z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Age-Appropriate AI Learning Guide</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">Anything</span> under the sun.
          </h1>
          
          <p className="text-slate-300 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
            Type any creative craft below — Drone piloting, Parmesan pasta, Soil chemistry, Web development — and our custom LearnBot will construct beautiful sequential modules for you instantly!
          </p>

          <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                required
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="What do you want to learn today?"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 border-none shadow-sm text-xs md:text-sm focus:ring-4 focus:ring-cyan-400/55 focus:outline-none placeholder-slate-400 font-medium"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-500 active:scale-98 transition-all font-bold text-xs md:text-sm text-indigo-950 uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} />
              Teach Me!
            </button>
          </form>

          {/* Quick recommendations suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1.5">
            <span className="text-slate-400 font-bold">Try searching:</span>
            {["Chef Knife Cut", "Gourmet Pasta", "Basic Wilderness survival", "Composting"].map((rec) => (
              <button
                key={rec}
                type="button"
                onClick={() => setSearchVal(rec)}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-[11px] text-slate-200 border border-white/5 font-semibold"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LOADING STATUS OR CHANNELS */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-xl">🤖</span>
            </div>
            
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
              LearnBot is thinking...
            </h3>
            
            {/* Cycle funny reassuring supportive quotes */}
            <p className="text-xs text-slate-500 leading-relaxed italic animate-pulse">
              "Mapping age-appropriate lessons, drafting interactive quizzes, and sketching beautiful illustration blueprints..."
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters shelf */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-50 pb-4 gap-4">
            <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm uppercase tracking-wider">
              <Sliders size={15} />
              <span>Explore Interactive Paths ({filteredTopics.length})</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-bold">Age Suitability:</span>
                <div className="bg-slate-100 rounded-lg p-0.5 flex">
                  {["All", "Kids", "Teens"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setFilterAge(a)}
                      className={`px-3 py-1 rounded-md font-semibold ${
                        filterAge === a ? "bg-white text-indigo-700 shadow-3xs" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-bold">Difficulty:</span>
                <div className="bg-slate-100 rounded-lg p-0.5 flex">
                  {["All", "Beginner", "Intermediate"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilterDifficulty(d)}
                      className={`px-3 py-1 rounded-md font-semibold ${
                        filterDifficulty === d ? "bg-white text-indigo-700 shadow-3xs" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length === 0 ? (
            <div className="bg-slate-50/50 border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center text-slate-400 text-xs">
              <p className="mb-2">We couldn't locate any matching learning paths.</p>
              <button
                onClick={() => setSearchVal("")}
                className="font-bold text-indigo-600 hover:underline"
              >
                Clear queries or initiate custom AI search.
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((item) => {
                const styles = getCardAesthetic(item.topic);
                const hasCompletedBefore = user.progress?.[item.slug]?.completedAll;
                const score = user.progress?.[item.slug]?.score || 0;

                return (
                  <div
                    key={item.slug}
                    onClick={() => onSelectTopic(item.slug)}
                    className="bg-white rounded-2xl border border-gray-150 hover:border-indigo-200 shadow-3xs hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group focus-within:ring-4 focus-within:ring-indigo-100"
                  >
                    {/* Visual card header */}
                    <div className={`p-6 ${styles.bg} border-b border-gray-50 flex items-center justify-between`}>
                      <span className="text-5xl group-hover:scale-110 transition-transform select-none filter drop-shadow-3xs">
                        {item.emoji || styles.emoji}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full text-white ${styles.tagColor}`}>
                          {item.difficulty || "Beginner"}
                        </span>
                        {hasCompletedBefore && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full mt-1.5 flex items-center gap-0.5 border border-emerald-200">
                            ✓ Certified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">
                          {item.topic}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.tagline}
                        </p>
                      </div>

                      {/* Card Footer row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[10px] font-bold text-slate-505">
                        <div className="flex gap-2">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            🕒 {item.estimated_time || "15m"}
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            🧒 {item.age_range || "All ages"}
                          </span>
                        </div>

                        <span className="text-slate-400 group-hover:text-indigo-600 font-black flex items-center gap-0.5 transition-colors">
                          Play Path <ChevronRight size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
