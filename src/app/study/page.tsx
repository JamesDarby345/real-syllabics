"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SYLLABLES, answersFor, syllableKey, type Syllable } from "@/lib/syllabics";
import { DEFAULT_DRILL_FONT, availableDrillFonts, type DrillFont } from "@/lib/fonts";
import { useHydrated, useStore, type Settings, type Stats } from "@/lib/store";

type Card = { syllable: Syllable; font: DrillFont; weight: number; italic: boolean };

const pickOne = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

function pickCard(pool: Syllable[], stats: Stats, settings: Settings, previous?: Syllable): Card {
  const candidates = pool.length > 1 ? pool.filter((s) => s !== previous) : pool;
  const weights = candidates.map((s) => {
    if (!settings.weightMisses) return 1;
    const st = stats[syllableKey(s)];
    if (!st) return 1.5; // unseen characters get a small boost
    return Math.min(6, 1 + (st.wrong * 2) / (1 + st.right));
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  let syllable = candidates[candidates.length - 1];
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      syllable = candidates[i];
      break;
    }
  }
  if (!settings.randomFonts) {
    return { syllable, font: DEFAULT_DRILL_FONT, weight: 400, italic: false };
  }
  const font = pickOne(availableDrillFonts().filter((f) => !f.missing?.includes(syllable.char)));
  return { syllable, font, weight: pickOne(font.weights), italic: !!font.italic && Math.random() < 0.3 };
}

export default function StudyPage() {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return <Study />;
}

function Study() {
  const { selection, settings, stats, record } = useStore();
  const pool = useMemo(() => {
    const selected = new Set(selection);
    return SYLLABLES.filter((s) => selected.has(syllableKey(s)));
  }, [selection]);

  const [card, setCard] = useState<Card | null>(() =>
    pool.length ? pickCard(pool, stats, settings) : null,
  );
  const [input, setInput] = useState("");
  const [missed, setMissed] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [session, setSession] = useState({ right: 0, wrong: 0, streak: 0, best: 0 });
  const [trouble, setTrouble] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  if (!card) {
    return (
      <div className="pt-24 text-center space-y-4">
        <p className="text-muted">No characters selected.</p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-foreground text-background font-semibold">
          Choose characters
        </Link>
      </div>
    );
  }

  const answers = answersFor(card.syllable);

  const onChange = (raw: string) => {
    const value = raw.toLowerCase().replace(/[’']/g, "");
    const giveUp = value.includes(" ");
    const typed = value.trim();

    if (!giveUp && answers.includes(typed)) {
      if (!missed) {
        record(syllableKey(card.syllable), true);
        setSession((s) => {
          const streak = s.streak + 1;
          return { ...s, right: s.right + 1, streak, best: Math.max(s.best, streak) };
        });
      }
      setCard(pickCard(pool, stats, settings, card.syllable));
      setInput("");
      setMissed(false);
      return;
    }

    if (giveUp || !answers.some((a) => a.startsWith(typed))) {
      if (!missed) {
        record(syllableKey(card.syllable), false);
        setSession((s) => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
        setTrouble((t) => ({ ...t, [card.syllable.char]: (t[card.syllable.char] ?? 0) + 1 }));
        setMissed(true);
      }
      setShakeKey((k) => k + 1);
      setInput("");
      return;
    }

    setInput(typed);
  };

  const total = session.right + session.wrong;
  const accuracy = total ? Math.round((session.right / total) * 100) : null;
  const troubleList = Object.entries(trouble)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="pt-4 space-y-6" onClick={() => inputRef.current?.focus()}>
      <div className="flex justify-between text-sm text-muted tabular-nums">
        <span>
          <span className="text-good font-semibold">{session.right}</span> right ·{" "}
          <span className="text-accent font-semibold">{session.wrong}</span> missed
          {accuracy !== null && <> · {accuracy}%</>}
        </span>
        <span>
          streak {session.streak} · best {session.best}
        </span>
      </div>

      <div
        key={shakeKey}
        className={`relative rounded-3xl border bg-surface h-72 sm:h-80 grid place-items-center select-none ${
          missed ? "border-accent shake" : "border-line"
        }`}
      >
        <span
          className="text-[9rem] sm:text-[11rem] leading-none"
          style={{
            fontFamily: card.font.family,
            fontWeight: card.weight,
            fontStyle: card.italic ? "italic" : "normal",
          }}
          lang="iu"
        >
          {card.syllable.char}
        </span>
        {(missed || settings.showHint) && (
          <span
            className={`absolute bottom-5 text-2xl font-semibold ${missed ? "text-accent" : "text-muted"}`}
          >
            {card.syllable.roman}
          </span>
        )}
        {settings.randomFonts && (
          <span className="absolute top-4 right-5 text-[11px] text-muted">
            {card.font.name} · {card.weight}
            {card.italic && " italic"}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        autoFocus
        value={input}
        onChange={(e) => onChange(e.target.value)}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type the romanization"
        placeholder={missed ? `type “${card.syllable.roman}” to continue` : "type the romanization"}
        className={`w-full text-center text-3xl py-4 rounded-2xl border bg-surface outline-none focus:border-foreground placeholder:text-muted/50 placeholder:text-xl ${
          missed ? "border-accent" : "border-line"
        }`}
      />
      <p className="text-center text-xs text-muted">
        Press <kbd className="px-1.5 py-0.5 rounded border border-line">space</kbd> to reveal the answer.
        Long vowels are doubled (ᐲ = pii). ł can be typed as lh, ŋ as ng.
      </p>

      {troubleList.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">Missed this session</h2>
          <div className="flex flex-wrap gap-2">
            {troubleList.map(([char, n]) => {
              const s = SYLLABLES.find((x) => x.char === char)!;
              return (
                <span
                  key={char}
                  className="flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-accent-soft text-sm"
                >
                  <span className="text-lg">{char}</span>
                  <span>{s.roman}</span>
                  <span className="text-xs text-accent font-semibold">×{n}</span>
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
