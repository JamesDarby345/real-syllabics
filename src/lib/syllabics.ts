// Inuktitut syllabics, following the Inuit Cultural Institute (ICI) standard
// used in Nunavut, plus the ai-column that Nunavik restored.
// Dotted forms mark long vowels, romanized with a doubled vowel.

export type Column = "i" | "u" | "a" | "ii" | "uu" | "aa" | "ai" | "final";

export type Syllable = {
  char: string;
  /** Canonical ICI romanization. */
  roman: string;
  /** Other accepted spellings (e.g. "lh" for ł). */
  alt?: string[];
  row: string;
  column: Column;
};

export type Row = {
  id: string;
  label: string;
  cells: Partial<Record<Column, string>>;
};

export const COLUMNS: { id: Column; label: string; group: "short" | "long" | "ai" | "final" }[] = [
  { id: "i", label: "i", group: "short" },
  { id: "u", label: "u", group: "short" },
  { id: "a", label: "a", group: "short" },
  { id: "ii", label: "ii", group: "long" },
  { id: "uu", label: "uu", group: "long" },
  { id: "aa", label: "aa", group: "long" },
  { id: "ai", label: "ai", group: "ai" },
  { id: "final", label: "final", group: "final" },
];

export const ROWS: Row[] = [
  { id: "", label: "vowel", cells: { i: "ᐃ", u: "ᐅ", a: "ᐊ", ii: "ᐄ", uu: "ᐆ", aa: "ᐋ", ai: "ᐁ" } },
  { id: "p", label: "p", cells: { i: "ᐱ", u: "ᐳ", a: "ᐸ", ii: "ᐲ", uu: "ᐴ", aa: "ᐹ", ai: "ᐯ", final: "ᑉ" } },
  { id: "t", label: "t", cells: { i: "ᑎ", u: "ᑐ", a: "ᑕ", ii: "ᑏ", uu: "ᑑ", aa: "ᑖ", ai: "ᑌ", final: "ᑦ" } },
  { id: "k", label: "k", cells: { i: "ᑭ", u: "ᑯ", a: "ᑲ", ii: "ᑮ", uu: "ᑰ", aa: "ᑳ", ai: "ᑫ", final: "ᒃ" } },
  { id: "g", label: "g", cells: { i: "ᒋ", u: "ᒍ", a: "ᒐ", ii: "ᒌ", uu: "ᒎ", aa: "ᒑ", ai: "ᒉ", final: "ᒡ" } },
  { id: "m", label: "m", cells: { i: "ᒥ", u: "ᒧ", a: "ᒪ", ii: "ᒦ", uu: "ᒨ", aa: "ᒫ", ai: "ᒣ", final: "ᒻ" } },
  { id: "n", label: "n", cells: { i: "ᓂ", u: "ᓄ", a: "ᓇ", ii: "ᓃ", uu: "ᓅ", aa: "ᓈ", ai: "ᓀ", final: "ᓐ" } },
  { id: "s", label: "s", cells: { i: "ᓯ", u: "ᓱ", a: "ᓴ", ii: "ᓰ", uu: "ᓲ", aa: "ᓵ", ai: "ᓭ", final: "ᔅ" } },
  { id: "l", label: "l", cells: { i: "ᓕ", u: "ᓗ", a: "ᓚ", ii: "ᓖ", uu: "ᓘ", aa: "ᓛ", ai: "ᓓ", final: "ᓪ" } },
  { id: "j", label: "j", cells: { i: "ᔨ", u: "ᔪ", a: "ᔭ", ii: "ᔩ", uu: "ᔫ", aa: "ᔮ", ai: "ᔦ", final: "ᔾ" } },
  { id: "v", label: "v", cells: { i: "ᕕ", u: "ᕗ", a: "ᕙ", ii: "ᕖ", uu: "ᕘ", aa: "ᕚ", ai: "ᕓ", final: "ᕝ" } },
  { id: "r", label: "r", cells: { i: "ᕆ", u: "ᕈ", a: "ᕋ", ii: "ᕇ", uu: "ᕉ", aa: "ᕌ", ai: "ᕂ", final: "ᕐ" } },
  { id: "q", label: "q", cells: { i: "ᕿ", u: "ᖁ", a: "ᖃ", ii: "ᖀ", uu: "ᖂ", aa: "ᖄ", ai: "ᙯ", final: "ᖅ" } },
  { id: "ng", label: "ng", cells: { i: "ᖏ", u: "ᖑ", a: "ᖓ", ii: "ᖐ", uu: "ᖒ", aa: "ᖔ", ai: "ᙰ", final: "ᖕ" } },
  { id: "nng", label: "nng", cells: { i: "ᙱ", u: "ᙳ", a: "ᙵ", ii: "ᙲ", uu: "ᙴ", aa: "ᙶ", final: "ᖖ" } },
  { id: "ł", label: "ł", cells: { i: "ᖠ", u: "ᖢ", a: "ᖤ", ii: "ᖡ", uu: "ᖣ", aa: "ᖥ", final: "ᖦ" } },
  { id: "h", label: "h", cells: { final: "ᕼ" } },
];

// Alternative spellings for consonants that are hard to type.
const CONSONANT_ALTS: Record<string, string[]> = {
  ł: ["lh", "&"],
  ng: ["ŋ"],
  nng: ["ŋŋ"],
};

function romanize(row: string, column: Column): string {
  return column === "final" ? row : row + column;
}

export const SYLLABLES: Syllable[] = ROWS.flatMap((row) =>
  COLUMNS.flatMap(({ id: column }) => {
    const char = row.cells[column];
    if (!char) return [];
    const roman = romanize(row.id, column);
    const alt = (CONSONANT_ALTS[row.id] ?? []).map((c) => romanize(c, column));
    return [{ char, roman, alt: alt.length ? alt : undefined, row: row.id, column }];
  }),
);

export function answersFor(s: Syllable): string[] {
  return [s.roman, ...(s.alt ?? [])];
}

/** Canonical key for a row/column cell, used for selection state. */
export function cellKey(row: string, column: Column): string {
  return `${row}|${column}`;
}

export function syllableKey(s: Syllable): string {
  return cellKey(s.row, s.column);
}

export const DEFAULT_SELECTION: string[] = SYLLABLES.filter(
  (s) => (s.column === "i" || s.column === "u" || s.column === "a") && s.row !== "nng" && s.row !== "ł",
).map(syllableKey);
