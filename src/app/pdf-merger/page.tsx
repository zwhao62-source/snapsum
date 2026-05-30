"use client";

import { useState, useCallback } from "react";

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
    setError(null);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveFile = useCallback((index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files.");
      return;
    }
    setMerging(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      setResult(new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (err) {
      setError(`Merge failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setMerging(false);
    }
  }, [files]);

  const download = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const formatSize = (bytes: number) => {
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">PDF Merger</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Merge multiple PDFs into one. Drag to reorder.
      </p>

      {/* Upload */}
      <div
        onClick={() => document.getElementById("merge-input")?.click()}
        className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
      >
        <input
          id="merge-input"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="py-8">
          <div className="text-3xl mb-2">📑</div>
          <p className="font-medium">Click to add PDF files</p>
          <p className="text-sm text-[var(--text-secondary)]">Select 2 or more PDFs</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="card flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-secondary)] w-6">{i + 1}.</span>
                <span className="font-medium text-sm">{f.name}</span>
                <span className="text-xs text-[var(--text-secondary)]">{formatSize(f.size)}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => moveFile(i, -1)}
                  disabled={i === 0}
                  className="px-2 py-1 text-xs border rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFile(i, 1)}
                  disabled={i === files.length - 1}
                  className="px-2 py-1 text-xs border rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(i)}
                  className="px-2 py-1 text-xs border rounded text-red-500 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && !result && (
        <div className="mt-6 flex gap-3">
          <button onClick={merge} disabled={merging || files.length < 2} className="btn-primary flex-1">
            {merging ? "Merging..." : `Merge ${files.length} PDFs`}
          </button>
          <button onClick={() => { setFiles([]); setResult(null); }} className="btn-secondary">
            Reset
          </button>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Result */}
      {result && (
        <div className="card mt-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <h2 className="text-xl font-semibold mb-2">Merge Complete!</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Merged {files.length} files — {formatSize(result.size)}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="btn-primary">Download Merged PDF</button>
            <button onClick={() => { setFiles([]); setResult(null); }} className="btn-secondary">
              Merge More
            </button>
          </div>
        </div>
      )}

      {/* Ad + SEO */}
      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">
        Advertisement
      </div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Merge PDF Files</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Select the PDF files you want to merge.</li>
            <li>Reorder files by clicking the up/down arrows.</li>
            <li>Click &quot;Merge PDFs&quot; to combine them.</li>
            <li>Download the merged PDF.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Merger?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>No Upload</strong> — All merging happens in your browser.</li>
            <li>✅ <strong>Reorder Easily</strong> — Drag files into the right order.</li>
            <li>✅ <strong>Unlimited Files</strong> — Merge as many PDFs as you need.</li>
            <li>✅ <strong>Free &amp; Private</strong> — No signup, no data collected.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Is there a file size limit?</h3>
              <p className="text-[var(--text-secondary)] text-sm">No hard limit, but very large PDFs (&gt;100MB) may be slow in the browser.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Can I reorder pages within a PDF?</h3>
              <p className="text-[var(--text-secondary)] text-sm">This tool merges entire PDFs. For page-level reordering, stay tuned for our PDF Page Manager.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
