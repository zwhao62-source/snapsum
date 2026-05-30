"use client";

import { useState, useMemo } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { words: 0, characters: 0, charactersNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: "0 sec" };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = trimmed.split(/\n\s*\n/).filter((s) => s.trim()).length || (trimmed ? 1 : 0);

    const minutes = words / 225; // avg reading speed
    const readingTime = minutes < 1 ? `${Math.ceil(minutes * 60)} sec` : `${Math.ceil(minutes)} min`;

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Word Counter</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Count words, characters, sentences, and estimate reading time.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "No Spaces", value: stats.charactersNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Read Time", value: stats.readingTime },
        ].map((s) => (
          <div key={s.label} className="card text-center py-3 px-2">
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full border border-[var(--border)] rounded-xl p-4 h-64 resize-y text-sm focus:border-[var(--primary)] focus:outline-none"
        />
        {text && (
          <button
            onClick={() => setText("")}
            className="absolute top-3 right-3 text-xs text-[var(--text-secondary)] hover:text-red-500 px-2 py-1 border rounded"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Count Words</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Type or paste your text in the box above.</li>
            <li>See word count, character count, and more in real-time.</li>
            <li>Use the reading time estimate for blog posts and articles.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our Word Counter?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Real-Time Counting</strong> — Stats update as you type.</li>
            <li>✅ <strong>Reading Time</strong> — Estimate how long your text takes to read.</li>
            <li>✅ <strong>No Signup</strong> — Free and instant, no limits.</li>
            <li>✅ <strong>Privacy</strong> — Your text stays in your browser.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}