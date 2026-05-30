"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    setGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      setQrUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }, [text, size, fgColor, bgColor]);

  // Auto-generate on text change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim()) generate();
    }, 300);
    return () => clearTimeout(timer);
  }, [text, size, fgColor, bgColor]);

  const downloadPng = useCallback(() => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.click();
  }, [qrUrl]);

  const downloadSvg = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(text, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  }, [text, size, fgColor, bgColor]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">QR Code Generator</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Generate QR codes with custom colors and download as PNG or SVG.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="font-medium block mb-1">Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text"
              className="w-full border border-[var(--border)] rounded-lg p-3 text-sm h-24 resize-none focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Size: {size}px</label>
            <input
              type="range"
              min={128}
              max={512}
              step={64}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-medium block mb-1">Foreground</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded border border-[var(--border)] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="font-medium block mb-1">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded border border-[var(--border)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card flex flex-col items-center justify-center min-h-[300px]">
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR Code" className="mb-4" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
              <div className="flex gap-3">
                <button onClick={downloadPng} className="btn-primary text-sm px-4 py-2">Download PNG</button>
                <button onClick={downloadSvg} className="btn-secondary text-sm px-4 py-2">Download SVG</button>
              </div>
            </>
          ) : (
            <p className="text-[var(--text-secondary)]">Enter text to generate QR code</p>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Generate QR Codes</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Enter your URL or text content.</li>
            <li>Customize size and colors.</li>
            <li>Download as PNG or SVG.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our QR Code Generator?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Custom Colors</strong> — Match your brand identity.</li>
            <li>✅ <strong>SVG Export</strong> — Vector format for print.</li>
            <li>✅ <strong>No Signup</strong> — Generate unlimited QR codes free.</li>
            <li>✅ <strong>Instant Preview</strong> — See changes in real-time.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Is there a character limit?</h3>
              <p className="text-[var(--text-secondary)] text-sm">QR codes can store up to 4,296 alphanumeric characters. For URLs, shorter is better for scan reliability.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Do QR codes expire?</h3>
              <p className="text-[var(--text-secondary)] text-sm">No. Static QR codes generated here never expire. They encode the data directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}