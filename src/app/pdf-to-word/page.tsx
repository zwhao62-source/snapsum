"use client";

import { useState, useCallback } from "react";

const API_URL = "https://snapsum-api.zwhao62.workers.dev/api/pdf-to-word";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf" || f?.name.toLowerCase().endsWith(".pdf")) {
      setFile(f);
      setResult(null);
      setError(null);
      setProgress("");
    } else {
      setError("Please select a PDF file.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf" || f?.name.toLowerCase().endsWith(".pdf")) {
      setFile(f);
      setResult(null);
      setError(null);
      setProgress("");
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setError(null);
    setProgress("Uploading PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress("Converting PDF to Word... (this may take up to 2 minutes)");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Conversion failed (${response.status})`);
      }

      setProgress("Downloading converted file...");

      // Fetch the converted file from CloudConvert's temporary URL
      const docxResp = await fetch(data.downloadUrl);
      if (!docxResp.ok) throw new Error("Failed to download converted file");

      const blob = await docxResp.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: data.filename || file.name.replace(".pdf", ".docx") });
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
      setProgress("");
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

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress("");
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">PDF to Word Converter</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Convert PDF documents to editable Word (.docx) files — free, fast, and secure.
      </p>

      {!result && (
        <div
          onClick={() => document.getElementById("p2w-input")?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
        >
          <input id="p2w-input" type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
          <div className="py-8">
            <div className="text-3xl mb-2">📝</div>
            <p className="font-medium">{file ? file.name : "Click to select or drag & drop a PDF file"}</p>
            {file && <p className="text-sm text-[var(--text-secondary)] mt-1">{(file.size / 1048576).toFixed(2)} MB</p>}
          </div>
        </div>
      )}

      {file && !result && (
        <div className="mt-6 flex gap-3">
          <button onClick={convert} disabled={converting} className="btn-primary flex-1">
            {converting ? "Converting..." : "Convert to Word"}
          </button>
          <button onClick={reset} disabled={converting} className="btn-secondary">Reset</button>
        </div>
      )}

      {progress && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          <span className="animate-spin">⏳</span> {progress}
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {result && (
        <div className="card mt-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <h2 className="text-xl font-semibold mb-4">Conversion Complete!</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">{result.name}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="btn-primary">Download .docx</button>
            <button onClick={reset} className="btn-secondary">Convert Another</button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Convert PDF to Word</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Upload your PDF file (up to 50MB).</li>
            <li>Click &quot;Convert to Word&quot; and wait for the conversion.</li>
            <li>Download the editable .docx file.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our PDF to Word Converter?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Accurate Conversion</strong> — Preserves formatting and layout.</li>
            <li>✅ <strong>Editable Output</strong> — Get a real .docx you can edit in Microsoft Word or Google Docs.</li>
            <li>✅ <strong>Secure & Private</strong> — Files are processed via encrypted API and deleted automatically.</li>
            <li>✅ <strong>Free Tier</strong> — Up to 25 conversions per day at no cost.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Will my formatting be preserved?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Most formatting is preserved including text, images, and basic layouts. Complex layouts with columns or embedded objects may vary slightly.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Is there a file size limit?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Files up to 50MB are supported. Larger files will take longer to process.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Is my data safe?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Yes. Your file is sent securely to the conversion engine and the result is available via a temporary link that expires automatically. We do not store your files.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">How long does conversion take?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Most files convert in 10-30 seconds. Very large or complex PDFs may take up to 2 minutes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
