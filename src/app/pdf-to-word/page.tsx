"use client";

import { useState, useCallback } from "react";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") {
      setFile(f);
      setResult(null);
      setError(null);
    } else {
      setError("Please select a PDF file.");
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    try {
      // TODO: Replace with actual CloudConvert API call via Cloudflare Worker
      // This is a placeholder that simulates the conversion flow
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Conversion failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: file.name.replace(".pdf", ".docx") });
    } catch (err) {
      setError(`Conversion failed: ${err instanceof Error ? err.message : "Unknown error"}. This feature requires server-side processing — coming soon!`);
    } finally {
      setConverting(false);
    }
  }, [file]);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Convert PDF documents to editable Word (.docx) files.
      </p>

      {!result && (
        <div
          onClick={() => document.getElementById("p2w-input")?.click()}
          className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
        >
          <input id="p2w-input" type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
          <div className="py-8">
            <div className="text-3xl mb-2">📝</div>
            <p className="font-medium">{file ? file.name : "Click to select a PDF file"}</p>
            {file && <p className="text-sm text-[var(--text-secondary)] mt-1">{(file.size / 1048576).toFixed(2)} MB</p>}
          </div>
        </div>
      )}

      {file && !result && (
        <div className="mt-6 flex gap-3">
          <button onClick={convert} disabled={converting} className="btn-primary flex-1">
            {converting ? "Converting..." : "Convert to Word"}
          </button>
          <button onClick={() => { setFile(null); setResult(null); }} className="btn-secondary">Reset</button>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {result && (
        <div className="card mt-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <h2 className="text-xl font-semibold mb-4">Conversion Complete!</h2>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="btn-primary">Download .docx</button>
            <button onClick={() => { setFile(null); setResult(null); }} className="btn-secondary">Convert Another</button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Convert PDF to Word</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Upload your PDF file.</li>
            <li>Click &quot;Convert to Word&quot;.</li>
            <li>Download the editable .docx file.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our PDF to Word Converter?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Accurate Conversion</strong> — Preserves formatting and layout.</li>
            <li>✅ <strong>Editable Output</strong> — Get a real .docx you can edit in Word.</li>
            <li>✅ <strong>Secure</strong> — Files are processed and deleted within 30 minutes.</li>
            <li>✅ <strong>Free Tier</strong> — Up to 25 conversions per day free.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Will my formatting be preserved?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Most formatting is preserved. Complex layouts with columns or embedded objects may vary slightly.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Is there a file size limit?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Files up to 50MB are supported. Larger files may take longer to process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}