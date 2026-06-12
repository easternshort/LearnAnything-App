/**
 * Keeps category-specific visual themes
 */

export interface ColorTheme {
  primary: string; // Tailwind class background
  text: string;    // Tailwind class text
  border: string;  // Tailwind class border
  accentBg: string;// Light shade background
  accentText: string;
  badgeColor: string;
}

export function getTopicTheme(topicName: string, categoryFlag?: string): ColorTheme {
  const name = (topicName || "").toLowerCase();
  
  if (
    name.includes("drone") ||
    name.includes("fly") ||
    name.includes("pilot") ||
    name.includes("tech") ||
    name.includes("code") ||
    name.includes("internet") ||
    name.includes("html") ||
    name.includes("python") ||
    name.includes("website") ||
    categoryFlag === "tech"
  ) {
    return {
      primary: "bg-cyan-600 hover:bg-cyan-700",
      text: "text-cyan-700",
      border: "border-cyan-200",
      accentBg: "bg-cyan-50",
      accentText: "text-cyan-800",
      badgeColor: "bg-cyan-500",
    };
  }

  if (
    name.includes("knife") ||
    name.includes("cook") ||
    name.includes("kitchen") ||
    name.includes("pasta") ||
    name.includes("noodle") ||
    name.includes("sauce") ||
    name.includes("flavor") ||
    name.includes("plate") ||
    categoryFlag === "food"
  ) {
    return {
      primary: "bg-orange-500 hover:bg-orange-600",
      text: "text-orange-600",
      border: "border-orange-200",
      accentBg: "bg-orange-50",
      accentText: "text-orange-800",
      badgeColor: "bg-orange-500",
    };
  }

  if (
    name.includes("soil") ||
    name.includes("garden") ||
    name.includes("plant") ||
    name.includes("bee") ||
    name.includes("tree") ||
    name.includes("nature") ||
    name.includes("compost") ||
    name.includes("outdoor") ||
    name.includes("wildlife") ||
    name.includes("trail") ||
    categoryFlag === "nature"
  ) {
    return {
      primary: "bg-emerald-600 hover:bg-emerald-700",
      text: "text-emerald-700",
      border: "border-emerald-200",
      accentBg: "bg-emerald-50",
      accentText: "text-emerald-800",
      badgeColor: "bg-emerald-500",
    };
  }

  // Default fits Arts / Science / Playful colors
  return {
    primary: "bg-purple-600 hover:bg-purple-700",
    text: "text-purple-700",
    border: "border-purple-200",
    accentBg: "bg-purple-50",
    accentText: "text-purple-800",
    badgeColor: "bg-purple-500",
  };
}
