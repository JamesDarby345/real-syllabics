# Real Syllabics

**Live:** https://real-syllabics.vercel.app

A [Real Kana](https://realkana.com)-style trainer for Inuktitut syllabics (ᐃᓄᒃᑎᑐᑦ).

- **Select** which syllabics to drill (by cell, row, column, or preset).
- **Study**: type the romanization — the next character appears the moment the answer is right, no Enter.
  A wrong keystroke reveals the answer, and you type it to continue. Space reveals the answer.
- **Random fonts**: Noto Sans Canadian Aboriginal, Radio Canada, BJ Cree, plus Euphemia UCAS / Gadugi
  when the OS has them, in varying weights.
- **Focus on misses**: characters you miss come up more often. Stats persist in localStorage;
  the **Chart** page shades each character by accuracy.

Character data lives in `src/lib/syllabics.ts` (ICI standard + Nunavik ai-column).

```bash
npm install
npm run dev
```

Deploys to Vercel as a static Next.js app with no configuration.

## License

MIT — see [LICENSE](LICENSE). Contributions welcome, especially corrections to the character data or dialect support.
