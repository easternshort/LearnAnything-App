import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not configured or uses placeholder.");
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI client:", err);
}

// Simple JSON dynamic database for user profiles & custom pre-generated courses
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TOPICS_FILE = path.join(DATA_DIR, "topics.json");
const VISUAL_CACHE_FILE = path.join(DATA_DIR, "visual_cache.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pre-seeded topics to guarantee immediate lessons even if API key is not configured or slow
const PRESEEDED_TOPICS = [
  {
    topic: "Flying a Drone Safely",
    emoji: "🚁",
    tagline: "Master the skies — and keep everyone on the ground safe while you do it.",
    difficulty: "Beginner",
    estimated_time: "20 minutes",
    age_range: "All ages",
    cover_visual: "A high-altitude shot of a bright red drone hovering stable above green parks and hills under clear skies.",
    modules: [
      {
        module_number: 1,
        title: "Know Your Drone",
        emoji: "🎮",
        key_concept: "Understanding your drone's parts is the first step to flying it safely.",
        lesson: "Before you spin up the props, let's take a look at the machine in front of you. Drones, also known as quadcopters, use four independent propellers spinning in opposite directions to push air downward and lift off the ground. The battery is the heart of your drone, feeding energy to powerful motors, while the internal gyro stabilizer serves as the drone's inner ear, calculating micro-adjustments hundreds of times per second to keep it upright.\n\nNever touch the propellers while the battery is plugged in! Propeller blades are sharper than they look and spin rapidly enough to cause cuts. Modern drones also come equipped with bright LED lights: green usually indicates the rear (so you know which way it's facing) and red or white indicates the front.",
        visual: {
          type: "labeled_image",
          description: "Top-down clean schematic diagram of a stylized quadcopter. Bright teal lines point to: 'Propellers' (angled for lift), 'Core Stabilizer' (the brain), 'Battery Module' (at the back), 'Front LEDs' (glowing red), and 'Camera Mount' (pointing forward).",
          alt_text: "Quadcopter drone anatomy diagram with color-coded label dots."
        },
        interactive: {
          type: "drag_drop",
          prompt: "Match the parts of the drone with their primary job!",
          options: [
            "Propellers | Create the descending wind that lifts the drone upward.",
            "Gyro Stabilizer | Acts as the drone's brain to balance it in mid-air.",
            "Battery Module | Feeds direct electric energy to all four motors.",
            "Front LEDs | Show you which way the drone's 'face' is pointing."
          ],
          correct: "matched",
          hint: "The propellers are responsible for pushing air to hover, while the stabilizer handles balancing logic.",
          explanation: "Getting familiar with your drone's hardware keeps you in absolute control while operating it."
        },
        fun_fact: "Each of the 4 propellers is pitched uniquely! To fly straight, two props spin clockwise and two spin counter-clockwise to cancel out rotation twist.",
        real_world_tip: "Before turning your controller on, physically check that the propeller locking bolts are tight. A loose prop will fly off instantly during takeoff!"
      },
      {
        module_number: 2,
        title: "Pre-Flight Checklist",
        emoji: "📋",
        key_concept: "Every successful launch starts on the ground. A quick test avoids costly crashes.",
        lesson: "Professional drone flyers and airline pilots have one thing in common: they NEVER fly without checking off their list. Taking 2 minutes on the ground prevents 90% of all drone accidents. You will inspect the propellers for small hairline cracks, ensure your phone/screen is securely mounted to the transmitter, and do a quick 360-degree sweep of your current area to make sure there are no trees, power lines, or people near you.\n\nOnce the physical check is done, find a flat, dry surface like a rubber landing pad or short grass, turn on your transmitter first, then connect the drone. Take off and let it hover at exactly 3 to 4 feet. This is called the 'Test Hover' and proves the motors and sensors are working flawlessly before you push higher.",
        visual: {
          type: "step_sequence",
          description: "A horizontal 4-step vector check-strip. 1: Inspecting propellers for chips. 2: Turning on the handheld transmitter device. 3: Surveying trees/obstacles in the yard. 4: A drone hovering rock-stable just 3 feet off a landing circle.",
          alt_text: "Four steps of the preflight checklist sequence."
        },
        interactive: {
          type: "sequence_order",
          prompt: "What is the safest order to power up and launch your drone?",
          options: [
            "Turn on the handheld controller transmitter first.",
            "Plug in and secure the drone's main battery.",
            "Clear a 10-foot launch circle around the drone.",
            "Take off and hover at 3 feet to double-check control response."
          ],
          correct: "Turn on the handheld controller transmitter first. | Plug in and secure the drone's main battery. | Clear a 10-foot launch circle around the drone. | Take off and hover at 3 feet to double-check control response.",
          hint: "Always power on the controller FIRST so the drone is never resting with live power without a signal!",
          explanation: "Powering the remote control first prevents the drone from accidentally taking off or receiving stray signals."
        },
        fun_fact: "Many high-quality drones won't let you start the motors if they detect you are inside a designated restricted airport airspace zone!",
        real_world_tip: "Practice flying over dry, soft turf instead of hard concrete. If you make a mistake and cut the power, a grass fall will rarely break anything."
      },
      {
        module_number: 3,
        title: "Rules of the Sky",
        emoji: "🌐",
        key_concept: "The sky belongs to everyone. Know the laws to keep your flights safe and legal.",
        lesson: "When you take to the air, you are entering official airspace! This means you share the sky with passenger aircraft, helicopters, helicopters on emergency flights, and other flyers. There are several gold rules to follow: (1) Never fly higher than 400 feet above the ground, (2) Keep your drone within your active 'Visual Line of Sight' (meaning you must be able to see it with your own eyes, not just through a screen), and (3) Never, ever fly directly over crowds of people, highways, or sporting events.\n\nIt is incredibly critical to yield to all manned aircraft immediately. If you hear a real helicopter or small plane, immediately bring your drone down to a low altitude or land. This ensures you never interfere with critical flights.",
        visual: {
          type: "comparison",
          description: "A split-screen illustration showing 'SAFE ZONE' vs 'DANGER ZONE'. Left: Drone flying under the treeline away from people, highlighting 400ft ceiling line. Right: Drone flying block-high near a busy crowded highway and an airport tower with red crossmarks.",
          alt_text: "Comparison of safe, legal drone flight zones versus restricted hazardous zones."
        },
        interactive: {
          type: "true_false",
          prompt: "It's safe and legal to fly your drone out of sight as long as the built-in camera is working and showing you a clear live video stream.",
          options: ["True", "False"],
          correct: "False",
          hint: "If you only look at your screen, you won't see a tall branch, utility cable, or bird approaching from the side!",
          explanation: "Legally and safely, you must always maintain a direct eye connection with the actual drone in the sky."
        },
        fun_fact: "Even the smallest consumer drones must follow specific rules monitored by aviation agencies like the FAA in the US and CAA in the UK!",
        real_world_tip: "Download a free interactive application like 'B4UFLY' or 'Aloft'. It uses GPS to warn you instantly if you are too close to restricted airspace!"
      },
      {
        module_number: 4,
        title: "Mastering the Joysticks",
        emoji: "🕹️",
        key_concept: "Four basic joystick movements control every direction your drone can move in 3D space.",
        lesson: "To fly like a pro, you need to understand the two master joysticks on your controller. The left stick handles Throttle (climbing or descending) and Yaw (rotating the nose left or right like a spinning top). The right stick handles Pitch (tilting forward to fly ahead, or backward to go back) and Roll (strafing/sliding side-to-side in the air without turning).\n\nWhen we combine these movements, we can trace beautiful curves in the sky. When starting, use tiny, gentle nudges! Pushing the sticks too hard causes the drone to jump or swing quickly, which is how most beginners lose control. Gentle inputs create buttery smooth flights.",
        visual: {
          type: "diagram",
          description: "A clear vector showing the physical controller joysticks. Left Stick shows up/down arrow for 'Throttle (Height)' and left/right rotating arrows for 'Yaw'. Right Stick shows 4-way arrows for 'Pitch' (Forward/Backward) and 'Roll' (Left/Right slide).",
          alt_text: "Anatomy of drone transmitter joysticks showing control axis."
        },
        interactive: {
          type: "match_pairs",
          prompt: "Match the stick direction to what the drone does in mid-air!",
          options: [
            "Left Stick UP | Climb higher into the sky.",
            "Left Stick ROTATE | Spin the front camera left or right.",
            "Right Stick FORWARD | Lean forward and fly ahead.",
            "Right Stick LEFT/RIGHT | Slide sideways without rotating."
          ],
          correct: "matched",
          hint: "Throttle (Left Stick up/down) dictates altitude, while Roll (Right Stick left/right) slides the crafts sideways.",
          explanation: "Mastering the distinction between rotation (yaw) and sliding (roll) is the hallmark of a skilled pilot."
        },
        fun_fact: "When the drone is facing towards you, the controls feel completely reversed! Pushing right makes it drift to your left. That's why keeping orientation in mind is so important.",
        real_world_tip: "Think of the joysticks as physical springs that you guide gently with your thumbs. Never just let go of them to snap back!"
      }
    ],
    final_challenge: {
      title: "First Flying Sandbox: Complete a Square Hover",
      description: "It is time for your first physical field practice! Take your trainer drone to a wide open park with zero wind and fly a perfect flat square pattern to prove your navigation muscle.",
      steps: [
        "Select an open grass area of at least 30 feet of flat space, free of trees and onlookers.",
        "Execute your pre-flight check and verify that battery levels are above 90%.",
        "Place the drone down with the battery facing you (red/rear LEDs showing you your heading).",
        "Arm the motors and slowly feed throttle to lift off and settle in a hover at 3 feet height.",
        "Gently tilt the right stick forward to glide 6 feet, then release to stabilize.",
        "Roll (slide) to the right 6 feet, then pitch backward 6 feet, and roll left 6 feet back to the start.",
        "Guide the throttle back slowly to settle the landing, and disarm the propellers."
      ],
      success_looks_like: "You managed to fly a neat square pattern while keeping the drone hovering at a stable, uniform height of 3 to 4 feet."
    },
    badge_earned: {
      title: "Certified Solo Sky Pilot",
      emoji: "🛩️",
      unlock_message: "Congratulations! You have mastered safe pre-flight inspections, flight laws, and axis controls. You are officially cleared to pilot safely!"
    },
    next_topics: [
      "Aerial Photography Secrets",
      "Drone Cinematography and Editing",
      "How to Build Your Own Drone"
    ]
  },
  {
    topic: "Kitchen Knife Skills",
    emoji: "🔪",
    tagline: "Cut like a pro, cook twice as fast, and keep your fingers perfectly safe.",
    difficulty: "Intermediate",
    estimated_time: "15 minutes",
    age_range: "10 and up",
    cover_visual: "A kitchen cutting board with thin, perfectly uniform slices of bright carrots, styled with an elegant chef's knife.",
    modules: [
      {
        module_number: 1,
        title: "The Pinch Grip",
        emoji: "✊",
        key_concept: "How you hold the knife dictates your safety, control, and precision.",
        lesson: "Many beginners hold a chef's knife like a hammer, wrapping all their fingers around the handle or worse, keeping one index finger resting flat on the metal spine. This makes the knife unstable, prone to slipping, and tires your hand out within minutes! \n\nInstead, professional chefs use the 'Pinch Grip'. You pinch the metal blade itself right where it meets the handle using your thumb and index finger, then wrap your other three fingers comfortably around the wooden handle. This locks the blade in line with your forearm for ultimate stability.",
        visual: {
          type: "labeled_image",
          description: "Close-up of a hand executing the Pinch Grip on a steel chef's knife. Green circle highlights index finger and thumb pinching the bolster metal. Three fingers wrap around the dark pakkawood handle.",
          alt_text: "Clear diagram of the professional pinch grip technique."
        },
        interactive: {
          type: "quiz",
          prompt: "What is the key benefit of pinching the knife blade itself instead of holding only the handle?",
          options: [
            "It makes the knife look cooler to watch.",
            "It gives you maximum control, stops the blade from wobbling, and is safer.",
            "It keeps the knife sharper for a longer period of time.",
            "It lets you cut hard frozen items easily."
          ],
          correct: "It gives you maximum control, stops the blade from wobbling, and is safer.",
          hint: "Pinching bridges your forearm muscles directly to the blade's steel core.",
          explanation: "The pinch grip transforms the knife into an extension of your arm, preventing it from twisting mid-cut."
        },
        fun_fact: "The heavy metal joint between a knife handle and the blade is called the 'bolster'. It balances the weight so you barely have to press down!",
        real_world_tip: "Pick up a table butter knife right now. Try pinching the base of the blade with your thumb and index finger. Notice how much more stable it feels!"
      },
      {
        module_number: 2,
        title: "The Claw Guard",
        emoji: "🐻",
        key_concept: "Protect your helper hand by curling your fingertips into a bear claw.",
        lesson: "Now that your cutting hand is holding the knife, what is your helper hand doing? It should be holding the food, but never keep your fingers lying flat on the cutting board! Doing so places them in the direct path of the razor-sharp edge.\n\nTo keep your hand 100% safe, use the 'Bear Claw'. Curl your fingers inward like you are a tiger roaring. Press down on the food with your fingernails pointed down, and let your middle knuckle rest slightly in front. The flat metal side of the knife blade will rest against your curled knuckles, making it physically impossible to cut your fingertips!",
        visual: {
          type: "labeled_image",
          description: "A close-up illustration of the claw guard technique on a red bell pepper. The helper hand fingers are fully curled inward, with knuckles acting as a guide barrier for the side of the knife blade.",
          alt_text: "Demonstration of the helper hand bear claw guard technique."
        },
        interactive: {
          type: "true_false",
          prompt: "When cutting, your helper hand's fingernails and fingertips should be pointing straight down at the cutting board, fully tucked away.",
          options: ["True", "False"],
          correct: "True",
          hint: "The knuckles act as a vertical guide wall for the blade, shielding the tips of your fingers.",
          explanation: "Curling your fingers ensures your knuckles guide the steel, keeping fingers completely out of harms way."
        },
        fun_fact: "The bear claw doesn't just keep you safe; it allows you to cut files of food much faster because you can safely slide your hand backward as you go without looking!",
        real_world_tip: "Practice the claw right now with an apple or tennis ball. Grip it with your fingertips curled underneath so you can only see your knuckles."
      }
    ],
    final_challenge: {
      title: "The Uniform Dice Quest",
      description: "Put your pinch grip and bear claw guard to the test by dicing a medium onion or potato into beautiful, tiny, uniform 1/4-inch squares.",
      steps: [
        "Secure your cutting board by putting a damp paper towel underneath it so it cannot slide.",
        "Cut your onion vertically straight in half from root to stem.",
        "Lay the flat cut side down on the wood board to make it secure.",
        "Use the pinch grip on the knife, and the claw guard with your helper hand.",
        "Make several horizontal cuts into the onion, stopping just before the root.",
        "Make vertical slices down, then cut across to produce beautiful, even dice."
      ],
      success_looks_like: "You have a heap of chopped onion of uniform sizes, and your hands remained completely safe and sound."
    },
    badge_earned: {
      title: "Master of the Board",
      emoji: "🔪",
      unlock_message: "Incredible knife handling! You have conquered the pinch, claw, and prep organization. You are ready to tackle complex kitchen prep!"
    },
    next_topics: [
      "The Five Mother Sauces",
      "Making Fresh Noodles",
      "Gourmet Plating Design"
    ]
  },
  {
    topic: "Secrets of Garden Soil",
    emoji: "🌱",
    tagline: "Uncover the tiny underground critters that feed our plants and grow giant veggies.",
    difficulty: "Beginner",
    estimated_time: "15 minutes",
    age_range: "All ages",
    cover_visual: "A rich, dark slice of soil showing tiny earthworms crawling between bright green plant roots and pockets of compost.",
    modules: [
      {
        module_number: 1,
        title: "Soil is Alive!",
        emoji: "🪱",
        key_concept: "Real soil is not just dirt — it is a vibrant city filled with billions of microscopical helpers.",
        lesson: "Many people think plants just eat dirt and water, but there is a whole party going on underground! A single handful of healthy garden soil contains more microscopic creatures than there are people on the entire Earth. This busy community is called the 'Soil Web'. \n\nFrom wiggly earthworms that dig tiny oxygen tunnels, to invisible fungi that act like an organic internet to share nutrients between plant roots, these helpers eat fallen leaves and convert them into rich, delicious superfood that plants need to grow grand and tasty tomatoes.",
        visual: {
          type: "diagram",
          description: "Crosssection of garden earth. Top shows small sprouts. The underground is filled with cute stylized earthworms, white mycelium thread networks, and golden nutrient bubbles.",
          alt_text: "Rich living soil ecosystem, labeling earthworms, roots, and fungi mycelium."
        },
        interactive: {
          type: "quiz",
          prompt: "What is the primary role of earthworms in your garden's soil?",
          options: [
            "They eat the roots of garden weeds.",
            "They dig tiny tunnels that let air and water reach hungry plant roots, and deposit rich fertilizer.",
            "They help keep warm temperatures in the soil.",
            "They attack beetles and flying garden pests."
          ],
          correct: "They dig tiny tunnels that let air and water reach hungry plant roots, and deposit rich fertilizer.",
          hint: "Think about what happens when water pours on soil that has zero tunnels. It clumps up tight like brick!",
          explanation: "Worms act as nature's tiny plows, aerating the deep earth and fertilizing it as they dig."
        },
        fun_fact: "Casts — another word for worm droppings — contain 5 times more nitrogen and 11 times more potassium than ordinary dirt!",
        real_world_tip: "Go outside and dig a small cup of earth near woodchips. Count how many earthworms you find. More than 3 means your soil is exceptionally healthy!"
      },
      {
        module_number: 2,
        title: "The Three Dirt Sizes",
        emoji: "📐",
        key_concept: "All soil is made of clay, silt, and sand. Balancing them is the secret to perfect planting.",
        lesson: "If we wash away all the bugs, what remains? Tiny rocks of three distinct sizes: Sand (large granules like beach pebbles under a lens), Silt (medium grains, feeling like velvety flour when wet), and Clay (tinier than bacteria, which stick together like glue when wet).\n\nIf your soil has too much sand, water drains away before your sunflower can drink. If it has too much clay, water stands in puddles and drowns the roots. Gardeners look for 'Loam' — a perfect blend of all three rock sizes that holds water just long enough but lets excess slip away.",
        visual: {
          type: "comparison",
          description: "Three test jars of soil drainage. Jar 1 (mostly sand): water rushes straight through. Jar 2 (mostly clay): water forms an airtight pool at the top. Jar 3 (perfect loam): water trickles down gently, moistening the dark rich earth perfectly.",
          alt_text: "Comparison of sand, clay, and balanced loam soil water drainage."
        },
        interactive: {
          type: "match_pairs",
          prompt: "Match the dirt ingredient to its unique texture and behavior!",
          options: [
            "Sand Grains | Huge granules that feel gritty and drain water extremely fast.",
            "Clay Grains | Utterly tiny particles that clump together like clay putty.",
            "Balanced Loam | The ideal sponge-like gardener mix that plants crave."
          ],
          correct: "matched",
          hint: "Think of beach sand versus heavy pottery clay to match the grains.",
          explanation: "Perfect garden loam has pores of all sizes to hold both moisture and necessary oxygen."
        },
        fun_fact: "Many desert plants love sand because their roots hate dampness, while rice grows beautifully in thick mud clay that holds standing water!",
        real_world_tip: "Take a handful of damp yard dirt and squeeze it into a ball in your fist. If it crumbles instantly, it is sandy. If it forms a sticky hard mud ball, it is clay! If it holds its shape but crumbles when poked, it is perfect loam."
      }
    ],
    final_challenge: {
      title: "DIY Soil Squeeze Test!",
      description: "Perform ancient drainage science in your own kitchen! Collect deep dirt from your backyard or park, mix it in a clear jar with water, and watch the sand, silt, and clay separate into beautiful layers overnight.",
      steps: [
        "Find a tall, clean clear jar (like a peanut butter or pasta sauce jar).",
        "Fill the jar halfway with soil dug from 6 inches beneath the surface.",
        "Add clean water almost to the top and a drop of liquid dish soap.",
        "Cap the jar tightly and shake it back and forth vigorously for 1 entire minute.",
        "Place the jar on a flat counter and observe layers form: sand falls first in 1 minute, silt in 2 hours, clay over 24 hours.",
        "Measure the thickness of each layer to learn your secret blend!"
      ],
      success_looks_like: "You see distinct, color-graded bands of soil grain sizes settling in your jar, telling you exactly what your garden needs."
    },
    badge_earned: {
      title: "Soil Alchemist Badge",
      emoji: "🌱",
      unlock_message: "Awesome! You have cracked the code of worm engineering, grain sizes, and moisture balancing. Your backyard plants are in great hands!"
    },
    next_topics: [
      "Composting Like a Pro",
      "Bees and Pollinator Gardens",
      "Ecosystem Companion Planting"
    ]
  }
];

// In-Memory Fallback DB
let usersDb: Record<string, any> = {};
let topicsDb: Record<string, any> = {};
let visualCacheDb: Record<string, string> = {};

// Load existing files if they exist
try {
  if (fs.existsSync(USERS_FILE)) {
    usersDb = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  }
  if (fs.existsSync(TOPICS_FILE)) {
    topicsDb = JSON.parse(fs.readFileSync(TOPICS_FILE, "utf-8"));
  } else {
    // Write preseeded topics to the file immediately
    const initialTopics: Record<string, any> = {};
    PRESEEDED_TOPICS.forEach((t) => {
      const slug = t.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      initialTopics[slug] = t;
    });
    topicsDb = initialTopics;
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topicsDb, null, 2));
  }
  if (fs.existsSync(VISUAL_CACHE_FILE)) {
    visualCacheDb = JSON.parse(fs.readFileSync(VISUAL_CACHE_FILE, "utf-8"));
  }
} catch (err) {
  console.error("Error loading JSON database files, falling back to empty stores:", err);
}

