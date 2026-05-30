"use client";

import { useState, useCallback } from "react";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(92);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatLabel: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
  };

  const formatExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError(null);
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    try {
      const img = new Image();
      const src = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
      });
      URL.revokeObjectURL(src);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
          outputFormat,
          quality / 100
        );
      });

      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (err) {
      setError(`Conversion failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setConverting(false);
    }
  }, [file, outputFormat, quality]);

  const download = useCallback(() => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, formatExt[outputFormat]);
    a.click();
  }, [result, file, outputFormat]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Image Converter</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Convert between JPEG, PNG, and WebP instantly.
      </p>

      {!result && (
        <div
          onClick={() => document.getElementById("conv-input")?.click()}
          className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
        >
          <input id="conv-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          <div className="py-8">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded border" />
            ) : (
              <>
                <div className="text-3xl mb-2">🔄</div>
                <p className="font-medium">Click to select an image</p>
              </>
            )}
          </div>
        </div>
      )}

      {file && !result && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="font-medium block mb-2">Convert To</label>
            <div className="flex gap-3">
              {(["image/jpeg", "image/png", "image/webp"] as OutputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                    outputFormat === fmt
                      ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]"
                      : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {formatLabel[fmt]}
                </button>
              ))}
            </div>
          </div>
          {outputFormat !== "image/png" && (
            <div>
              <label className="font-medium block mb-2">Quality: {quality}%</label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {file && !result && (
        <div className="mt-6 flex gap-3">
          <button onClick={convert} disabled={converting} className="btn-primary flex-1">
            {converting ? "Converting..." : `Convert to ${formatLabel[outputFormat]}`}
          </button>
          <button onClick={() => { setFile(null); setPreview(""); setResult(null); }} className="btn-secondary">Reset</button>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {result && file && (
        <div className="card mt-6 text-center">
          <img src={result.url} alt="Converted" className="max-h-64 mx-auto rounded border mb-4" />
          <h2 className="text-xl font-semibold mb-4">Conversion Complete!</h2>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="btn-primary">Download {formatLabel[outputFormat]}</button>
            <button onClick={() => { setFile(null); setPreview(""); setResult(null); }} className="btn-secondary">Convert Another</button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Convert Images</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Upload your image file.</li>
            <li>Select the target format (JPEG, PNG, or WebP).</li>
            <li>Adjust quality if needed.</li>
            <li>Click &quot;Convert&quot; and download.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our Image Converter?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Fast Conversion</strong> — Instant results in your browser.</li>
            <li>✅ <strong>Quality Control</strong> — Adjust output quality precisely.</li>
            <li>✅ <strong>WebP Support</strong> — Modern format for smaller file sizes.</li>
            <li>✅ <strong>No Upload</strong> — Your images stay on your device.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}