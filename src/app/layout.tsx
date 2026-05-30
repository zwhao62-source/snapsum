import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapSum – Free Online Tools, All in One Place",
  description:
    "Fast PDF, Image & Text Tools — compress, merge, convert, generate QR codes, count words, encode Base64, and more. No signup, no watermark, 100% browser-based.",
  keywords: [
    "PDF compress",
    "PDF merge",
    "PDF to Word",
    "image compress",
    "image converter",
    "QR code generator",
    "word counter",
    "base64 encoder",
    "free online tools",
    "SnapSum",
  ],
  openGraph: {
    title: "SnapSum – Free Online Tools, All in One Place",
    description: "Fast PDF, Image & Text Tools. No signup, no watermark, 100% browser-based.",
    type: "website",
    url: "https://snapsum.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg)]">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="font-bold text-lg mb-3"><span className="text-xl">⚡</span> SnapSum</p>
                <p className="text-sm text-[var(--text-secondary)]">Snap = Fast. Sum = All in One.<br/>Free online tools that run in your browser.</p>
              </div>
              <div>
                <p className="font-semibold mb-3">PDF Tools</p>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <a href="/pdf-compressor" className="block hover:text-[var(--primary)]">PDF Compressor</a>
                  <a href="/pdf-merger" className="block hover:text-[var(--primary)]">PDF Merger</a>
                  <a href="/pdf-to-word" className="block hover:text-[var(--primary)]">PDF to Word</a>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-3">Image Tools</p>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <a href="/image-compressor" className="block hover:text-[var(--primary)]">Image Compressor</a>
                  <a href="/image-converter" className="block hover:text-[var(--primary)]">Image Converter</a>
                  <a href="/qr-generator" className="block hover:text-[var(--primary)]">QR Code Generator</a>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-3">Text & Code</p>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <a href="/word-counter" className="block hover:text-[var(--primary)]">Word Counter</a>
                  <a href="/base64" className="block hover:text-[var(--primary)]">Base64 Encoder</a>
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-secondary)]">
              <p>© 2026 SnapSum. All tools run in your browser. No data uploaded.</p>
              <div className="flex gap-4">
                <a href="/about" className="hover:text-[var(--primary)]">About</a>
                <a href="/privacy" className="hover:text-[var(--primary)]">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