// Save databases helper function
const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersDb, null, 2));
  } catch (err) {
    console.error("Failed to save users database:", err);
  }
};

const saveTopics = () => {
  try {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topicsDb, null, 2));
  } catch (err) {
    console.error("Failed to save topics database:", err);
  }
};

const saveVisualCache = () => {
  try {
    fs.writeFileSync(VISUAL_CACHE_FILE, JSON.stringify(visualCacheDb, null, 2));
  } catch (err) {
    console.error("Failed to save visual cache database:", err);
  }
};

/**
 * Clean/normalize a topic string to act as an slug key
 */
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ==========================================
// API ROUTES
// ==========================================

// Get list of all topics (both preseeded/stored and newly generated)
app.get("/api/topics", (req, res) => {
  const list = Object.keys(topicsDb).map((slug) => {
    const t = topicsDb[slug];
    return {
      slug,
      topic: t.topic,
      emoji: t.emoji,
      tagline: t.tagline,
      difficulty: t.difficulty,
      estimated_time: t.estimated_time,
      age_range: t.age_range || "All ages",
      cover_visual: t.cover_visual,
      moduleCount: t.modules ? t.modules.length : 0,
    };
  });
  res.json({ topics: list });
});

// Get a single topic by slug
app.get("/api/topics/:slug", (req, res) => {
  const topic = topicsDb[req.params.slug];
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.json({ slug: req.params.slug, ...topic });
});

