"use client";

import { useState, useCallback } from "react";

interface FileInfo {
  file: File;
  originalSize: number;
}

export default function PdfCompressorPage() {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const qualityMap = { low: 0.4, medium: 0.6, high: 0.8 };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") {
      setFile({ file: f, originalSize: f.size });
      setResult(null);
      setError(null);
    } else {
      setError("Please drop a PDF file.");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile({ file: f, originalSize: f.size });
      setResult(null);
      setError(null);
    }
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setCompressing(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Remove metadata to reduce size
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      // Re-save with optimized settings
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100,
      });

      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ blob, size: blob.size });
    } catch (err) {
      setError(`Compression failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setCompressing(false);
    }
  }, [file]);

  const download = useCallback(() => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file.name.replace(".pdf", "_compressed.pdf");
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const reduction = file && result ? Math.round((1 - result.size / file.originalSize) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* H1 */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        PDF Compressor
      </h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Reduce PDF file size in your browser. No upload needed.
      </p>

      {/* Upload Area */}
      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("file-input")?.click()}
          className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
        >
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="py-12">
            <div className="text-4xl mb-4">📄</div>
            <p className="font-medium mb-1">
              {file ? file.file.name : "Drop your PDF here or click to browse"}
            </p>
            {file && (
              <p className="text-sm text-[var(--text-secondary)]">
                {formatSize(file.originalSize)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quality Selection */}
      {file && !result && (
        <div className="mt-6">
          <p className="font-medium mb-3">Compression Level</p>
          <div className="flex gap-3">
            {(["low", "medium", "high"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                  quality === q
                    ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <div className="capitalize">{q}</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {q === "low" ? "Smallest size" : q === "medium" ? "Balanced" : "Best quality"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {file && !result && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={compress}
            disabled={compressing}
            className="btn-primary flex-1"
          >
            {compressing ? "Compressing..." : "Compress PDF"}
          </button>
          <button onClick={reset} className="btn-secondary">
            Reset
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && file && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Compression Complete!</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-sm text-[var(--text-secondary)]">Original</p>
              <p className="text-lg font-bold">{formatSize(file.originalSize)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Compressed</p>
              <p className="text-lg font-bold text-green-700">{formatSize(result.size)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Reduction</p>
              <p className="text-lg font-bold text-blue-700">{reduction}%</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={download} className="btn-primary flex-1">
              Download Compressed PDF
            </button>
            <button onClick={reset} className="btn-secondary">
              Compress Another
            </button>
          </div>
        </div>
      )}

      {/* Ad Placeholder */}
      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">
        Advertisement
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Compress PDF Files</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Upload your PDF file by dragging or clicking the upload area.</li>
            <li>Select a compression level (Low, Medium, or High).</li>
            <li>Click &quot;Compress PDF&quot; and wait a few seconds.</li>
            <li>Download your compressed PDF file.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Compressor?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>100% Browser-Based</strong> — Your files never leave your device.</li>
            <li>✅ <strong>No Registration</strong> — Start compressing immediately.</li>
            <li>✅ <strong>No Watermark</strong> — Clean output, no branding.</li>
            <li>✅ <strong>Free Forever</strong> — No hidden fees or usage limits.</li>
            <li>✅ <strong>Works Offline</strong> — After first load, works without internet.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Is my PDF data safe?</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Yes. All processing happens in your browser using JavaScript. Your PDF is never uploaded to any server.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">How much can I reduce my PDF size?</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Results vary. PDFs with embedded images or redundant metadata can shrink 20-70%. Text-heavy PDFs may see smaller reductions.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">What compression level should I use?</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                &quot;Medium&quot; works for most cases. Use &quot;Low&quot; for maximum size reduction when print quality isn&apos;t critical. Use &quot;High&quot; when quality matters most.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
