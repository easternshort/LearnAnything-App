import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUp, ArrowDown, Shuffle, RotateCcw, Sparkles } from "lucide-react";
import { Interactive } from "../types";

interface InteractiveChallengeProps {
  interactive: Interactive;
  themeColor: {
    primary: string;
    text: string;
    border: string;
    accentBg: string;
    accentText: string;
    badgeColor: string;
  };
  onComplete: (isCorrect: boolean) => void;
}

export default function InteractiveChallenge({ interactive, themeColor, onComplete }: InteractiveChallengeProps) {
  const { type, prompt, options, correct, hint, explanation } = interactive;

  const [hasChecked, setHasChecked] = useState(false);
  const [userCorrect, setUserCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // States per type
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [tfSelected, setTfSelected] = useState<string | null>(null);
  const [blankValue, setBlankValue] = useState("");
  
  // Sequence Order State
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);
  
  // Match Pairs State
  const [matchPairs, setMatchPairs] = useState<{ left: string; right: string; completed: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Drag and Drop (Select matching connection)
  const [dragMatches, setDragMatches] = useState<Record<string, string>>({});

  // Checklist State
  const [checklistValues, setChecklistValues] = useState<Record<string, boolean>>({});

  // Slider State
  const [sliderValue, setSliderValue] = useState(50);

  // Initialize/reset states when interactive changes
  useEffect(() => {
    setHasChecked(false);
    setUserCorrect(null);
    setShowHint(false);
    setQuizSelected(null);
    setTfSelected(null);
    setBlankValue("");
    setChecklistValues({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setDragMatches({});
    setSliderValue(50);

    // Parse options if sequence or matching
    if (type === "sequence_order" && Array.isArray(options)) {
      // Shuffle initially
      const items = [...options];
      items.sort(() => Math.random() - 0.5);
      setSequenceItems(items);
    } else if (type === "sequence_order" && typeof correct === "string") {
      // Defer to piping
      const items = correct.split("|").map(s => s.trim());
      items.sort(() => Math.random() - 0.5);
      setSequenceItems(items);
    }

    if (type === "match_pairs" || type === "drag_drop") {
      // Construct logical pairs
      let parsedPairs: { left: string; right: string; completed: boolean }[] = [];
      if (Array.isArray(options)) {
        parsedPairs = options.map((opt) => {
          const parts = opt.split("|");
          return {
            left: parts[0]?.trim() || "",
            right: parts[1]?.trim() || "",
            completed: false,
          };
        });
      } else if (options && typeof options === "object") {
        parsedPairs = Object.entries(options).map(([key, val]) => ({
          left: key,
          right: val,
          completed: false,
        }));
      }
      setMatchPairs(parsedPairs);
    }
  }, [interactive]);

  // Handle Match pair tap
  const handleLeftClick = (item: string) => {
    if (hasChecked) return;
    setSelectedLeft(item);
    if (selectedRight) {
      evaluatePair(item, selectedRight);
    }
  };

  const handleRightClick = (item: string) => {
    if (hasChecked) return;
    setSelectedRight(item);
    if (selectedLeft) {
      evaluatePair(selectedLeft, item);
    }
  };

  const evaluatePair = (leftVal: string, rightVal: string) => {
    const isMatched = matchPairs.some(
      (p) => p.left === leftVal && p.right === rightVal
    );

    if (isMatched) {
      setMatchPairs((prev) =>
        prev.map((p) =>
          p.left === leftVal && p.right === rightVal ? { ...p, completed: true } : p
        )
      );
      // Check if all matched
    } else {
      // brief helper error shaking could be logged
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Check if current pair matches completed
  const isMatchComplete = matchPairs.length > 0 && matchPairs.every((p) => p.completed);

  // Perform overall validation on click 'Check Answer'
  const handleCheckAnswer = () => {
    let correctStatus = false;

    if (type === "quiz") {
      if (!quizSelected) return;
      // Handle array or single string correct
      if (Array.isArray(correct)) {
        correctStatus = correct.includes(quizSelected);
      } else {
        correctStatus = quizSelected.toLowerCase().trim() === correct.toLowerCase().trim();
      }
    } 
    
    else if (type === "true_false") {
      if (!tfSelected) return;
      const expected = String(correct).toLowerCase().trim();
      correctStatus = tfSelected.toLowerCase().trim() === expected;
    } 
    
    else if (type === "fill_in_blank") {
      if (!blankValue) return;
      const answer = blankValue.trim().toLowerCase();
      if (Array.isArray(correct)) {
        correctStatus = correct.some(c => c.toLowerCase().trim() === answer);
      } else {
        correctStatus = answer === correct.toLowerCase().trim();
      }
    } 
    
    else if (type === "sequence_order") {
      let expectedItems: string[] = [];
      if (typeof correct === "string") {
        expectedItems = correct.split("|").map(s => s.trim());
      } else if (Array.isArray(correct)) {
        expectedItems = correct;
      }
      correctStatus = JSON.stringify(sequenceItems) === JSON.stringify(expectedItems);
    } 
    
    else if (type === "match_pairs" || type === "drag_drop") {
      // Verified immediately as they linked pairs
      correctStatus = isMatchComplete || Object.keys(dragMatches).length > 0;
    } 
    
    else if (type === "checklist") {
      // Checks off realistic progress steps. Always positive.
      const totalChecks = Array.isArray(options) ? options.length : 0;
      const checkedCount = Object.values(checklistValues).filter(Boolean).length;
      correctStatus = checkedCount === totalChecks && totalChecks > 0;
    } 
    
    else if (type === "slider") {
      // Must fall in target range: 40 to 60 (or specified in hints)
      correctStatus = sliderValue >= 40 && sliderValue <= 65;
    }

    setUserCorrect(correctStatus);
    setHasChecked(true);
    onComplete(correctStatus);
  };

  // Re-adjust sequence orders
  const moveItem = (index: number, direction: "up" | "down") => {
    if (hasChecked) return;
    const newItems = [...sequenceItems];
    const swapTarget = direction === "up" ? index - 1 : index + 1;
    if (swapTarget >= 0 && swapTarget < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[swapTarget];
      newItems[swapTarget] = temp;
      setSequenceItems(newItems);
    }
  };

  return (
    <div className={`mt-6 ${themeColor.accentBg} rounded-2xl border-2 ${themeColor.border} p-6 shadow-xs`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎮</span>
        <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Interactive Challenge</h4>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            Bulb Hint 💡
          </button>
        </div>
      </div>

      <p className="text-xs md:text-sm font-semibold text-slate-900 mb-4 bg-white/70 backdrop-blur-xs p-3 rounded-lg border border-slate-100">
        {prompt}
      </p>

      {/* RENDER BY TYPE */}
      {type === "quiz" && Array.isArray(options) && (
        <div className="space-y-2 mb-4">
          {options.map((opt, i) => (
            <button
              key={i}
              disabled={hasChecked}
              onClick={() => setQuizSelected(opt)}
              className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer ${
                quizSelected === opt
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-indigo-600 shadow-xs scale-101"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              <span>{opt}</span>
              {quizSelected === opt && <span className="text-sm">⭐</span>}
            </button>
          ))}
        </div>
      )}

      {type === "true_false" && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {["True", "False"].map((val) => (
            <button
              key={val}
              disabled={hasChecked}
              onClick={() => setTfSelected(val)}
              className={`py-4 rounded-xl border font-bold text-sm md:text-base cursor-pointer transition-all ${
                tfSelected === val
                  ? val === "True"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-102"
                    : "bg-rose-600 text-white border-rose-600 shadow-md scale-102"
                  : "bg-white hover:bg-slate-50 text-gray-700 border-gray-200"
              }`}
            >
              {val === "True" ? "🦁 True" : "🛑 False"}
            </button>
          ))}
        </div>
      )}

      {type === "fill_in_blank" && (
        <div className="mb-4">
          <input
            type="text"
            disabled={hasChecked}
            value={blankValue}
            onChange={(e) => setBlankValue(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white focus:border-indigo-500 focus:outline-none text-xs md:text-sm text-slate-800"
          />
        </div>
      )}

      {type === "sequence_order" && (
        <div className="space-y-2 mb-4">
          {sequenceItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between text-xs md:text-sm text-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-100 text-slate-500 py-0.5 px-1.5 rounded-sm">
                  #{index + 1}
                </span>
                <span className="font-medium">{item}</span>
              </div>
              <div className="flex gap-1.5 ml-2 shrink-0">
                <button
                  disabled={index === 0 || hasChecked}
                  onClick={() => moveItem(index, "up")}
                  className="p-1 px-2 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 border border-slate-200 flex items-center"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  disabled={index === sequenceItems.length - 1 || hasChecked}
                  onClick={() => moveItem(index, "down")}
                  className="p-1 px-2 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 border border-slate-200 flex items-center"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(type === "match_pairs" || type === "drag_drop") && matchPairs.length > 0 && (
        <div className="mb-4 space-y-3">
          <p className="text-[11px] text-gray-500 mb-2 italic">Select a term from Left Side, then tap the correct definition on Right Side!</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Options */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Left Terms</span>
              {matchPairs.map((pair, i) => (
                <button
                  key={i}
                  disabled={pair.completed || hasChecked}
                  onClick={() => handleLeftClick(pair.left)}
                  className={`w-full text-left p-2 rounded-lg border text-[11px] md:text-xs leading-normal transition-all cursor-pointer ${
                    pair.completed
                      ? "bg-emerald-100 border-emerald-200 text-emerald-800 line-through"
                      : selectedLeft === pair.left
                      ? "bg-indigo-600 border-indigo-600 text-white font-semibold"
                      : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pair.left}
                </button>
              ))}
            </div>

            {/* Right Options (shuffled logically or displayed as is) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Right Meanings</span>
              {matchPairs.map((pair, i) => (
                <button
                  key={i}
                  disabled={pair.completed || hasChecked}
                  onClick={() => handleRightClick(pair.right)}
                  className={`w-full text-left p-2 rounded-lg border text-[11px] md:text-xs leading-normal transition-all cursor-pointer ${
                    pair.completed
                      ? "bg-emerald-100 border-emerald-200 text-emerald-800 line-through"
                      : selectedRight === pair.right
                      ? "bg-indigo-600 border-indigo-600 text-white font-semibold"
                      : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pair.right}
                </button>
              ))}
            </div>
          </div>
          
          {isMatchComplete && (
            <div className="bg-emerald-50 text-emerald-800 p-2 text-center text-xs rounded-lg border border-emerald-200 font-semibold mt-2 animate-bounce flex items-center justify-center gap-1.5">
              <Sparkles size={13} />
              All pairs successfully connected! Click check to proceed.
            </div>
          )}
        </div>
      )}

      {type === "checklist" && Array.isArray(options) && (
        <div className="space-y-2.5 mb-4">
          <p className="text-[11px] text-gray-500 mb-2 italic">Follow along in real life! Check off each action as you verify it.</p>
          {options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-start gap-2.5 p-3 rounded-xl border bg-white cursor-pointer hover:bg-slate-50 transition-colors ${
                checklistValues[opt] ? "border-indigo-200 bg-indigo-50/20" : "border-gray-100"
              }`}
            >
              <input
                type="checkbox"
                disabled={hasChecked}
                checked={!!checklistValues[opt]}
                onChange={(e) => {
                  setChecklistValues((prev) => ({
                    ...prev,
                    [opt]: e.target.checked,
                  }));
                }}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
              />
              <span className={`text-xs md:text-sm text-slate-700 ${checklistValues[opt] ? "line-through text-slate-400" : ""}`}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}

      {type === "slider" && (
        <div className="mb-4 bg-white p-4 rounded-xl border border-gray-100 space-y-4">
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>Minimum (0)</span>
            <span>Target Match Range: 45 - 65%</span>
            <span>Maximum (100)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-indigo-700 font-mono bg-indigo-50 w-16 h-10 flex items-center justify-center rounded-lg border border-indigo-200 shrink-0">
              {sliderValue}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              disabled={hasChecked}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
          </div>
          <div className="text-[11px] text-center text-slate-500 italic">
            Slide and adjust carefully to establish balance!
          </div>
        </div>
      )}

      {/* HINT OVERLAY */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs leading-relaxed mb-4 flex gap-1.5 items-start">
          <span className="text-sm">💡</span>
          <div>
            <span className="font-bold">Friendly Hint:</span> {hint}
          </div>
        </div>
      )}

      {/* RESULT MESSAGE */}
      {hasChecked && (
        <div className={`p-4 rounded-xl border mb-4 leading-relaxed text-xs md:text-sm ${
          userCorrect
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-2 mb-1.5 font-bold">
            {userCorrect ? (
              <>
                <CheckCircle2 className="text-emerald-500" size={18} />
                <span>Excellent thinking! High five! 🎉</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-amber-500" size={18} />
                <span>So close! Don't worry, let's learn together.</span>
              </>
            )}
          </div>
          <p className="text-slate-700 mb-1">
            {userCorrect ? explanation : `Explanation: ${explanation}`}
          </p>
        </div>
      )}

      {/* MAIN CHECK BUTTON */}
      <button
        type="button"
        onClick={handleCheckAnswer}
        disabled={
          hasChecked ||
          (type === "quiz" && !quizSelected) ||
          (type === "true_false" && !tfSelected) ||
          (type === "fill_in_blank" && !blankValue) ||
          (type === "match_pairs" && !isMatchComplete)
        }
        className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
          hasChecked
            ? "bg-gray-300 cursor-not-allowed opacity-85"
            : themeColor.primary
        }`}
      >
        <CheckCircle2 size={16} />
        {hasChecked ? "Completed" : "Check My Answer"}
      </button>
    </div>
  );
}