// User profile retrieval & custom creation (Login equivalent)
app.post("/api/users/login", (req, res) => {
  const { username } = req.body;
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: "Username is required." });
  }

  const cleanUser = username.trim().toLowerCase();
  
  // Create profile if it does not exist
  if (!usersDb[cleanUser]) {
    usersDb[cleanUser] = {
      username: username.trim(),
      streak: 1,
      lastActive: new Date().toISOString(),
      completedTopicsCount: 0,
      badges: [],
      progress: {},
    };
    saveUsers();
  } else {
    // Check & update streak based on last active
    const user = usersDb[cleanUser];
    const now = new Date();
    if (user.lastActive) {
      const lastActiveDate = new Date(user.lastActive);
      const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays > 1 && diffDays < 2) {
        user.streak += 1;
      } else if (diffDays >= 2) {
        user.streak = 1; // broken streak
      }
    } else {
      user.streak = 1;
    }
    user.lastActive = now.toISOString();
    saveUsers();
  }

  res.json({ user: usersDb[cleanUser] });
});

// Update progress for a topic
app.post("/api/users/progress", (req, res) => {
  const { username, topicSlug, moduleNumber, answersCorrect, notes, completedAll } = req.body;
  if (!username || !topicSlug) {
    return res.status(400).json({ error: "username and topicSlug are required fields." });
  }

  const cleanUser = username.trim().toLowerCase();
  const user = usersDb[cleanUser];
  if (!user) {
    return res.status(404).json({ error: "User profile not found." });
  }

  const topic = topicsDb[topicSlug];
  if (!topic) {
    return res.status(404).json({ error: "Topic not found internally." });
  }

  if (!user.progress) {
    user.progress = {};
  }

  if (!user.progress[topicSlug]) {
    user.progress[topicSlug] = {
      topicId: topicSlug,
      topicTitle: topic.topic,
      emoji: topic.emoji,
      completedModules: [],
      completedAll: false,
      score: 0,
    };
  }

  const prog = user.progress[topicSlug];

  // If a module was completed, add to completedModules cleanly
  if (moduleNumber !== undefined && moduleNumber !== null) {
    if (!prog.completedModules.includes(moduleNumber)) {
      prog.completedModules.push(moduleNumber);
      if (answersCorrect) {
        prog.score += 10;
      }
    }
  }

  // Handle final challenge completion
  if (completedAll) {
    prog.completedAll = true;
    prog.completedAt = new Date().toISOString();
    if (notes) {
      prog.challengeNotes = notes;
    }

    // Grant badge if not already granted
    const badge = topic.badge_earned;
    const hasBadgeAlready = user.badges.some((b: any) => b.title === badge.title);
    if (badge && !hasBadgeAlready) {
      user.badges.push(badge);
      prog.unlockedBadge = badge;
    }
    
    // Recalculate completed count
    user.completedTopicsCount = Object.values(user.progress).filter((p: any) => p.completedAll).length;
  }

  user.lastActive = new Date().toISOString();
  saveUsers();
  res.json({ user });
});

