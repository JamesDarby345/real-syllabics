"use client";

import Link from "next/link";
import { COLUMNS, ROWS, SYLLABLES, cellKey, syllableKey, type Column } from "@/lib/syllabics";
import { useHydrated, useStore, type Settings } from "@/lib/store";

const PRESETS: { label: string; columns: Column[] }[] = [
  { label: "Basics", columns: ["i", "u", "a"] },
  { label: "+ Long vowels", columns: ["i", "u", "a", "ii", "uu", "aa"] },
  { label: "+ Finals", columns: ["i", "u", "a", "ii", "uu", "aa", "final"] },
  { label: "Everything", columns: ["i", "u", "a", "ii", "uu", "aa", "ai", "final"] },
];

const SETTING_LABELS: { key: keyof Settings; label: string; hint: string }[] = [
  { key: "randomFonts", label: "Random fonts", hint: "Each character in a different typeface and weight" },
  { key: "weightMisses", label: "Focus on misses", hint: "Characters you get wrong come up more often" },
  { key: "showHint", label: "Show answers", hint: "Learning mode: romanization shown under each character" },
];

export default function SelectPage() {
  const { selection, setSelection, settings, setSettings } = useStore();
  const hydrated = useHydrated();
  const selected = new Set(selection);

  const toggle = (keys: string[]) => {
    const allOn = keys.every((k) => selected.has(k));
    const next = new Set(selected);
    keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
    setSelection([...next]);
  };

  const applyPreset = (columns: Column[]) =>
    setSelection(SYLLABLES.filter((s) => columns.includes(s.column)).map(syllableKey));

  const count = SYLLABLES.filter((s) => selected.has(syllableKey(s))).length;

  return (
    <div className={`space-y-8 transition-opacity ${hydrated ? "opacity-100" : "opacity-0"}`}>
      <section className="pt-4 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Learn to read <span className="text-accent">ᐃᓄᒃᑎᑐᑦ</span>
        </h1>
        <p className="text-muted max-w-xl">
          Pick the syllabics you want to practise, then type the romanization of each one. Get it right
          and the next character appears instantly — no Enter key.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.columns)}
              className="px-3 py-1.5 text-sm rounded-full border border-line bg-surface hover:border-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setSelection([])}
            className="px-3 py-1.5 text-sm rounded-full text-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="text-xs text-muted">
                <th className="p-2" />
                {COLUMNS.map((c) => {
                  const keys = SYLLABLES.filter((s) => s.column === c.id).map(syllableKey);
                  const on = keys.every((k) => selected.has(k));
                  return (
                    <th key={c.id} className="p-1 font-normal">
                      <button
                        onClick={() => toggle(keys)}
                        className={`w-full px-1 py-1 rounded-md ${on ? "text-foreground font-semibold" : "hover:text-foreground"}`}
                        title={`Toggle the ${c.label} column`}
                      >
                        {c.label}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const keys = SYLLABLES.filter((s) => s.row === row.id).map(syllableKey);
                const on = keys.every((k) => selected.has(k));
                return (
                  <tr key={row.id} className="border-t border-line">
                    <th className="p-1 text-xs text-muted font-normal">
                      <button
                        onClick={() => toggle(keys)}
                        className={`w-full min-w-12 px-2 py-1 rounded-md text-left ${on ? "text-foreground font-semibold" : "hover:text-foreground"}`}
                        title={`Toggle the ${row.label} row`}
                      >
                        {row.label}
                      </button>
                    </th>
                    {COLUMNS.map((c) => {
                      const char = row.cells[c.id];
                      if (!char) return <td key={c.id} />;
                      const key = cellKey(row.id, c.id);
                      const isOn = selected.has(key);
                      return (
                        <td key={c.id} className="p-0.5">
                          <button
                            onClick={() => toggle([key])}
                            aria-pressed={isOn}
                            className={`size-10 sm:size-11 rounded-lg text-xl sm:text-2xl transition-colors ${
                              isOn
                                ? "bg-accent text-white"
                                : "text-muted/60 hover:bg-background hover:text-foreground"
                            }`}
                          >
                            {char}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Tap a character, a row label, or a column label to toggle it. The <b>ai</b> column is used only
          in Nunavik.
        </p>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        {SETTING_LABELS.map((s) => (
          <label
            key={s.key}
            className="flex gap-3 items-start p-3 rounded-xl border border-line bg-surface cursor-pointer"
          >
            <input
              type="checkbox"
              checked={settings[s.key]}
              onChange={(e) => setSettings({ [s.key]: e.target.checked })}
              className="mt-1 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-sm font-medium">{s.label}</span>
              <span className="block text-xs text-muted">{s.hint}</span>
            </span>
          </label>
        ))}
      </section>

      <div className="sticky bottom-4 flex justify-center">
        <Link
          href="/study"
          aria-disabled={count === 0}
          className={`px-6 py-3 rounded-full font-semibold shadow-lg transition-transform ${
            count === 0
              ? "pointer-events-none bg-line text-muted"
              : "bg-foreground text-background hover:scale-105"
          }`}
        >
          Start studying · {count} characters
        </Link>
      </div>
    </div>
  );
}
