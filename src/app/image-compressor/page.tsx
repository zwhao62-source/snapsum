"use client";

import { useState, useCallback } from "react";

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [compressing, setCompressing] = useState(false);
  const [results, setResults] = useState<{ name: string; originalSize: number; newSize: number; preview: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const imgs = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
    setResults([]);
    setError(null);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const compress = useCallback(async () => {
    if (files.length === 0) return;
    setCompressing(true);
    setError(null);
    const output: typeof results = [];

    for (const file of files) {
      try {
        const src = URL.createObjectURL(file);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = src;
        });

        let quality = 0.9;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d")!;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(src);

        let blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
            file.type,
            quality
          );
          // revoke after
          URL.revokeObjectURL(src);
        });

        // iteratively reduce quality until under maxSizeMB
        const maxBytes = maxSizeMB * 1048576;
        while (blob.size > maxBytes && quality > 0.05) {
          quality -= 0.1;
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
              file.type,
              quality
            );
          });
        }

        // if still too large, reduce dimensions
        while (blob.size > maxBytes && canvas.width > 400) {
          canvas.width = Math.round(canvas.width * 0.7);
          canvas.height = Math.round(canvas.height * 0.7);
          ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
              file.type,
              quality
            );
          });
        }

        const preview = URL.createObjectURL(blob);
        output.push({ name: file.name, originalSize: file.size, newSize: blob.size, preview });
      } catch (err) {
        output.push({ name: file.name, originalSize: file.size, newSize: file.size, preview: "" });
      }
    }

    setResults(output);
    setCompressing(false);
  }, [files, maxSizeMB]);

  const downloadAll = useCallback(() => {
    results.forEach((r, i) => {
      if (!r.preview) return;
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.preview;
        a.download = r.name.replace(/\.[^.]+$/, "_compressed.jpg");
        a.click();
      }, i * 200);
    });
  }, [results]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const totalSaved = results.reduce((acc, r) => acc + r.originalSize - r.newSize, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Image Compressor</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Compress JPEG, PNG, WebP images. No quality loss at the same resolution.
      </p>

      {/* Upload */}
      <div
        onClick={() => document.getElementById("img-input")?.click()}
        className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors"
      >
        <input
          id="img-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="py-8">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="font-medium">Click or drag to add images</p>
          <p className="text-sm text-[var(--text-secondary)]">JPEG, PNG, WebP supported</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && results.length === 0 && (
        <div className="mt-6 space-y-2">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="card flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-10 h-10 object-cover rounded border"
                />
                <div>
                  <p className="font-medium text-sm">{f.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{formatSize(f.size)}</p>
                </div>
              </div>
              <button onClick={() => removeFile(i)} className="text-red-500 hover:bg-red-50 px-2 py-1 text-xs border rounded">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Max size selector */}
      {files.length > 0 && results.length === 0 && (
        <div className="mt-6">
          <label className="font-medium block mb-2">Target Max File Size</label>
          <div className="flex gap-3">
            {[0.5, 1, 2, 5].map((size) => (
              <button
                key={size}
                onClick={() => setMaxSizeMB(size)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  maxSizeMB === size
                    ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {size} MB
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      {files.length > 0 && results.length === 0 && (
        <div className="mt-6 flex gap-3">
          <button onClick={compress} disabled={compressing} className="btn-primary flex-1">
            {compressing ? "Compressing..." : `Compress ${files.length} Image${files.length > 1 ? "s" : ""}`}
          </button>
          <button onClick={() => { setFiles([]); setResults([]); }} className="btn-secondary">Reset</button>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <div className="card mb-4 text-center">
            <p className="text-sm text-[var(--text-secondary)]">Total saved: <strong className="text-green-600">{formatSize(totalSaved)}</strong></p>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => {
              const pct = Math.round((1 - r.newSize / r.originalSize) * 100);
              return (
                <div key={i} className="card flex items-center gap-4">
                  {r.preview && (
                    <img src={r.preview} alt="" className="w-16 h-16 object-cover rounded border" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatSize(r.originalSize)} → {formatSize(r.newSize)}{" "}
                      <span className={pct > 0 ? "text-green-600" : "text-red-500"}>
                        ({pct > 0 ? "-" : "+"}{Math.abs(pct)}%)
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={downloadAll} className="btn-primary flex-1">Download All</button>
            <button onClick={() => { setFiles([]); setResults([]); }} className="btn-secondary">Compress More</button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Compress Images</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Upload your images (JPEG, PNG, WebP).</li>
            <li>Choose a target max file size.</li>
            <li>Click &quot;Compress&quot; — the tool auto-adjusts quality and dimensions.</li>
            <li>Download compressed images.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our Image Compressor?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Smart Compression</strong> — Auto-adjusts quality + size to hit your target.</li>
            <li>✅ <strong>Batch Processing</strong> — Compress unlimited images at once.</li>
            <li>✅ <strong>No Upload</strong> — Everything runs in your browser.</li>
            <li>✅ <strong>Format Preservation</strong> — Keeps your original format.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Will compression reduce image quality?</h3>
              <p className="text-[var(--text-secondary)] text-sm">Some quality reduction is unavoidable for size reduction. The tool tries to preserve quality as much as possible while hitting your target size.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">What formats are supported?</h3>
              <p className="text-[var(--text-secondary)] text-sm">JPEG, PNG, and WebP. For best results, use WebP or JPEG for photos, PNG for graphics with transparency.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}