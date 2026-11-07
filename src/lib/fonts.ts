import { BJCree, Noto_Sans_Canadian_Aboriginal, Radio_Canada } from "next/font/google";

// Drilling across several typefaces is the "real" part: you learn the shape, not one font.
// These are the Google Fonts with genuine syllabics coverage. (Google Sans lists a
// "canadian-aboriginal" subset, but it only contains a handful of Latin glyphs.)

export const radioCanada = Radio_Canada({
  subsets: ["latin", "canadian-aboriginal"],
  variable: "--font-radio-canada",
});

const noto = Noto_Sans_Canadian_Aboriginal({
  subsets: ["canadian-aboriginal"],
  variable: "--font-noto",
  preload: false,
});

const bjCree = BJCree({
  subsets: ["canadian-aboriginal"],
  weight: ["400", "700"],
  variable: "--font-bj-cree",
  preload: false,
});

export const fontVariables = [radioCanada, noto, bjCree].map((f) => f.variable).join(" ");

export type DrillFont = {
  name: string;
  family: string;
  weights: number[];
  italic?: boolean;
  /** Characters the font has no glyph for. */
  missing?: string;
};

export const DRILL_FONTS: DrillFont[] = [
  { name: "Noto Sans", family: "var(--font-noto)", weights: [100, 300, 400, 600, 900] },
  { name: "Radio Canada", family: "var(--font-radio-canada)", weights: [300, 400, 700] },
  {
    name: "BJ Cree",
    family: "var(--font-bj-cree)",
    weights: [400, 700],
    // Cree syllabics: no q, ng, nng, ł rows or final h.
    missing: "ᕿᖁᖃᖀᖂᖄᙯᖅᖏᖑᖓᖐᖒᖔᙰᖕᙱᙳᙵᙲᙴᙶᖖᖠᖢᖤᖡᖣᖥᖦᕼ",
  },
];

/** Syllabics fonts bundled with operating systems; used when the viewer has them. */
const LOCAL_FONTS: DrillFont[] = [
  { name: "Euphemia UCAS", family: "'Euphemia UCAS'", weights: [400, 700], italic: true },
  { name: "Gadugi", family: "Gadugi", weights: [400, 700] },
];

export const DEFAULT_DRILL_FONT = DRILL_FONTS[0];

function hasLocalFont(family: string): boolean {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return false;
  const sample = "mmmmmmmmlli10WQ";
  return ["monospace", "serif"].some((fallback) => {
    ctx.font = `72px ${fallback}`;
    const base = ctx.measureText(sample).width;
    ctx.font = `72px ${family}, ${fallback}`;
    return ctx.measureText(sample).width !== base;
  });
}

let available: DrillFont[] | null = null;

/** Web fonts plus whichever system syllabics fonts this browser has. Client-only. */
export function availableDrillFonts(): DrillFont[] {
  available ??= [...DRILL_FONTS, ...LOCAL_FONTS.filter((f) => hasLocalFont(f.family))];
  return available;
}
