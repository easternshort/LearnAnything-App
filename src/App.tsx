/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Award, Flame, User, Play, LogIn, ChevronRight, CheckCircle2, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import { Topic, UserProfile } from "./types";
import { getTopicTheme } from "./components/ThemeManager";
import Dashboard from "./components/Dashboard";
import CourseOverview from "./components/CourseOverview";
import ModuleCard from "./components/ModuleCard";
import FinalChallengeView from "./components/FinalChallengeView";
import ProfilePanel from "./components/ProfilePanel";

export default function App() {
  // Login & Session Profile State
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Topics cache
  const [topics, setTopics] = useState<any[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Navigation / View state
  const [activeView, setActiveView] = useState<"dashboard" | "profile">("dashboard");
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeModuleNumber, setActiveModuleNumber] = useState<number | null>(null);
  const [isInChallenge, setIsInChallenge] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);

  // Error logging
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Classroom redirection state
  const [curiousRedirection, setCuriousRedirection] = useState<{ originalTopic: string; message: string } | null>(null);

  // Celebration trigger overlay after completing topics
  const [celebrationBadge, setCelebrationBadge] = useState<any | null>(null);

  // 1. Fetch available topics list from the server
  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();
      if (data.topics) {
        setTopics(data.topics);
      }
    } catch (err) {
      console.error("Failed to query catalog of paths:", err);
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    
    // Check if user was previously cached inside browser storage
    const cachedUser = localStorage.getItem("learn_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        handleLoginSubmit(parsed.username);
      } catch (e) {
        localStorage.removeItem("learn_user");
      }
    }
  }, []);

  // 2. Register or Login Username
  const handleLoginSubmit = async (nameToLogin: string) => {
    const trimmed = nameToLogin.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("learn_user", JSON.stringify({ username: trimmed }));
        setErrorMessage(null);
      } else {
        setErrorMessage(data.error || "Failed to establish user connection.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to database on server. Proceeding with temporary local guest!");
      // Fallback guest if server was slow
      setCurrentUser({
        username: trimmed,
        streak: 1,
        lastActive: new Date().toISOString(),
        completedTopicsCount: 0,
        badges: [],
        progress: {},
      });
    }
  };

  // 3. Select a topic and fetch entire details dynamically
  const handleSelectTopic = async (slug: string) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/topics/${slug}`);
      const data = await res.json();
      if (res.ok) {
        setActiveTopic(data);
        setSelectedTopicSlug(slug);
        setActiveModuleNumber(null);
        setIsInChallenge(false);
      } else {
        setErrorMessage(data.error || "Failed to load topic details.");
      }
    } catch (err) {
      setErrorMessage("Failed to establish server connection.");
    }
  };

  // 4. Generate new customized AI topic on demand
  const handleGenerateTopic = async (topicName: string) => {
    if (!currentUser) return;
    setLoadingTopic(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName }),
      });
      const data = await res.json();
      if (res.ok && data.slug) {
        // Fetch topics to refresh the dashboard list
        await fetchTopics();
        // Immediately navigate into the newly generated learning course!
        handleSelectTopic(data.slug);
      } else {
        setErrorMessage(data.error || "An error occurred during AI content formulation.");
      }
    } catch (err: any) {
      setErrorMessage("Service is currently offline. Please explore our preseeded topics below!");
    } finally {
      setLoadingTopic(false);
    }
  };

  // 5. Save module progress
  const handleCompleteModule = async (moduleNum: number, isCorrect: boolean) => {
    if (!currentUser || !selectedTopicSlug) return;

    try {
      const res = await fetch("/api/users/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          topicSlug: selectedTopicSlug,
          moduleNumber: moduleNum,
          answersCorrect: isCorrect,
        }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.warn("Could not save module backup progress on server.");
    }
  };

  // 6. Complete overall topic challenge & unlock badge
  const handleConfirmChallenge = async (logsNotes: string, isPhotoAttached: boolean) => {
    if (!currentUser || !selectedTopicSlug || !activeTopic) return;

    try {
      const res = await fetch("/api/users/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          topicSlug: selectedTopicSlug,
          completedAll: true,
          notes: logsNotes || "Solo field challenge completed successfully!",
        }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        // Show celebration congratulations view
        setCelebrationBadge(activeTopic.badge_earned);
        // Return back to topic details
        setIsInChallenge(false);
      }
    } catch (err) {
      console.warn("Challenge results could not be saved to server database.");
      // Client only fallback celebration
      setCelebrationBadge(activeTopic.badge_earned);
      setIsInChallenge(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("learn_user");
    setSelectedTopicSlug(null);
    setActiveTopic(null);
    setActiveModuleNumber(null);
    setIsInChallenge(false);
    setActiveView("dashboard");
  };

  // Active theme based on current course name
  const topicTheme = activeTopic ? getTopicTheme(activeTopic.topic) : getTopicTheme("");

  // Get active progress of current course
  const currentProgress = currentUser && selectedTopicSlug ? currentUser.progress?.[selectedTopicSlug] || null : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* GLOBAL BANNER NOTIFICATIONS */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-100 p-3 text-center text-xs text-rose-800 font-semibold flex items-center justify-center gap-1.5 z-50">
          <AlertTriangle size={14} className="text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 bg-white rounded px-2 py-0.5 border border-rose-150 cursor-pointer">OK</button>
        </div>
      )}

      {/* FIXED APPLICATION NAVBAR HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-150 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand click returns to dashboard */}
          <button
            onClick={() => {
              setSelectedTopicSlug(null);
              setActiveTopic(null);
              setActiveModuleNumber(null);
              setIsInChallenge(false);
              setActiveView("dashboard");
            }}
            className="flex items-center gap-2 text-indigo-700 hover:opacity-90 outline-none select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              🎯
            </div>
            <div>
              <span className="font-black text-sm tracking-mid block text-slate-900 leading-none">LearnAnything</span>
              <span className="text-[10px] tracking-wide text-indigo-500 uppercase font-black">AI Learning Hub</span>
            </div>
          </button>

          {/* User actions right side */}
          {currentUser && (
            <div className="flex items-center gap-4">
              <nav className="hidden sm:flex items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedTopicSlug(null);
                    setActiveTopic(null);
                    setActiveModuleNumber(null);
                    setIsInChallenge(false);
                    setActiveView("dashboard");
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    activeView === "dashboard" && !selectedTopicSlug
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Classroom
                </button>
                <button
                  onClick={() => {
                    setSelectedTopicSlug(null);
                    setActiveTopic(null);
                    setActiveModuleNumber(null);
                    setIsInChallenge(false);
                    setActiveView("profile");
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    activeView === "profile"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  My Badges Shelf
                </button>
              </nav>

              <button
                onClick={() => {
                  setSelectedTopicSlug(null);
                  setActiveTopic(null);
                  setActiveModuleNumber(null);
                  setIsInChallenge(false);
                  setActiveView("profile");
                }}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-gray-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors shadow-3xs"
                title="View Achievements"
              >
                <User size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CORE OUTSIDE AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: PRE-ENROLLMENT WELCOME CARD */}
        {!currentUser ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-150 shadow-md overflow-hidden p-6 md:p-8 text-center space-y-6">
            <span className="text-6xl block select-none animate-bounce">🚀</span>
            
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Learn Anything.
              </h1>
              <p className="text-slate-500 text-xs md:text-sm">
                Enter a screen-name to create your free classroom desk. We'll track your lessons, daily flame streaks, and certifications directly on the database!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit(username);
              }}
              className="space-y-4"
            >
              <div className="relative">
                <LogIn className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
                <input
                  required
                  type="text"
                  maxLength={15}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your student name..."
                  className="w-full pl-11 pr-4 py-3 text-xs md:text-sm border-2 border-gray-100 bg-white text-slate-900 focus:border-indigo-500 focus:outline-none rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white tracking-wider uppercase text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn size={15} />
                Step Inside Classroom
              </button>
            </form>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-center gap-2">
              <span className="text-indigo-600">🏆</span>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Suitable for Curious Minds Ages 7 & Up
              </p>
            </div>
          </div>
        ) : (
          /* LOGGED IN ACTIVE SCREENS */
          <div className="transition-all duration-300">
            
            {/* IN-SITE CELEBRATION CONGRATULATIONS CARD OVERLAY */}
            {celebrationBadge && (
              <div className="bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 p-6 md:p-8 rounded-3xl border-2 border-amber-300 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                {/* Visual particles design */}
                <div className="absolute top-2 left-2 text-2xl opacity-15 select-none font-black text-white">CONGRATS!</div>
                <div className="absolute bottom-2 right-2 text-2xl opacity-15 select-none font-black text-white">CERTIFIED!</div>

                <div className="flex items-center gap-4 z-10">
                  <span className="text-6xl md:text-7xl block select-none filter drop-shadow-sm animate-bounce">
                    {celebrationBadge.emoji || "🎖️"}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-black bg-indigo-950 text-yellow-300 py-0.5 px-2 rounded-full border border-indigo-900">
                      New Badge Unlocked! 🏆
                    </span>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                      {celebrationBadge.title}
                    </h3>
                    <p className="text-xs md:text-sm font-semibold text-indigo-950/90 mt-1 leading-normal max-w-lg">
                      "{celebrationBadge.unlock_message}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCelebrationBadge(null)}
                  className="py-3 px-6 rounded-xl bg-slate-950 text-white font-bold uppercase text-xs tracking-wider hover:bg-slate-900 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Confirm Honor & Collect Medal 🌟
                </button>
              </div>
            )}

            {/* A. VIEW: PREPAIRING DETAILS SCREEN OR DIRECTORY */}
            {selectedTopicSlug && activeTopic ? (
              // Active course view
              activeModuleNumber !== null ? (
                // Active studying module card
                <ModuleCard
                  module={activeTopic.modules.find((m) => m.module_number === activeModuleNumber)!}
                  totalModulesCount={activeTopic.modules.length}
                  themeColor={topicTheme}
                  onGoBack={() => setActiveModuleNumber(null)}
                  onNext={() => {
                    const currentIdx = activeTopic.modules.findIndex((m) => m.module_number === activeModuleNumber);
                    if (currentIdx !== -1 && currentIdx < activeTopic.modules.length - 1) {
                      setActiveModuleNumber(activeTopic.modules[currentIdx + 1].module_number);
                    } else {
                      // Reach completion limit, proceed to Final challenge!
                      setActiveModuleNumber(null);
                      setIsInChallenge(true);
                    }
                  }}
                  onMarkCompleted={(isCorrect) => handleCompleteModule(activeModuleNumber, isCorrect)}
                />
              ) : isInChallenge ? (
                // Active Final practical challenge submission
                <FinalChallengeView
                  challenge={activeTopic.final_challenge}
                  badge={activeTopic.badge_earned}
                  themeColor={topicTheme}
                  onGoBack={() => {
                    setIsInChallenge(false);
                  }}
                  onSubmitProof={handleConfirmChallenge}
                />
              ) : (
                // Course landing picker overview
                <CourseOverview
                  topic={activeTopic}
                  progress={currentProgress}
                  themeColor={topicTheme}
                  onGoBack={() => {
                    setSelectedTopicSlug(null);
                    setActiveTopic(null);
                    setActiveModuleNumber(null);
                    setIsInChallenge(false);
                  }}
                  onStartModule={(modNum) => {
                    setActiveModuleNumber(modNum);
                  }}
                  onStartChallenge={() => {
                    setIsInChallenge(true);
                  }}
                />
              )
            ) : activeView === "profile" ? (
              // B. VIEW: MY BADGES SHELF PROFILE
              <ProfilePanel
                user={currentUser}
                onLogout={handleLogout}
                onSelectTopic={(slug) => {
                  setActiveView("dashboard");
                  handleSelectTopic(slug);
                }}
              />
            ) : (
              // C. VIEW: CORE DASHBOARD EXPLORATION
              <Dashboard
                topicsList={topics}
                user={currentUser}
                onSelectTopic={handleSelectTopic}
                onGenerateTopic={handleGenerateTopic}
                loading={loadingTopic}
                onViewProfile={() => {
                  setActiveView("profile");
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-150 py-8 bg-white text-center text-xs text-slate-400">
        <p>© 2026 LearnAnything Hub. Powered by Gemini-3.5-Flash & @google/genai.</p>
        <p className="mt-1 font-mono text-[10px]">Pristine Visual Sandbox Classroom Design</p>
      </footer>
    </div>
  );
}