// Create an animated visual SVG dynamically for custom generated content!
app.post("/api/generate-visual", async (req, res) => {
  const { topicTitle, title, moduleNumber, description } = req.body;

  if (!topicTitle || !title || !description) {
    return res.status(400).json({ error: "Missing required parameters: topicTitle, title, description" });
  }

  const cacheKey = slugify(`${topicTitle}-${title}`);

  // Checks and returns cached visual if available
  if (visualCacheDb[cacheKey]) {
    return res.json({ svg: visualCacheDb[cacheKey], cached: true });
  }

  if (!ai) {
    // Elegant dynamic animated fallback placeholder
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" rx="12" fill="#020617" />
      <g stroke="#1e293b" stroke-width="1">
        <line x1="0" y1="50" x2="400" y2="50" />
        <line x1="0" y1="100" x2="400" y2="100" />
        <line x1="0" y1="150" x2="400" y2="150" />
        <line x1="0" y1="200" x2="400" y2="200" />
        <line x1="0" y1="250" x2="400" y2="250" />
        <line x1="50" y1="0" x2="50" y2="300" />
        <line x1="100" y1="0" x2="100" y2="300" />
        <line x1="150" y1="0" x2="150" y2="300" />
        <line x1="200" y1="0" x2="200" y2="300" />
        <line x1="250" y1="0" x2="250" y2="300" />
        <line x1="300" y1="0" x2="300" y2="300" />
        <line x1="350" y1="0" x2="350" y2="300" />
      </g>
      <circle cx="200" cy="130" r="35" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4">
        <animateTransform attributeName="transform" type="rotate" from="0 200 130" to="360 200 130" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="130" r="15" fill="#06b6d4" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="200" y="210" font-family="monospace" font-size="12" font-weight="black" fill="#06b6d4" text-anchor="middle" letter-spacing="1">
        ${title.substring(0, 30).toUpperCase()}
      </text>
      <text x="200" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">
        ${topicTitle}
      </text>
    </svg>`;
    return res.json({ svg: fallbackSvg, cached: false, notice: "AI offline, generated high-craft vector sketch fallback code." });
  }

  try {
    console.log(`Generating visual for module: "${title}" inside topic: "${topicTitle}"...`);

    const systemInstruction = `You are an expert design technologist and SVG developer specializing in educational visuals.
Your job is to generate a fully custom, animated, and visually stunning interactive vector diagram as raw standard-compliant SVG.
Do NOT wrap your output in markdown code fences matching \`\`\`xml or \`\`\`svg. Return ONLY the raw SVG code.

SVG Specifications:
1. Must use exactly viewBox="0 0 400 300" and be standard compliant.
2. Must have a clean, dark-mode background compatible with a luxury space slate or deep carbon workspace (use <rect width="400" height="300" rx="12" fill="#020617" />).
3. Specify a nested <style> block containing multiple keyframe CSS animations. Use these animations to pulse glowing indicators, spin gears/rotors, stream bright light dashes along wire pathways, or slide sliders dynamically.
4. Render beautiful, intricate, color-balanced lines, circles, ellipses, paths, and text labels with perfect centering and generous negative space.
5. Create premium high-tech glowing accents using SVG <defs> like linear/radial gradients, <filter id="glow"> with <feGaussianBlur>, or dasharray paths.
6. The graphic must depict the user's specific module title and concept with technical or biological realism. Avoid generic drawings. Represent each concept literally.
7. Must be self-contained, valid standard SVG (no HTML wrappers) that renders perfectly as inner HTML.`;

    const prompt = `Generate a standard-compliant animated SVG block for this concept:
Topic: "${topicTitle}"
Module Title: "${title}"
Module Number: ${moduleNumber}
Visual Directive description: "${description}"

Ensure the response consists 100% of raw valid SVG tags, starting with <svg> and ending with </svg>. Do not include any explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.15,
      },
    });

    let svgCode = response.text || "";
    if (svgCode.includes("```")) {
      const match = svgCode.match(/```(?:xml|svg|html)?([\s\S]*?)```/);
      if (match) {
        svgCode = match[1].trim();
      }
    }
    svgCode = svgCode.trim();

    const startIdx = svgCode.indexOf("<svg");
    const endIdx = svgCode.lastIndexOf("</svg>");
    if (startIdx !== -1 && endIdx !== -1) {
      svgCode = svgCode.substring(startIdx, endIdx + 6);
    }

    if (!svgCode.startsWith("<svg") || !svgCode.endsWith("</svg>")) {
      throw new Error("Invalid SVG wrapper returned from AI model.");
    }

    // Store in our database cache
    visualCacheDb[cacheKey] = svgCode;
    saveVisualCache();

    res.json({ svg: svgCode, cached: false });
  } catch (err: any) {
    console.error("Failed to generate dynamic SVG via Gemini:", err);
    // Dynamic animated fallback placeholder on actual error
    const errorFallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" rx="12" fill="#020617" />
      <circle cx="200" cy="120" r="30" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,3" />
      <text x="200" y="124" font-family="sans-serif" font-size="16" fill="#f43f5e" text-anchor="middle">⚠️</text>
      <text x="200" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc" text-anchor="middle">${title}</text>
      <text x="200" y="200" font-family="sans-serif" font-size="10" fill="#f43f5e" text-anchor="middle">Dynamic Visualizer Standby</text>
      <text x="200" y="225" font-family="monospace" font-size="8" fill="#475569" text-anchor="middle">${err.message || "Parse Exception"}</text>
    </svg>`;
    res.json({ svg: errorFallbackSvg, cached: false, error: err.message });
  }
});

// Call Gemini AI on any random custom user-provided topic!
app.post("/api/generate-topic", async (req, res) => {
  const { topic } = req.body;
  
  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: "Please provide a valid topic with at least 3 letters." });
  }

  const slug = slugify(topic);

  // Return cached version if we have already generated or seeded it!
  if (topicsDb[slug]) {
    console.log(`Returning cached topic for: "${topic}" -> slug: ${slug}`);
    return res.json({ slug, ...topicsDb[slug] });
  }

  if (!ai) {
    return res.status(503).json({
      error: "LearnAnything AI generator is offline (missing GEMINI_API_KEY). Please try any of the preseeded interactive topics below!",
    });
  }

  console.log(`Calling Gemini to generate learning modules for topic: "${topic}"...`);

  const SYSTEM_PROMPT = `You are LearnBot — an advanced, adaptive, high-fidelity learning architect. Your mission is to provide deep, unfiltered, and highly detailed visual courses on absolutely ANY topic the user looks up, exactly as requested, without sugar-coating or arbitrary restriction.

YOUR HEURISTIC ADAPTIVE LEARNING STRATEGY:
1. ESTIMATE TARGET AUDIENCE:
   - Carefully analyze the nature of the searched topic and estimate the age/developmental stage of the learner interested in it.
   - For simple, introductory topics (e.g. learning the Alphabet, basic shape drawing, counting, secondary color mixing), estimate a young or introductory learner (e.g. Age 4-7) and use incredibly descriptive, direct, beautifully organized scaffolding to build concrete associations.
   - For advanced, mature, physiological, technical, historical, or anatomical topics (e.g. Quantum Physics, Gas Turbine Mechanics, Human Reproductive Anatomy, Sexual History, Erotic Art Theories, or Medical/Sociological systems), estimate an adult learner (Age 18+ or medical/academic level). For these topics, write with strict professional terminology, biological/historical precision, thorough engineering or functional explanations, and absolute adult depth. Do NOT water down, skip, or censor key details.

2. BUILD CUSTOM HIGH-FIDELITY SCHEMATICS:
   - For each and every concept module, you MUST design a custom high-fidelity blueprint visual.
   - The "blueprint_elements" array must contain exactly 6 to 10 high-fidelity relative shape objects (circle, rect, line, text, path, ellipse) using 0-100 percentage coordinates. These shapes must be custom-tailored to represent the actual system, structural parts, molecular bonds, physical layouts, or relevant mechanical/anatomical models under study.
   - Every single visual MUST ALSO have exactly 3 custom "hotspots" with clear, precise x, y coordinate markers pointing to specific components depicted in your custom blueprint. Provide rich, 2-sentence mechanical descriptions for each hotspot.

Produce perfectly valid, complete JSON representing the requested course matching the target topic.`;

  try {
    const prompt = `Formulate a complete interactive sandbox learning course on "${topic}". First estimate the target audience/age level and adapt all 4 sequential modules to fit that target level perfectly. Provide a custom diagram layout with exactly 3 educational hotspot markers AND a bespoke list of 6 to 10 custom-generated vector blueprint shapes showing the mechanics under study.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            emoji: { type: Type.STRING, description: "One representative emoji" },
            tagline: { type: Type.STRING, description: "Exciting 1-sentence hook why this topic is amazing" },
            difficulty: { type: Type.STRING, description: "Must be one of: Beginner | Intermediate | Advanced" },
            estimated_time: { type: Type.STRING, description: "e.g. '15 minutes'" },
            age_range: { type: Type.STRING, description: "Estimated age and learning adjustment strategy" },
            cover_visual: { type: Type.STRING, description: "Vivid, rich sketch description of the cover card" },
            modules: {
              type: Type.ARRAY,
              description: "Must contain exactly 4 sequential modules",
              items: {
                type: Type.OBJECT,
                properties: {
                  module_number: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  emoji: { type: Type.STRING },
                  key_concept: { type: Type.STRING, description: "Single most important concept, in one brief sentence" },
                  lesson: { type: Type.STRING, description: "2 to 3 short paragraphs. Deeply educational, custom adjusted based on target audience complexity." },
                  visual: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "Must be: illustration | diagram | step_sequence | comparison | labeled_image" },
                      description: { type: Type.STRING, description: "Describe a colorful sketch to render. Specify colors, mechanical parts, and layout." },
                      alt_text: { type: Type.STRING },
                      hotspots: {
                        type: Type.ARRAY,
                        description: "Exactly 3 distinct educational hotspot points of interest with coordinates to overlay on the diagram.",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            label: { type: Type.STRING, description: "Title of the hotspot (e.g. 'Outer Rotor', 'Core Lens', 'Capillary')" },
                            x: { type: Type.STRING, description: "Percentage string, e.g. '35%'" },
                            y: { type: Type.STRING, description: "Percentage string, e.g. '40%'" },
                            text: { type: Type.STRING, description: "Deeply detailed description of this specific part and why it's vital. 2 sentences." }
                          },
                          required: ["id", "label", "x", "y", "text"]
                        }
                      },
                      blueprint_elements: {
                        type: Type.ARRAY,
                        description: "Exactly 6 to 10 primitive shapes that together form a beautiful, custom blueprint diagram of this specific concept (0-100 relative scales). Do not use placeholders.",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            type: { type: Type.STRING, description: "Must be: circle | rect | line | text | path | ellipse" },
                            x1: { type: Type.INTEGER },
                            y1: { type: Type.INTEGER },
                            x2: { type: Type.INTEGER },
                            y2: { type: Type.INTEGER },
                            cx: { type: Type.INTEGER },
                            cy: { type: Type.INTEGER },
                            r: { type: Type.INTEGER },
                            rx: { type: Type.INTEGER },
                            ry: { type: Type.INTEGER },
                            x: { type: Type.INTEGER },
                            y: { type: Type.INTEGER },
                            w: { type: Type.INTEGER },
                            h: { type: Type.INTEGER },
                            d: { type: Type.STRING },
                            label: { type: Type.STRING },
                            color: { type: Type.STRING, description: "cyan | indigo | amber | rose | emerald | violet | slate" },
                            strokeWidth: { type: Type.INTEGER },
                            filled: { type: Type.BOOLEAN }
                          },
                          required: ["type"]
                        }
                      }
                    },
                    required: ["type", "description", "alt_text", "hotspots", "blueprint_elements"]
                  },
                  interactive: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "Must be one of: quiz | drag_drop | true_false | sequence_order | fill_in_blank | match_pairs | checklist | slider" },
                      prompt: { type: Type.STRING, description: "The instructions or text question" },
                      options: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Flat list of choices or items. If match_pairs, format each as 'Left Side | Right Side'."
                      },
                      correct: { type: Type.STRING, description: "If true_false, 'True' or 'False'. If quiz, the exact matching choice. If drag_drop/sequence, the pipe-separated correct sequence: 'Step A | Step B | Step C'" },
                      hint: { type: Type.STRING, description: "Gentle clue to steer the student" },
                      explanation: { type: Type.STRING, description: "Brief clear explanation why it's correct" }
                    },
                    required: ["type", "prompt", "correct", "hint", "explanation"]
                  },
                  fun_fact: { type: Type.STRING },
                  real_world_tip: { type: Type.STRING }
                },
                required: ["module_number", "title", "emoji", "key_concept", "lesson", "visual", "interactive", "fun_fact", "real_world_tip"]
              }
            },
            final_challenge: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                success_looks_like: { type: Type.STRING }
              },
              required: ["title", "description", "steps", "success_looks_like"]
            },
            badge_earned: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                emoji: { type: Type.STRING },
                unlock_message: { type: Type.STRING }
              },
              required: ["title", "emoji", "unlock_message"]
            },
            next_topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of exactly 3 interesting connected learning topic suggestions"
            }
          },
          required: ["topic", "emoji", "tagline", "difficulty", "estimated_time", "age_range", "cover_visual", "modules", "final_challenge", "badge_earned", "next_topics"]
        }
      }
    });

    const cleanResult = response.text?.trim();
    if (!cleanResult) {
      throw new Error("Received empty text output from Gemini model.");
    }

    const topicData = JSON.parse(cleanResult);
    
    // Store in our database so it's instantly cached
    topicsDb[slug] = topicData;
    saveTopics();

    res.json({ slug, ...topicData });
  } catch (err: any) {
    console.error("Gemini course generation error:", err);
    res.status(500).json({
      error: `Failed to generate learning path. Reason: ${err.message || "Unknown error"}. Feel free to try again or explore our preseeded topics immediately!`,
    });
  }
});

// Vite Setup on Express in Development or Production (Static Assets)
async function boot() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server booted and listening on: http://localhost:${PORT}`);
  });
}

boot();
