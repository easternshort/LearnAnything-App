import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Award, Sparkles, FileText, Camera, Send } from "lucide-react";
import { FinalChallenge, Badge } from "../types";

interface FinalChallengeViewProps {
  challenge: FinalChallenge;
  badge: Badge;
  onGoBack: () => void;
  onSubmitProof: (notes: string, photoStatus: boolean) => void;
  themeColor: {
    primary: string;
    text: string;
    border: string;
    accentBg: string;
    accentText: string;
    badgeColor: string;
  };
}

export default function FinalChallengeView({
  challenge,
  badge,
  onGoBack,
  onSubmitProof,
  themeColor,
}: FinalChallengeViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Toggle checklist for physical steps
  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const stepsCount = challenge.steps?.length || 0;
  const checkedCount = Object.values(completedSteps).filter(Boolean).length;
  const allChecked = checkedCount === stepsCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) return;

    setSubmitting(true);
    // Mimic quick server persistence delay for elegant feeling
    setTimeout(() => {
      onSubmitProof(notes, isPhotoUploaded);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Go back to course
        </button>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-widest flex items-center gap-1">
          <Award size={13} />
          Final Solo Mission
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-5xl block select-none mb-3 animate-bounce">🏆</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
          {challenge.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          {challenge.description}
        </p>
      </div>

      {/* Checklist Action Steps */}
      <div className="space-y-3.5 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
        <h3 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Active Mission Guidelines</span>
          <span className="text-slate-500 font-mono text-[11px]">
            {checkedCount}/{stepsCount} Verified
          </span>
        </h3>

        {challenge.steps?.map((stepStr, idx) => (
          <label
            key={idx}
            className={`flex items-start gap-3 p-3.5 rounded-xl border bg-white cursor-pointer hover:bg-slate-50 transition-colors ${
              completedSteps[idx] ? "border-emerald-200 bg-emerald-50/15" : "border-gray-100"
            }`}
          >
            <input
              type="checkbox"
              checked={!!completedSteps[idx]}
              onChange={() => toggleStep(idx)}
              className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 mt-0.5 cursor-pointer"
            />
            <span className={`text-[13px] text-slate-700 leading-normal ${completedSteps[idx] ? "line-through text-slate-400" : ""}`}>
              {stepStr}
            </span>
          </label>
        ))}
      </div>

      {/* Success Looks Like */}
      <div className="bg-amber-50/40 rounded-xl border border-amber-200/50 p-4 mb-8 text-xs leading-relaxed text-amber-900 flex gap-2 items-start">
        <span className="text-sm">🎯</span>
        <div>
          <span className="font-bold uppercase tracking-wider text-[9px] bg-amber-100 py-0.5 px-1.5 rounded text-amber-800 mr-1.5">Goal</span>
          <span className="font-semibold text-amber-950">Success Looks Like: </span>
          {challenge.success_looks_like}
        </div>
      </div>

      {allChecked ? (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-gray-50">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
              <FileText size={13} className="text-indigo-500" />
              Provide observation logs or feedback (Required)
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Tell us about your flight height, cut onion shapes, or jar layers! (e.g. My soil settled into clear bands...)"
              className="w-full p-3 text-xs md:text-sm rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none bg-slate-50/35 text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
              <Camera size={13} className="text-cyan-500" />
              Upload snapshot to lock-in proof (Optional)
            </span>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPhotoUploaded(!isPhotoUploaded)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                  isPhotoUploaded
                    ? "bg-cyan-50 border-cyan-300 text-cyan-800"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-slate-50"
                }`}
              >
                <Camera size={16} />
                {isPhotoUploaded ? "✓ Mockup Snapshot Attached!" : "Capture / Upload Action Photo"}
              </button>
              <span className="text-[10px] text-gray-400 italic">Prepares image thumbnail inside profile shelf</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-xl text-white font-bold tracking-wider uppercase text-xs md:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 ${
              submitting ? "bg-indigo-300 cursor-wait animate-pulse" : themeColor.primary
            }`}
          >
            <Send size={15} />
            {submitting ? "Submitting Proof..." : "Submit Mission Proof & Unlock Badge! 🎉"}
          </button>
        </form>
      ) : (
        <div className="border border-slate-100 rounded-xl p-4 text-center text-xs text-slate-400">
          🔒 Complete all physical lesson checklists above to unlock observation logs submission and secure your certificate!
        </div>
      )}
    </div>
  );
}
