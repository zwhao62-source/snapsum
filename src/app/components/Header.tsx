"use client";

export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--primary)]">
          <span className="text-2xl">⚡</span> SnapSum
        </a>
        <nav className="hidden md:flex gap-5 text-sm text-[var(--text-secondary)]">
          <a href="/pdf-compressor" className="hover:text-[var(--primary)] transition-colors">PDF Compress</a>
          <a href="/pdf-merger" className="hover:text-[var(--primary)] transition-colors">PDF Merge</a>
          <a href="/image-compressor" className="hover:text-[var(--primary)] transition-colors">Image Compress</a>
          <a href="/image-converter" className="hover:text-[var(--primary)] transition-colors">Image Convert</a>
          <a href="/qr-generator" className="hover:text-[var(--primary)] transition-colors">QR Code</a>
          <a href="/word-counter" className="hover:text-[var(--primary)] transition-colors">Word Counter</a>
          <a href="/base64" className="hover:text-[var(--primary)] transition-colors">Base64</a>
          <a href="/about" className="hover:text-[var(--primary)] transition-colors">About</a>
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)]"
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            if (menu) menu.classList.toggle("hidden");
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div id="mobile-menu" className="hidden md:hidden border-t border-[var(--border)] bg-white px-4 pb-4">
        <div className="flex flex-col gap-3 pt-3 text-sm">
          <a href="/pdf-compressor" className="py-2 hover:text-[var(--primary)]">PDF Compress</a>
          <a href="/pdf-merger" className="py-2 hover:text-[var(--primary)]">PDF Merge</a>
          <a href="/pdf-to-word" className="py-2 hover:text-[var(--primary)]">PDF to Word</a>
          <a href="/image-compressor" className="py-2 hover:text-[var(--primary)]">Image Compress</a>
          <a href="/image-converter" className="py-2 hover:text-[var(--primary)]">Image Convert</a>
          <a href="/qr-generator" className="py-2 hover:text-[var(--primary)]">QR Code</a>
          <a href="/word-counter" className="py-2 hover:text-[var(--primary)]">Word Counter</a>
          <a href="/base64" className="py-2 hover:text-[var(--primary)]">Base64</a>
          <a href="/about" className="py-2 hover:text-[var(--primary)]">About</a>
        </div>
      </div>
    </header>
  );
}
