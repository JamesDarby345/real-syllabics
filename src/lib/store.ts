"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_SELECTION } from "./syllabics";

export type Settings = {
  /** Show each character in a random syllabics font and weight. */
  randomFonts: boolean;
  /** Show more of the characters you miss. */
  weightMisses: boolean;
  /** Show the romanization underneath while typing (learning mode). */
  showHint: boolean;
};

export type Stats = Record<string, { right: number; wrong: number }>;

type State = {
  selection: string[];
  settings: Settings;
  stats: Stats;
};

const KEY = "real-syllabics:v1";

const DEFAULT_STATE: State = {
  selection: DEFAULT_SELECTION,
  settings: { randomFonts: true, weightMisses: true, showHint: false },
  stats: {},
};

let state: State = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      state = {
        selection: saved.selection ?? DEFAULT_STATE.selection,
        settings: { ...DEFAULT_STATE.settings, ...saved.settings },
        stats: saved.stats ?? {},
      };
    }
  } catch {
    // Storage unavailable or corrupt; fall back to defaults.
  }
}

function setState(update: (s: State) => State) {
  state = update(state);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode errors; state still lives in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return DEFAULT_STATE;
}

export function useStore() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSelection = useCallback(
    (selection: string[]) => setState((prev) => ({ ...prev, selection })),
    [],
  );
  const setSettings = useCallback(
    (patch: Partial<Settings>) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
    [],
  );
  const record = useCallback(
    (key: string, correct: boolean) =>
      setState((prev) => {
        const cur = prev.stats[key] ?? { right: 0, wrong: 0 };
        const next = correct ? { ...cur, right: cur.right + 1 } : { ...cur, wrong: cur.wrong + 1 };
        return { ...prev, stats: { ...prev.stats, [key]: next } };
      }),
    [],
  );
  const resetStats = useCallback(() => setState((prev) => ({ ...prev, stats: {} })), []);

  return { ...s, setSelection, setSettings, record, resetStats };
}

/** True once the client has read localStorage (avoids flashing defaults). */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
