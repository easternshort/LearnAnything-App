import React, { useState } from "react";
import { Layout, CheckCircle, HelpCircle, Eye, ShieldAlert, Sparkles, Navigation, Zap, Compass, RotateCw, PenTool, TrendingUp, Sliders } from "lucide-react";
import { Visual } from "../types";

interface VisualRendererProps {
  visual: Visual;
  themeColor: {
    accentBg: string;
    text: string;
    badgeColor: string;
  };
}

export default function VisualRenderer({ visual, themeColor }: VisualRendererProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [interactiveThrottle, setInteractiveThrottle] = useState<number>(40); // 0% to 100% slider value
  const [joystickYaw, setJoystickYaw] = useState<number>(0); // -50 to 50
  const [activeSoilOrganic, setActiveSoilOrganic] = useState<string | null>(null);

  const { type, description, alt_text } = visual;

  // Labeled Image Interactive features
  const sampleLabelsForDrone = [
    { id: "prop", label: "Propellers", x: "25%", y: "20%", text: "Aero-balanced triple-blade carbon fiber rotors designed to push high downforce air columns. High-efficiency angle offsets create vertical trust limits." },
    { id: "brain", label: "Core Gyro IMU", x: "50%", y: "50%", text: "Internal Inertial Measurement Unit. Integrates tri-axial acceleration & gyroscope metrics 100 times every single second to maintain stable pitch and level hover." },
    { id: "batt", label: "LiPo Power cells", x: "48%", y: "82%", text: "High-capacity Lithium Polymer battery casing. Operates on continuous high amperages with thermal control circuits." },
    { id: "led", label: "Navigation LEDs", x: "82%", y: "45%", text: "Glow arrays indicating drone heading. Front red beacons warn oncoming aircraft, rear green lets pilots track visual line orientation." },
  ];

  const sampleLabelsForKnife = [
    { id: "pinch", label: "Pinch Bolster", x: "42%", y: "48%", text: "Perfect placement index finger & thumb clamping the thick bolster neck of premium forged stainless steel for full manual wrist articulation." },
    { id: "claw", label: "Claw Knuckles", x: "68%", y: "52%", text: "The helper hand forms a rigid cat-claw cage, resting fingernails flat as smooth guide guides, sliding knife safely flat against skin edges." },
    { id: "board", label: "Anti-Slip Underlay", x: "50%", y: "85%", text: "Damp double-ply sheet wedged below board absorbs wood shear vibrations and avoids hazardous, sudden slides on smooth slate tables." },
  ];

  const sampleLabelsForSoil = [
    { id: "worm", label: "Annelid Decomposers", x: "55%", y: "72%", text: "Wriggling garden earthworms processing dead detritus into premium organic castings, while carving porous subterranean tunnels for vital air pathways." },
    { id: "myco", label: "Mycorrhizal Web", x: "28%", y: "56%", text: "Symbiotic fungal underground filaments connecting roots. Facilitates deep-earth nitrogen & mineral routing in barter for plant carbon." },
    { id: "loam", label: "Mineral Pore Ratios", x: "78%", y: "42%", text: "Loamy structural aggregates comprising 40% sand filters, 40% silt retainers, and 20% clay pore microdot sponges." },
  ];

  // Helper to resolve interactive label files dynamically
  const getLabels = () => {
    if (visual.hotspots && visual.hotspots.length > 0) {
      return visual.hotspots;
    }
    const descLower = description.toLowerCase();
    if (descLower.includes("drone") || descLower.includes("quadcopter") || descLower.includes("uav")) {
      return sampleLabelsForDrone;
    }
    if (descLower.includes("knife") || descLower.includes("cut") || descLower.includes("pinch") || descLower.includes("claw")) {
      return sampleLabelsForKnife;
    }
    if (descLower.includes("soil") || descLower.includes("worm") || descLower.includes("layer") || descLower.includes("clay")) {
      return sampleLabelsForSoil;
    }
    // Dynamic fallbacks derived from AI description words
    return [
      { id: "pt1", label: "Primary Element", x: "30%", y: "45%", text: "Main starting target detail under study." },
      { id: "pt2", label: "Cooperating System", x: "70%", y: "55%", text: "Adjacent functional asset operating in real-time." },
    ];
  };

  const labels = getLabels();

  // Custom detailed inline SVG for Drone Blueprint
  const renderDetailedDroneSVG = () => {
    const isPropActive = activeLabel === "prop";
    const isBrainActive = activeLabel === "brain";
    const isBattActive = activeLabel === "batt";
    const isLedActive = activeLabel === "led";

    // Speed of spinning propellors derived from the interactive throttle slider!
    const propellerAnimSpeed = Math.max(0.1, 1.5 - (interactiveThrottle / 100));

    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4">
        {/* CSS Animations style block */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes rotor-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rotor-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes signal-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.95; }
          }
          @keyframes compass-drift {
            0%, 100% { transform: scale(1.05); }
            50% { transform: scale(0.95); }
          }
          .propeller-cw {
            transform-origin: 100px 70deg;
            animation: rotor-spin-cw ${propellerAnimSpeed}s linear infinite;
          }
          .propeller-ccw {
            animation: rotor-spin-ccw ${propellerAnimSpeed}s linear infinite;
          }
        `}} />

        {/* High Tech Engineering HUD Interface */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] text-slate-400 font-mono z-10 bg-slate-900/65 p-2 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>SYS: ACTIVE V3.21</span>
          </div>
          <div>ALTITUDE: {(interactiveThrottle * 0.15).toFixed(1)}m</div>
          <div>YAW CORRECTION: {joystickYaw}°</div>
          <div>ROTORS: {interactiveThrottle > 0 ? `${(4000 + interactiveThrottle * 45).toFixed(0)} RPM` : "OFF"}</div>
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 text-[10px] text-slate-400 font-mono z-10 bg-slate-900/65 p-2 rounded-lg border border-slate-800/80">
          <div className="text-emerald-400">GPS: LOCK (18 SAT)</div>
          <div>COMPASS HDG: {((285 + joystickYaw) % 360)}° WNW</div>
          <div className="flex gap-1 items-center mt-1">
            <span className="text-slate-500">LiPo:</span>
            <div className="w-12 h-2.5 bg-slate-800 border border-slate-700 rounded-sm overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: "95%" }}></div>
            </div>
            <span className="text-emerald-400 font-bold">95%</span>
          </div>
        </div>

        {/* Telemetry coordinate marks */}
        <div className="absolute inset-0 border border-slate-800/45 pointer-events-none rounded-xl m-1"></div>
        <div className="absolute left-1/2 top-4 bottom-4 border-l border-dashed border-slate-800/40 pointer-events-none"></div>
        <div className="absolute top-1/2 left-4 right-4 border-t border-dashed border-slate-800/40 pointer-events-none"></div>

        {/* Dynamic HUD Artificial Horizon overlay */}
        <svg className="absolute inset-x-0 bottom-4 mx-auto w-32 h-10 pointer-events-none text-slate-500 opacity-65 font-mono text-[9px]" viewBox="0 0 100 30">
          <line x1="10" y1="15" x2="40" y2="15" stroke="currentColor" strokeWidth="1.5" />
          <line x1="60" y1="15" x2="90" y2="15" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 45,15 A 5,5 0 0,1 55,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="50" y="27" textAnchor="middle" fill="currentColor">CLIMB RATIO</text>
        </svg>

        {/* The main diagram drawing canvas */}
        <div className="relative w-full h-80 flex items-center justify-center p-6 bg-radial from-slate-900 via-slate-950 to-slate-950">
          <svg className="w-full max-w-sm h-full select-none" viewBox="0 0 400 300">
            {/* Background circular radar layout */}
            <circle cx="200" cy="150" r="130" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <circle cx="200" cy="150" r="80" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="200" cy="150" r="30" fill="none" stroke="#334155" strokeWidth="1" />

            {/* Arm struts of the Quadcopter */}
            {/* Arm 1: Top-Left */}
            <line x1="200" y1="150" x2="110" y2="70" stroke={isPropActive ? "#06b6d4" : "#475569"} strokeWidth="10" strokeLinecap="round" />
            <line x1="200" y1="150" x2="110" y2="70" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
            {/* Arm 2: Top-Right */}
            <line x1="200" y1="150" x2="290" y2="70" stroke={isPropActive ? "#06b6d4" : "#475569"} strokeWidth="10" strokeLinecap="round" />
            <line x1="200" y1="150" x2="290" y2="70" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
            {/* Arm 3: Bottom-Left */}
            <line x1="200" y1="150" x2="110" y2="230" stroke={isPropActive ? "#06b6d4" : "#475569"} strokeWidth="10" strokeLinecap="round" />
            <line x1="200" y1="150" x2="110" y2="230" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
            {/* Arm 4: Bottom-Right */}
            <line x1="200" y1="150" x2="290" y2="230" stroke={isPropActive ? "#06b6d4" : "#475569"} strokeWidth="10" strokeLinecap="round" />
            <line x1="200" y1="150" x2="290" y2="230" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

            {/* Carbon Structural Frame connectors */}
            <rect x="180" y="80" width="40" height="140" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle cx="200" cy="150" r="45" fill="#0f172a" stroke={isBrainActive ? "#f59e0b" : "#475569"} strokeWidth={isBrainActive ? 4 : 2} />

            {/* Central flight core gyro computer / spinning light indicator */}
            <circle cx="200" cy="150" r="25" fill="#111827" stroke="#334155" strokeWidth="1" />
            <path d="M 190,150 A 10,10 0 0,1 210,150" fill="none" stroke="#f59e0b" strokeWidth="3" className="animate-spin" style={{ transformOrigin: "200px 150px" }} />
            <circle cx="200" cy="150" r="6" fill="#f59e0b" className="animate-pulse" />

            {/* Battery Module at Rear/Back (Y values 190-230) */}
            <rect x="184" y="195" width="32" height="42" rx="4" fill={isBattActive ? "#10b981" : "#334155"} stroke={isBattActive ? "#34d399" : "#475569"} strokeWidth={isBattActive ? 3 : 1.5} />
            {/* Power LED Indicator dots on the battery */}
            <circle cx="192" cy="205" r="2" fill="#10b981" />
            <circle cx="200" cy="205" r="2" fill="#10b981" />
            <circle cx="208" cy="205" r="2" fill="#10b981" />
            <circle cx="200" cy="220" r="5" fill="#030712" stroke="#4b5563" />

            {/* Camera Gimbal assembly at the Nose Front (Y values 75) */}
            <rect x="188" y="55" width="24" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="200" y1="50" x2="200" y2="58" stroke="#ef4444" strokeWidth="3" />
            {/* Spherical Camera Glass lens sphere */}
            <circle cx="200" cy="68" r="10" fill="#090d16" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="197" cy="65" r="3" fill="#ffffff" opacity="0.7" />

            {/* Drone Motor Caps (4 corners) */}
            {/* Top-Left */}
            <circle cx="110" cy="70" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle cx="110" cy="70" r="6" fill="#ef4444" />
            {/* Top-Right */}
            <circle cx="290" cy="70" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle cx="290" cy="70" r="6" fill="#ef4444" />
            {/* Bottom-Left */}
            <circle cx="110" cy="230" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle cx="110" cy="230" r="6" fill="#22c55e" />
            {/* Bottom-Right */}
            <circle cx="290" cy="230" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle cx="290" cy="230" r="6" fill="#22c55e" />

            {/* Dynamic visual flight LED glowing rings if active */}
            {isLedActive && (
              <>
                <circle cx="110" cy="70" r="24" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
                <circle cx="290" cy="70" r="24" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" strokeDasharray="3,3" />
                <circle cx="110" cy="230" r="24" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-ping" strokeDasharray="3,3" />
                <circle cx="290" cy="230" r="24" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-ping" />
              </>
            )}

            {/* Rotors / Propeller blades layered drawing (Animated spinning arcs!) */}
            {/* Top-Left: Propeller CW */}
            <g style={{ transformOrigin: "110px 70px" }} className={interactiveThrottle > 0 ? "propeller-cw" : undefined}>
              <ellipse cx="110" cy="70" rx="35" ry="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="75" y1="70" x2="145" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <rect x="73" y="68" width="8" height="4" rx="2" fill="#334155" />
              <rect x="139" y="68" width="8" height="4" rx="2" fill="#334155" />
            </g>

            {/* Top-Right: Propeller CCW */}
            <g style={{ transformOrigin: "290px 70px" }} className={interactiveThrottle > 0 ? "propeller-cw" : undefined}>
              <ellipse cx="290" cy="70" rx="35" ry="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="255" y1="70" x2="325" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <rect x="253" y="68" width="8" height="4" rx="2" fill="#334155" />
              <rect x="319" y="68" width="8" height="4" rx="2" fill="#334155" />
            </g>

            {/* Bottom-Left: Propeller CCW */}
            <g style={{ transformOrigin: "110px 230px" }} className={interactiveThrottle > 0 ? "propeller-cw" : undefined}>
              <ellipse cx="110" cy="230" rx="35" ry="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="75" y1="230" x2="145" y2="230" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Bottom-Right: Propeller CW */}
            <g style={{ transformOrigin: "290px 230px" }} className={interactiveThrottle > 0 ? "propeller-cw" : undefined}>
              <ellipse cx="290" cy="230" rx="35" ry="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="255" y1="230" x2="325" y2="230" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Real-time slider controller to adjust thrust/altitude simulation directly */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl mt-3 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sliders size={15} />
            <span>Interactive Simulator Throttle Stick</span>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-slate-500 text-[10px]">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={interactiveThrottle}
              onChange={(e) => setInteractiveThrottle(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
            <span className="text-cyan-300 font-bold w-8 text-right">{interactiveThrottle}%</span>
          </div>
        </div>
      </div>
    );
  };

  // Custom detailed inline SVG for Knife Skills & Anatomy Blueprint
  const renderDetailedKnifeSVG = () => {
    const isPinchActive = activeLabel === "pinch";
    const isClawActive = activeLabel === "claw";
    const isBoardActive = activeLabel === "board";

    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-amber-50/15 border border-amber-900/10 p-4">
        <div className="w-full h-72 flex items-center justify-center bg-radial from-orange-50/50 to-orange-100/40 rounded-xl relative p-3">
          {/* Wooden chopping board panel lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-orange-100/20 to-amber-200/30 m-2 rounded-lg border-2 border-amber-900/15 flex flex-col justify-between p-3 pointer-events-none">
            <div className="w-full h-px bg-amber-900/10"></div>
            <div className="w-full h-px bg-amber-900/10"></div>
            <div className="w-full h-px bg-amber-900/10"></div>
            <div className="w-full h-px bg-amber-900/15"></div>
            <div className="w-full h-px bg-amber-900/10"></div>
            <div className="w-full h-px bg-amber-900/10"></div>
          </div>

          <svg className="w-full max-w-sm h-full select-none z-10" viewBox="0 0 400 300">
            {/* Labeled coordinate scale */}
            <text x="10" y="20" fill="#9a3412" className="font-mono text-[9px] font-bold uppercase opacity-60">FRENCH CHEF ANATOMY - 200mm</text>
            <line x1="20" y1="285" x2="380" y2="285" stroke="#9a3412" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
            <text x="200" y="278" textAnchor="middle" fill="#9a3412" className="font-mono text-[8px] opacity-50">BOARD PLANE ALIGNMENT</text>

            {/* DAMP SLIP TOWEL underneath chopping board */}
            {isBoardActive && (
              <path d="M 40,260 L 360,260 L 370,288 L 30,288 Z" fill="#93c5fd" opacity="0.6" stroke="#2563eb" strokeWidth="1.5" className="animate-pulse" />
            )}

            {/* Sliced Vegetable / Yellow Onion layers under blade block */}
            <g transform="translate(180, 160)">
              {/* Outer skin */}
              <path d="M -30,40 C -50,10 -30,-30 0,-30 C 30,-30 50,10 30,40 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <path d="M -20,38 C -35,15 -25,-20 0,-20 C 25,-20 35,15 20,38 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />
              {/* Sliced half cross rings */}
              <circle cx="5" cy="10" r="15" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="2,2" />
              <circle cx="5" cy="10" r="25" fill="none" stroke="#ea580c" strokeWidth="1" />
              <text x="5" y="47" textAnchor="middle" fill="#7c2d12" className="font-bold text-[9px]">ONION TARGET</text>
            </g>

            {/* Elegant Triple-riveted Chef's Knife Drawing */}
            <g transform="translate(40, -10)">
              {/* The Knife Handle (Tang, Wood Scales, Rivets) */}
              <rect x="10" y="145" width="110" height="24" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              
              {/* Handle tang metal silver border strip */}
              <line x1="12" y1="157" x2="118" y2="157" stroke="#94a3b8" strokeWidth="2.5" />
              
              {/* Rivets (3 shiny physical circle pegs) */}
              <circle cx="30" cy="157" r="4.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <circle cx="65" cy="157" r="4.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <circle cx="100" cy="157" r="4.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />

              {/* Seamless Bolster Collar (Heavily highlighted when pinch grip is chosen) */}
              <path d="M 119,141 L 132,141 L 132,175 L 119,173 Z" fill={isPinchActive ? "#eb5e28" : "#94a3b8"} stroke="#475569" strokeWidth="1.5" className={isPinchActive ? "animate-pulse" : ""} />
              {isPinchActive && (
                <circle cx="125" cy="157" r="12" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
              )}

              {/* Satin-Finished Stainless Steel Blade Body with continuous Tapered profile */}
              <path d="M 132,141 L 340,154 C 330,195 285,215 132,216 Z" fill="url(#silver-bevel)" stroke="#475569" strokeWidth="1.5" />
              {/* Cutting Bevel Edge line (Extremely thin) */}
              <path d="M 132,213 C 275,213 325,193 336,155" fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />

              {/* Hand Grip Pinch Indicator guidelines overlay */}
              {isPinchActive && (
                <g>
                  {/* Thumb print outline clamp */}
                  <ellipse cx="125" cy="148" rx="8" ry="12" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="125" y="128" textAnchor="middle" fill="#b91c1c" className="font-sans text-[8px] font-black uppercase">Thumb Pinch</text>
                  <path d="M 125,133 L 125,142" stroke="#ef4444" strokeWidth="1" markerEnd="arrow" />
                </g>
              )}
            </g>

            {/* CURLED SAFETY CLAW WRIST/HAND OVERLAY (represented next to vegetable slicing zone) */}
            <g transform="translate(230, 95)" opacity={isClawActive ? 1 : 0.45}>
              {/* Knuckle protection shield drawing */}
              <path d="M 20,10 C 10,20 10,40 22,55 C 34,70 50,75 50,60 C 50,45 35,35 30,10 Z" fill="none" stroke={isClawActive ? "#f97316" : "#475569"} strokeWidth="2.5" strokeLinecap="round" className={isClawActive ? "animate-pulse" : ""} />
              {/* Guidelines representing knuckes shielding sliding steel */}
              <line x1="18" y1="20" x2="18" y2="50" stroke="#f97316" strokeWidth={isClawActive ? 2 : 1} strokeDasharray="2,2" />
              <text x="50" y="5" textAnchor="middle" fill="#ea580c" className="font-sans text-[8px] font-black uppercase">Curled Shield Wall</text>
            </g>

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="silver-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  // Custom detailed inline SVG for Soil Chemistry & Layer Cross-section Blueprint
  const renderDetailedSoilSVG = () => {
    const isWormActive = activeLabel === "worm";
    const isMycoActive = activeLabel === "myco";
    const isLoamActive = activeLabel === "loam";

    const organicFactors = [
      { id: "leaves", name: "Leaf Humus (O-Horizon)", percent: "92%", color: "text-emerald-700 bg-emerald-50", text: "Partially decomposed oak foliage, twigs, and leaf litter forming a soft high-nitrogen mulch barrier." },
      { id: "roots", name: "Roots Aggregates (A-Horizon)", percent: "65%", color: "text-amber-800 bg-amber-50", text: "Granular crumb aggregates held together by plant mucilage, fungal glomalin glues, and carbon exudates." },
      { id: "clay", name: "Clay Hydration (B-Horizon)", percent: "18%", color: "text-sky-800 bg-sky-50", text: "Subsoil fine clay particles carrying high iron and aluminum minerals, retaining structural capillary water." }
    ];

    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 p-4">
        {/* Dynamic Interactive Panel layout splits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main detailed high resolution visual block */}
          <div className="md:col-span-2 relative h-80 bg-stone-950 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center p-2">
            <svg className="w-full h-full select-none" viewBox="0 0 300 240">
              
              {/* LAYER 1: O-Horizon (Top canopy, moss & grass mulch) Y values: 0 to 45 */}
              <rect x="10" y="10" width="280" height="35" fill="#3f2e15" stroke="#1c1917" strokeWidth="1" />
              <g transform="translate(15, 12)">
                {/* Visual grass blades */}
                <path d="M 10,12 L 15,2 L 20,12" fill="none" stroke="#10b981" strokeWidth="2" />
                <path d="M 25,12 L 28,-1 L 32,12" fill="none" stroke="#059669" strokeWidth="2.5" />
                <path d="M 45,12 L 40,3 L 48,12" fill="none" stroke="#22c55e" strokeWidth="2" />
                <path d="M 70,12 L 75,-2 L 80,12" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.8" />
                <path d="M 110,12 L 112,0 L 118,12" fill="none" stroke="#059669" strokeWidth="2" />
                <path d="M 160,12 L 165,3 L 170,12" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <path d="M 210,12 L 214,1 L 218,12" fill="none" stroke="#22c55e" strokeWidth="2" />
                <path d="M 240,12 L 245,-3 L 250,12" fill="none" stroke="#059669" strokeWidth="2.5" />
              </g>
              <text x="150" y="32" textAnchor="middle" fill="#34d399" className="font-mono text-[9px] font-black uppercase tracking-wider">O-HORIZON (Litter Humus)</text>

              {/* LAYER 2: A-Horizon (Topsoil organic root chamber) Y values: 45 to 110 */}
              <rect x="10" y="45" width="280" height="65" fill="#291d0cf5" stroke="#1c1917" strokeWidth="1" />
              
              {/* Branching Plant Root System Network */}
              <g stroke={isMycoActive ? "#c084fc" : "#e7e5e4"} strokeWidth={isMycoActive ? 2 : 1.5} fill="none" opacity="0.85">
                {/* Plant root core */}
                <path d="M 115,45 Q 110,65 100,85 T 130,110" />
                <path d="M 115,45 Q 125,65 135,80" />
                <path d="M 112,55 Q 85,70 70,85" />
                <path d="M 70,85 Q 50,90 40,105" />
                <path d="M 124,65 Q 155,75 170,95" />
                <path d="M 170,95 Q 185,100 205,108" />
              </g>

              {/* White glowing Mycelium web filaments (displayed around roots when choice selected) */}
              {isMycoActive && (
                <g stroke="#d8b4fe" strokeWidth="1" strokeDasharray="1.5,1.5" fill="none" className="animate-pulse">
                  <path d="M 100,85 L 85,95 L 75,90 M 135,80 L 150,90 L 160,82" />
                  <path d="M 70,85 L 60,70 L 50,75 M 170,95 L 180,105 L 195,95" />
                  <path d="M 40,105 L 20,110 L 25,100 M 110,65 L 115,78 L 105,82" />
                </g>
              )}
              <text x="150" y="78" textAnchor="middle" fill="#fb923c" className="font-mono text-[9px] font-black uppercase tracking-wider">A-HORIZON (Topsoil & Roots)</text>

              {/* Tunneling Segmented Earthworm (wiggles if selected!) */}
              <g transform={isWormActive ? "translate(0, -3)" : undefined} className={isWormActive ? "animate-bounce" : undefined}>
                {/* Worm Tunnel Path */}
                <path d="M 130,105 Q 155,108 175,125 T 220,135" fill="none" stroke="#1c1917" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
                {/* Segmented Pink Worm */}
                <path d="M 140,106 Q 158,107 172,122 T 210,133" fill="none" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" />
                {/* Segments highlights */}
                <path d="M 142,106 L 143,106 M 150,106 L 151,106 M 160,110 L 161,111 M 170,121 L 171,123 M 185,129 L 186,130" fill="none" stroke="#db2777" strokeWidth="4" />
                {/* Face dot */}
                <circle cx="210" cy="133" r="1" fill="#111827" />
              </g>

              {/* LAYER 3: B-Horizon (Fine clay/silt sediments) Y values: 110 to 180 */}
              <rect x="10" y="110" width="280" height="70" fill="#5c3d11" stroke="#1c1917" strokeWidth="1" />
              <g fill="#78350f" opacity="0.45">
                {/* Clay aggregates */}
                <circle cx="35" cy="135" r="8" />
                <circle cx="240" cy="125" r="11" />
                <circle cx="95" cy="165" r="12" />
                <circle cx="55" cy="155" r="6" />
                <circle cx="165" cy="160" r="10" />
                <circle cx="255" cy="155" r="7" />
              </g>
              <text x="150" y="145" textAnchor="middle" fill="#b45309" className="font-mono text-[9px] font-black uppercase tracking-wider">B-HORIZON (Mineral Clay Subsoil)</text>
              
              {/* LAYER 4: C-Horizon (Crumbling Bedrock fragments) Y values: 180 to 230 */}
              <rect x="10" y="180" width="280" height="50" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
              <g fill="#78716c" opacity="0.6" stroke="#292524" strokeWidth="1.5">
                {/* Hexagonal sharp bedrock chunks */}
                <polygon points="25,190 45,185 55,205 35,215 15,200" />
                <polygon points="120,200 150,188 165,205 145,225 115,215" />
                <polygon points="215,205 245,195 260,210 235,228 210,218" />
                <polygon points="75,205 98,200 102,218 80,224" />
              </g>
              <text x="150" y="210" textAnchor="middle" fill="#a8a29e" className="font-mono text-[9px] font-black uppercase tracking-wider">C-HORIZON (Crumbling Rock Bedrock)</text>

            </svg>
          </div>

          {/* Side stats / Soil element card panel selector details */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-[10px] text-stone-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Compass size={13} className="text-emerald-500" />
              Ecosystem Dashboard
            </h4>
            
            {organicFactors.map((fact) => (
              <button
                key={fact.id}
                onClick={() => setActiveSoilOrganic(activeSoilOrganic === fact.id ? null : fact.id)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer block ${
                  activeSoilOrganic === fact.id 
                    ? "bg-stone-800 border-emerald-500 text-white" 
                    : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-750"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] mb-0.5">
                  <span className="line-clamp-1">{fact.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-stone-950 font-mono text-emerald-400 text-[10px] border border-stone-800">{fact.percent}</span>
                </div>
                {activeSoilOrganic === fact.id ? (
                  <p className="text-[10px] text-stone-400 leading-normal mt-1 pt-1 border-t border-stone-750/50">
                    {fact.text}
                  </p>
                ) : (
                  <p className="text-[9px] text-stone-500 italic">Click to expand diagnostics</p>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  };

  // Helper to map color names to raw hex codes for custom vector drawings
  const getColorHex = (colorName: string | undefined): string => {
    switch (colorName) {
      case "cyan": return "#06b6d4";
      case "indigo": return "#6366f1";
      case "amber": return "#fbbf24";
      case "rose": return "#f43f5e";
      case "emerald": return "#10b981";
      case "violet": return "#8b5cf6";
      case "slate": return "#94a3b8";
      default: return "#06b6d4"; // Cyan fallback
    }
  };

  const getColorFillHex = (colorName: string | undefined, filled: boolean | undefined): string => {
    if (!filled) return "none";
    switch (colorName) {
      case "cyan": return "rgba(6, 182, 212, 0.15)";
      case "indigo": return "rgba(99, 102, 241, 0.15)";
      case "amber": return "rgba(251, 191, 36, 0.15)";
      case "rose": return "rgba(244, 63, 94, 0.15)";
      case "emerald": return "rgba(16, 185, 129, 0.15)";
      case "violet": return "rgba(139, 92, 246, 0.15)";
      case "slate": return "rgba(148, 163, 184, 0.15)";
      default: return "rgba(6, 182, 212, 0.15)";
    }
  };

  // Generic technical circuit blueprint layout for dynamically generated courses
  const renderGenericBlueprintSVG = () => {
    const hasCustomElements = visual.blueprint_elements && visual.blueprint_elements.length > 0;

    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 font-mono">
        <div className="absolute top-3 left-3 text-[10px] text-cyan-400 flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-widest uppercase text-[9px] text-cyan-400">
            {hasCustomElements ? "CLASSROOM BESPOKE HIGH-FIDELITY SCHEMATIC" : "CLASSROOM HIGH-FIDELITY VECTOR CANVAS"}
          </span>
        </div>
        
        <div className="w-full h-72 flex items-center justify-center relative bg-slate-900/30 rounded-lg overflow-hidden">
          {/* Engineering blue network grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-60"></div>
          
          {/* Animated glowing vertical scanline */}
          <div className="absolute top-0 bottom-0 w-full overflow-hidden pointer-events-none">
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-bounce"></div>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Draw neon connecting vector lines between hotspot positions to create an integrated diagram */}
            {labels.length >= 2 && (
              <polyline
                points={labels.map(l => `${parseFloat(l.x)},${parseFloat(l.y) - 5}`).join(" ")}
                fill="none"
                stroke="rgba(6, 182, 212, 0.45)"
                strokeWidth="0.75"
                strokeDasharray="2,2"
              />
            )}
            
            {/* Neon coordinate rings around hotspots to build deep context */}
            {labels.map((item, index) => (
              <g key={item.id}>
                <circle
                  cx={parseFloat(item.x)}
                  cy={parseFloat(item.y) - 5}
                  r="4"
                  fill="none"
                  stroke={index === 0 ? "rgba(99, 102, 241, 0.45)" : index === 1 ? "rgba(236, 72, 153, 0.45)" : "rgba(6, 182, 212, 0.45)"}
                  strokeWidth="0.5"
                />
                <circle
                  cx={parseFloat(item.x)}
                  cy={parseFloat(item.y) - 5}
                  r="8"
                  fill="none"
                  stroke={index === 0 ? "rgba(99, 102, 241, 0.2)" : index === 1 ? "rgba(236, 72, 153, 0.2)" : "rgba(6, 182, 212, 0.2)"}
                  strokeWidth="0.25"
                  strokeDasharray="1,1"
                />
              </g>
            ))}
          </svg>

          {hasCustomElements ? (
            /* Custom dynamically-generated high-fidelity SVG illustration */
            <svg className="w-full h-full p-4 relative z-0" viewBox="0 0 100 100">
              {visual.blueprint_elements?.map((el, i) => {
                const strokeHex = getColorHex(el.color);
                const fillHex = getColorFillHex(el.color, el.filled);
                const sw = el.strokeWidth || 1;

                if (el.type === "circle" && el.cx !== undefined && el.cy !== undefined && el.r !== undefined) {
                  return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} stroke={strokeHex} fill={fillHex} strokeWidth={sw} />;
                }
                if (el.type === "ellipse" && el.cx !== undefined && el.cy !== undefined && el.rx !== undefined && el.ry !== undefined) {
                  return <ellipse key={i} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} stroke={strokeHex} fill={fillHex} strokeWidth={sw} />;
                }
                if (el.type === "rect" && el.x !== undefined && el.y !== undefined && el.w !== undefined && el.h !== undefined) {
                  return <rect key={i} x={el.x} y={el.y} width={el.w} height={el.h} stroke={strokeHex} fill={fillHex} strokeWidth={sw} rx="1.5" />;
                }
                if (el.type === "line" && el.x1 !== undefined && el.y1 !== undefined && el.x2 !== undefined && el.y2 !== undefined) {
                  return <line key={i} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={strokeHex} strokeWidth={sw} />;
                }
                if (el.type === "path" && el.d) {
                  return <path key={i} d={el.d} stroke={strokeHex} fill={fillHex} strokeWidth={sw} />;
                }
                if (el.type === "text" && el.x !== undefined && el.y !== undefined && el.label) {
                  return (
                    <text key={i} x={el.x} y={el.y} fill={strokeHex} fontSize="3.8" fontWeight="black" textAnchor="middle" style={{ fontFamily: "monospace" }}>
                      {el.label}
                    </text>
                  );
                }
                return null;
              })}
            </svg>
          ) : (
            /* Epic abstract centerpiece graphic */
            <div className="w-44 h-44 rounded-full bg-slate-950 border border-indigo-500/30 flex items-center justify-center p-3 relative shadow-2xl backdrop-blur-xs">
              <div className="text-center">
                <span className="text-4xl block mb-2 leading-none animate-pulse">🛰️</span>
                <div className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider">MODULE ANALYSIS</div>
                <div className="text-[10px] text-pink-400 font-bold tracking-tight uppercase max-w-[120px] truncate">{visual.alt_text}</div>
              </div>
              
              {/* Overlay secondary compass lines */}
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-800 animate-spin" style={{ animationDuration: "25s" }}></div>
              <div className="absolute inset-2 rounded-full border border-dotted border-cyan-500/20 animate-spin" style={{ animationDuration: "12s" }}></div>
            </div>
          )}

          {/* Active stats display */}
          <div className="absolute bottom-3 left-3 text-[9px] text-slate-400 leading-normal bg-slate-950/80 p-2 rounded border border-slate-800/80 font-mono">
            <div>TARGET RATIO: DYNAMIC</div>
            <div>MESH CHANNELS: 100% ONLINE</div>
            <div>BLUEPRINT CAP: AGES 7-99 APPROVED</div>
          </div>

          <div className="absolute bottom-3 right-3 text-[9px] text-right text-slate-500 leading-normal">
            <div>GRID ADDR: 0x7FFF92</div>
            <div>RENDER SYSTEM: {hasCustomElements ? "BESPOKE_VECTOR" : "STATIC_VECTOR"}</div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-sans">
          <span className="font-extrabold text-cyan-400 font-mono text-[11px] block mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Dynamic Blueprint Inspector
          </span>
          "{description}"
        </div>
      </div>
    );
  };

  // Helper renderer to pick correct detailed illustration template
  const renderDetailedVisual = () => {
    const descLower = description.toLowerCase();
    if (descLower.includes("drone") || descLower.includes("quadcopter") || descLower.includes("uav")) {
      return renderDetailedDroneSVG();
    }
    if (descLower.includes("knife") || descLower.includes("cut") || descLower.includes("chop") || descLower.includes("pinch") || descLower.includes("claw")) {
      return renderDetailedKnifeSVG();
    }
    if (descLower.includes("soil") || descLower.includes("worm") || descLower.includes("layer") || descLower.includes("clay")) {
      return renderDetailedSoilSVG();
    }
    return renderGenericBlueprintSVG();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden p-6 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${themeColor.accentBg} ${themeColor.text}`}>
            Interactive Blueprint • {type.replace("_", " ")}
          </span>
        </div>
        <p className="text-xs text-gray-400 italic">Click markers or adjust controllers to simulate</p>
      </div>

      {/* RENDER DENSE HOVER-HOTSPOT SECTION */}
      {type === "labeled_image" && (
        <div className="space-y-4">
          <div className="relative">
            {/* The actual premium SVG drawing goes here! */}
            {renderDetailedVisual()}

            {/* Interactive Target Dots overlayed perfectly at precise points */}
            {labels.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveLabel(activeLabel === item.id ? null : item.id)}
                className="absolute w-8 h-8 rounded-full bg-white text-slate-800 border-2 border-indigo-600 shadow-md flex items-center justify-center font-bold text-xs hover:scale-115 active:scale-90 transition-all outline-none cursor-pointer group"
                style={{ left: item.x, top: item.y }}
                title={item.label}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-30"></span>
                <span className="z-10 group-hover:scale-110">🔎</span>
              </button>
            ))}
          </div>

          {/* Interactive Info Sheet */}
          {activeLabel ? (
            <div className="p-4 rounded-xl border border-indigo-150 bg-indigo-50/40 text-xs">
              <div className="font-bold flex items-center justify-between gap-1.5 mb-1.5 text-indigo-900 uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-600" />
                  {labels.find((l) => l.id === activeLabel)?.label}
                </span>
                <span className="text-[10px] font-bold text-indigo-500 bg-white border px-1.5 py-0.2 rounded font-mono">SELECTED DETAIL</span>
              </div>
              <p className="text-indigo-950 leading-relaxed">
                {labels.find((l) => l.id === activeLabel)?.text}
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-gray-150 bg-slate-50/50 text-center text-xs text-gray-500">
              💡 Tap any of the blinking 🔎 hot-spots inside the blueprint layout above to inspect high-fidelity specifications of different components.
            </div>
          )}
        </div>
      )}

      {/* RENDER STEP SEQUENCE BREAKDOWN CARDS */}
      {type === "step_sequence" && (
        <div className="bg-slate-50/60 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-slate-500 font-extrabold mb-3.5 flex items-center gap-1.5 uppercase tracking-wider">
            <Layout size={14} className="text-cyan-500" />
            High Fidelity Sequence Panels
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {description.includes("4-step") || description.includes("checklist") || description.toLowerCase().includes("drone") ? (
              <>
                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">🔍</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-150 text-cyan-700 font-bold flex items-center justify-center text-[10px]">1</span>
                      Stress Inspect
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Gently pull rotors vertically to check brushless motor shafts, securing locking studs to prevent sudden airborne detachments.</p>
                  </div>
                  <div className="text-[9px] font-mono mt-3 text-cyan-600 font-bold bg-cyan-50 p-1 rounded inline-block text-center select-none">HARDWARE LEVEL OK</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">🔌</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-150 text-cyan-700 font-bold flex items-center justify-center text-[10px]">2</span>
                      Transmitter Sync
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Always power sequence transmitter handle FIRST, ensuring stable 2.4Ghz radio channel binding before feeding drone LiPo power.</p>
                  </div>
                  <div className="text-[9px] font-mono mt-3 text-emerald-600 font-bold bg-emerald-50 p-1 rounded inline-block text-center select-none">CONTROLLER SYNC LOCK</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">🚁</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-150 text-cyan-700 font-bold flex items-center justify-center text-[10px]">3</span>
                      Calibration Hover
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Throttle up softly, establishing a flat hover at exactly 3ft to isolate and check battery sag, altitude barometers, and gyro levels.</p>
                  </div>
                  <div className="text-[9px] font-mono mt-3 text-purple-600 font-bold bg-purple-50 p-1 rounded inline-block text-center select-none">ALTITUDE GRADY SAFE</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">⚙️</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold flex items-center justify-center text-[10px]">1</span>
                      Setup Stage
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Stabilize and align materials, ensuring protective gloves or anti-slip pads are locked in place before beginning actions.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">⚡</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold flex items-center justify-center text-[10px]">2</span>
                      Action Flow
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Initiate with micro-nudges or controlled slices, building muscle memory before pushing speed tolerances.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-2xl block mb-2 leading-none">🌟</span>
                    <div className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold flex items-center justify-center text-[10px]">3</span>
                      Certification
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">Analyze and verify uniformity, looking for clear stratified lines or level surface finishes of the finalized project.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* RENDER COMPARISON ZONES */}
      {type === "comparison" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-500/10 border border-emerald-300 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-emerald-200/50 pb-2">
                <h4 className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle size={14} className="text-emerald-600" />
                  Optimal Standard Zone
                </h4>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">APPROVED</span>
              </div>
              <div className="bg-white p-4 rounded-xl text-xs text-emerald-950 font-medium leading-relaxed shadow-3xs">
                {description.toLowerCase().includes("soil") 
                  ? "A rich structured aggregates loam ratio allows excess moisture to seep down efficiently, storing thin surface tension water inside clays to keep plant root pores nourished in oxygen."
                  : description.toLowerCase().includes("drone")
                  ? "Operating within legal open airspace zones under the 400ft ceiling line. Clear Line of Sight permits real-time avoidance adjustments to keep manned aircraft fully unimpeded."
                  : "Keep thumb and index fingers locked directly in a solid pinch clamp onto the heavy steel bolster cap, allowing the blade weight to pivot forward with absolute control."
                }
              </div>
            </div>
            
            {/* Minimal schematic showing safe height zone vector */}
            <svg className="w-full h-12 text-emerald-700 font-mono text-[9px]" viewBox="0 0 200 40">
              <rect x="10" y="25" width="180" height="8" fill="#a7f3d0" rx="2" />
              <line x1="10" y1="10" x2="190" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              <text x="100" y="8" textAnchor="middle" fill="currentColor">DESIRED TARGET PLANE</text>
              <circle cx="100" cy="29" r="3.5" fill="#059669" />
            </svg>
          </div>

          <div className="bg-rose-500/10 border border-rose-300 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-rose-200/50 pb-2">
                <h4 className="font-extrabold text-rose-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldAlert size={14} className="text-rose-600" />
                  Critical Hazard Zone
                </h4>
                <span className="text-[10px] bg-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded-full">DANGER</span>
              </div>
              <div className="bg-white p-4 rounded-xl text-xs text-rose-950 font-medium leading-relaxed shadow-3xs">
                {description.toLowerCase().includes("soil") 
                  ? "Unbalanced sand drains moisture instantly, leaving seedlings dry and parched. Unbalanced clay clumps tight like wet glue, completely drowning root pathways and inducing bacterial decay."
                  : description.toLowerCase().includes("drone")
                  ? "Operating within exclusion circles like helicopter medical zones, busy highways, or deep airport runway paths, risking dangerous video dropouts or collisions."
                  : "Holding a single extended finger propped hard on the top edge spine of the knife blade. Pushes force unevenly sideways, which regularly leads to blade flips and extreme finger cuts."
                }
              </div>
            </div>

            {/* Minimal schematic showing hazard scale vector */}
            <svg className="w-full h-12 text-rose-700 font-mono text-[9px]" viewBox="0 0 200 40">
              <rect x="10" y="15" width="180" height="20" fill="#fecdd3" rx="2" />
              <path d="M 90,5 L 110,5 L 100,20 Z" fill="#e11d48" />
              <text x="100" y="32" textAnchor="middle" fill="#e11d48" className="font-bold">CRITICAL THRESHOLD COLLAPSE</text>
            </svg>
          </div>
        </div>
      )}

      {/* RENDER DIAGRAMS AND ILLUSTRATIONS WITH INTERACTIVE SIMULATORS */}
      {(type === "illustration" || type === "diagram") && (
        <div className="space-y-4">
          {/* Main customized layout */}
          {renderDetailedVisual()}

          {/* Interactive joystick layout simulation for general joystick controls */}
          {(description.toLowerCase().includes("joystick") || description.toLowerCase().includes("transmitter") || description.toLowerCase().includes("controller")) && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 text-slate-100">
              <h4 className="font-extrabold text-xs text-sky-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <Sliders size={14} />
                Radio Transmitter Interactive Joy Stick Deck
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Left Controller stick widget */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono">
                  <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wide">Left Stick (Throttle / Yaw)</p>
                  
                  {/* Joystick pad graphic */}
                  <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 mx-auto relative flex items-center justify-center">
                    {/* Tick axes */}
                    <div className="absolute w-px h-full bg-slate-800/60 left-1/2"></div>
                    <div className="absolute h-px w-full bg-slate-800/60 top-1/2"></div>
                    
                    {/* The physical knob. Y-axis is bound to throttle slider, X-axis bound to yaw */}
                    <div 
                      className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 border border-slate-400 shadow-md flex items-center justify-center cursor-ns-resize"
                      style={{ 
                        top: `${96 - (interactiveThrottle / 100) * 64 - 16}px`, 
                        left: `${48 + (joystickYaw / 50) * 32 - 16}px` 
                      }}
                    >
                      <circle cx="16" cy="16" r="3" fill="#38bdf8" />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 mt-3 px-2">
                    <span className="text-sky-300 font-bold">THROTTLE: {interactiveThrottle}%</span>
                    <span className="text-sky-300 font-bold">YAW: {joystickYaw > 0 ? `+${joystickYaw}` : joystickYaw}°</span>
                  </div>

                  {/* Left joystick axis buttons */}
                  <div className="flex gap-2 justify-center mt-3 scale-90">
                    <button 
                      onClick={() => setJoystickYaw(Math.max(-45, joystickYaw - 15))}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      ↺ Rotate Left
                    </button>
                    <button 
                      onClick={() => setJoystickYaw(Math.min(45, joystickYaw + 15))}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Rotate Right ↻
                    </button>
                  </div>
                </div>

                {/* Right Controller stick widget */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono">
                  <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wide">Right Stick (Pitch / Roll)</p>
                  
                  {/* Joystick pad graphic */}
                  <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 mx-auto relative flex items-center justify-center">
                    <div className="absolute w-px h-full bg-slate-800/60 left-1/2"></div>
                    <div className="absolute h-px w-full bg-slate-800/60 top-1/2"></div>
                    
                    {/* Centered static pointer */}
                    <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 border border-slate-400 shadow-md flex items-center justify-center">
                      <circle cx="16" cy="16" r="3" fill="#f43f5e" />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 mt-3 px-2">
                    <span>PITCH: STABLE</span>
                    <span>ROLL: CENTER</span>
                  </div>

                  <p className="text-[9px] text-slate-500 italic mt-3 leading-tight select-none">
                    * Combination inputs lean the aircraft hulls in real 3D cartesian coordinates.
                  </p>
                </div>
              </div>

              {/* Live interactive diagnostic logs feedback row */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sky-400">
                  <Zap size={11} />
                  LOG: {interactiveThrottle > 45 ? "ASCENDING (LIFT GENERATED)" : interactiveThrottle > 10 ? "GROUND LEVEL HOVERING" : "IDLE STATS"}
                </span>
                <span>DESCENT ESC: READY</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADA Alt description Card shelf with high-contrast */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-start gap-2.5 text-xs text-slate-500">
        <span className="font-bold uppercase tracking-wider text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 mt-0.5 border border-gray-150">ALT SPECIFICATION</span>
        <p className="leading-relaxed font-medium">{alt_text}</p>
      </div>
    </div>
  );
}

