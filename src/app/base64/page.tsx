"use client";

import { useState, useCallback } from "react";

type Mode = "encode" | "decode";
type InputType = "text" | "file";

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async () => {
    setError(null);
    try {
      if (mode === "encode") {
        if (inputType === "text") {
          const encoded = btoa(unescape(encodeURIComponent(input)));
          setOutput(encoded);
        } else {
          const fileInput = document.getElementById("b64-file") as HTMLInputElement;
          const file = fileInput?.files?.[0];
          if (!file) { setError("Please select a file."); return; }
          const buffer = await file.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = "";
          bytes.forEach((b) => (binary += String.fromCharCode(b)));
          setOutput(btoa(binary));
        }
      } else {
        if (inputType === "text") {
          const decoded = decodeURIComponent(escape(atob(input)));
          setOutput(decoded);
        } else {
          setError("File decode is not supported in text mode. Paste Base64 string instead.");
        }
      }
    } catch (err) {
      setError(`${mode === "encode" ? "Encoding" : "Decoding"} failed: ${err instanceof Error ? err.message : "Invalid input"}`);
      setOutput("");
    }
  }, [mode, inputType, input]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
  }, [output]);

  const downloadOutput = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "base64_encoded.txt" : "base64_decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, mode]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Base64 Encoder / Decoder</h1>
      <p className="text-center text-[var(--text-secondary)] mb-10">
        Encode text or files to Base64, or decode Base64 back to text.
      </p>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setMode("encode"); setOutput(""); setError(null); }}
          className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
            mode === "encode" ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]" : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); setError(null); }}
          className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
            mode === "decode" ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]" : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          Decode
        </button>
      </div>

      {/* Input Type */}
      {mode === "encode" && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setInputType("text")}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
              inputType === "text" ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]" : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Text Input
          </button>
          <button
            onClick={() => setInputType("file")}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
              inputType === "file" ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]" : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            File Input
          </button>
        </div>
      )}

      {/* Input Area */}
      {inputType === "text" ? (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
          className="w-full border border-[var(--border)] rounded-lg p-3 h-32 resize-y text-sm font-mono focus:border-[var(--primary)] focus:outline-none"
        />
      ) : (
        <div
          onClick={() => document.getElementById("b64-file")?.click()}
          className="card cursor-pointer text-center hover:border-[var(--primary)] transition-colors py-8"
        >
          <input id="b64-file" type="file" className="hidden" onChange={() => process()} />
          <div className="text-2xl mb-2">📁</div>
          <p className="font-medium">Click to select a file</p>
        </div>
      )}

      <button onClick={process} className="btn-primary w-full mt-4">
        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
      </button>

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Output */}
      {output && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">Result</label>
            <div className="flex gap-2">
              <button onClick={copyOutput} className="text-xs border rounded px-3 py-1 hover:bg-[var(--bg-secondary)]">Copy</button>
              <button onClick={downloadOutput} className="text-xs border rounded px-3 py-1 hover:bg-[var(--bg-secondary)]">Download</button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full border border-[var(--border)] rounded-lg p-3 h-32 resize-y text-sm font-mono bg-[var(--bg-secondary)]"
          />
        </div>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-secondary)]">Advertisement</div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Use Base64 Encoder/Decoder</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Select &quot;Encode&quot; or &quot;Decode&quot; mode.</li>
            <li>Enter your text or select a file.</li>
            <li>Click the action button to process.</li>
            <li>Copy or download the result.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Use Our Base64 Tool?</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>Text &amp; File Support</strong> — Encode files or plain text.</li>
            <li>✅ <strong>UTF-8 Safe</strong> — Handles international characters correctly.</li>
            <li>✅ <strong>Copy &amp; Download</strong> — One-click output handling.</li>
            <li>✅ <strong>Private</strong> — All processing in your browser.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}