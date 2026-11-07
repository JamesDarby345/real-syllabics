"use client";

import { COLUMNS, ROWS, cellKey } from "@/lib/syllabics";
import { useHydrated, useStore } from "@/lib/store";

function romanize(row: string, column: string) {
  return column === "final" ? row : row + column;
}

export default function ChartPage() {
  const { stats, resetStats } = useStore();
  const hydrated = useHydrated();
  const hasStats = hydrated && Object.keys(stats).length > 0;

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Syllabics chart</h1>
          <p className="text-sm text-muted">
            {hasStats
              ? "Shaded by your all-time accuracy: green is solid, red needs work."
              : "Study a few characters and this chart will show your accuracy."}
          </p>
        </div>
        {hasStats && (
          <button onClick={resetStats} className="text-sm text-muted hover:text-accent shrink-0">
            Reset stats
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="text-xs text-muted">
              <th className="p-2" />
              {COLUMNS.map((c) => (
                <th key={c.id} className="p-2 font-normal">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <th className="p-2 text-xs text-muted font-normal text-left">{row.label}</th>
                {COLUMNS.map((c) => {
                  const char = row.cells[c.id];
                  if (!char) return <td key={c.id} />;
                  const st = hydrated ? stats[cellKey(row.id, c.id)] : undefined;
                  const seen = st ? st.right + st.wrong : 0;
                  const acc = st && seen ? st.right / seen : null;
                  const bg =
                    acc === null
                      ? undefined
                      : `color-mix(in oklab, var(--good) ${Math.round(acc * 35)}%, color-mix(in oklab, var(--accent) ${Math.round((1 - acc) * 35)}%, transparent))`;
                  return (
                    <td key={c.id} className="p-0.5">
                      <div
                        className="min-w-11 rounded-lg py-1.5"
                        style={{ background: bg }}
                        title={st ? `${st.right} right, ${st.wrong} missed` : undefined}
                      >
                        <div className="text-2xl leading-tight">{char}</div>
                        <div className="text-[11px] text-muted">{romanize(row.id, c.id)}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-muted space-y-1">
        <p>
          A dot on top marks a long vowel (ᐱ pi → ᐲ pii). Finals are the small raised characters that
          close a syllable, e.g. ᐃᓄᒃ = i-nu-k.
        </p>
        <p>
          Doubled consonants are written with the final before the syllable: ᑦᑕ tta, ᒃᑯ kku, ᖅᑭ qqi.
        </p>
      </div>
    </div>
  );
}
