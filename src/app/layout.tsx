import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Syllabics — learn to read Inuktitut",
  description:
    "Practice reading Inuktitut syllabics (ᐃᓄᒃᑎᑐᑦ). Pick the characters, type the romanization, and the next one appears instantly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-16">{children}</main>
        <footer className="text-center text-xs text-muted py-6 px-4">
          Syllabics follow the ICI standard used in Nunavut, with Nunavik&apos;s ai-column.
        </footer>
      </body>
    </html>
  );
}
