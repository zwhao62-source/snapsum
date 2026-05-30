import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SnapSum – Free Online Tools, All in One Place",
  description: "SnapSum: Snap = Fast, Sum = All in One. Free browser-based tools for PDF, images, text, and more. No signup, no upload, no watermark.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">About SnapSum</h1>
      <p className="text-center text-[var(--text-secondary)] mb-12">
        Free online tools, all in one place.
      </p>

      {/* Name Origin */}
      <section className="card mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-[var(--primary)]">Snap</span> = Fast. <span className="text-[var(--primary)]">Sum</span> = All in One.
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            We built SnapSum because we were tired of the same loop: search for a tool, 
            find a sketchy site, wait for uploads, deal with watermarks, hit a paywall. 
            <br/><br/>
            <strong>Snap</strong> — because your tools should be instant. No upload wait, no server round-trip. 
            Everything runs in your browser, so it&apos;s as fast as your device.
            <br/><br/>
            <strong>Sum</strong> — because you shouldn&apos;t need 10 bookmarks for 10 different tasks. 
            PDF, images, text, QR codes — one site, every tool.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">What We Believe</h2>
        <div className="space-y-4">
          {[
            { title: "Privacy is non-negotiable", desc: "Your files never leave your device. Most tools run 100% in-browser using JavaScript — no server, no upload, no storage. For the rare tool that needs server processing (like PDF to Word), files are deleted within 30 minutes." },
            { title: "Free means free", desc: "No hidden paywalls, no \"premium\" tiers for basic features, no daily limits that push you to upgrade. Every tool on SnapSum is free to use, forever." },
            { title: "No friction", desc: "No signup, no email, no account. You arrive, you use the tool, you leave. That's the whole experience. We don't need your data — we just want to be useful." },
            { title: "Clean output", desc: "No watermarks on your files. No branding injected into your PDFs or images. What you put in is what you get out — just processed." },
            { title: "Open and honest", desc: "We make money through unobtrusive ads, not by selling your data. We'd rather be transparent about it than pretend we don't need revenue." },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works technically */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="card space-y-4">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Most SnapSum tools run entirely in your browser using client-side JavaScript. 
            This means:
          </p>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>✅ <strong>No upload</strong> — Your files are processed on your device, not sent to a server.</li>
            <li>✅ <strong>No storage</strong> — We never see or store your files.</li>
            <li>✅ <strong>Works offline</strong> — After the first load, most tools work without internet.</li>
            <li>✅ <strong>Fast</strong> — No upload/download wait. Processing starts instantly.</li>
          </ul>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The only exception is PDF to Word conversion, which requires server-side processing. 
            In that case, your file is sent to our server, converted, and deleted within 30 minutes. 
            We never share your files with third parties.
          </p>
        </div>
      </section>

      {/* Tools overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Our Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "PDF Compressor", desc: "Shrink PDF files without quality loss", browser: true },
            { name: "PDF Merger", desc: "Combine multiple PDFs into one", browser: true },
            { name: "PDF to Word", desc: "Convert PDF to editable .docx", browser: false },
            { name: "Image Compressor", desc: "Reduce image file size smartly", browser: true },
            { name: "Image Converter", desc: "Convert between JPEG, PNG, WebP", browser: true },
            { name: "QR Code Generator", desc: "Create custom QR codes", browser: true },
            { name: "Word Counter", desc: "Count words, chars, reading time", browser: true },
            { name: "Base64 Encoder", desc: "Encode/decode text and files", browser: true },
          ].map((tool) => (
            <div key={tool.name} className="card">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm">{tool.name}</h3>
                {tool.browser ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Browser</span>
                ) : (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Server</span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Feedback */}
      <section className="card text-center">
        <h2 className="text-xl font-bold mb-2">Have a Suggestion?</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          We&apos;re always adding new tools. If there&apos;s something you need, let us know.
        </p>
        <a href="mailto:hello@snapsum.com" className="btn-primary inline-block">hello@snapsum.com</a>
      </section>
    </div>
  );
}
