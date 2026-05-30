import Link from "next/link";

const tools = [
  {
    category: "PDF Tools",
    items: [
      { title: "PDF Compressor", description: "Reduce PDF file size without losing quality. 100% browser-based.", href: "/pdf-compressor", icon: "📄" },
      { title: "PDF Merger", description: "Merge multiple PDFs into one file. Fast and free.", href: "/pdf-merger", icon: "📑" },
      { title: "PDF to Word", description: "Convert PDF documents to editable Word files.", href: "/pdf-to-word", icon: "📝" },
    ],
  },
  {
    category: "Image Tools",
    items: [
      { title: "Image Compressor", description: "Compress JPEG, PNG, WebP images up to 80% smaller.", href: "/image-compressor", icon: "🖼️" },
      { title: "Image Converter", description: "Convert between JPEG, PNG, WebP, BMP formats instantly.", href: "/image-converter", icon: "🔄" },
      { title: "QR Code Generator", description: "Generate QR codes with custom colors and sizes.", href: "/qr-generator", icon: "📱" },
    ],
  },
  {
    category: "Text & Code",
    items: [
      { title: "Word Counter", description: "Count words, characters, sentences, and reading time.", href: "/word-counter", icon: "✍️" },
      { title: "Base64 Encoder/Decoder", description: "Encode or decode Base64 strings and files.", href: "/base64", icon: "🔐" },
    ],
  },
];

const features = [
  { icon: "🔒", title: "100% Private", desc: "All processing happens in your browser. Your files never leave your device." },
  { icon: "⚡", title: "Lightning Fast", desc: "No upload wait times. Tools run locally with instant results." },
  { icon: "🚫", title: "No Signup", desc: "Use every tool immediately. No account, no email, no strings attached." },
  { icon: "💧", title: "No Watermark", desc: "Clean output every time. No branding stamped on your files." },
  { icon: "♾️", title: "Unlimited Use", desc: "No daily limits, no hidden paywalls. Free forever." },
  { icon: "📱", title: "Works Everywhere", desc: "Desktop, tablet, or phone. All you need is a browser." },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>⚡</span> Free &amp; Browser-Based — No Upload Required
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          SnapSum – Free Online Tools,<br className="hidden md:block" /> All in One Place
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          Fast PDF, Image &amp; Text Tools — compress, merge, convert, generate QR codes, and more. 
          Everything runs in your browser. No data ever leaves your device.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#tools" className="btn-primary">Explore All Tools</a>
          <a href="/about" className="btn-secondary">Why SnapSum?</a>
        </div>
      </section>

      {/* Why SnapSum */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why SnapSum?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">All Tools</h2>
        {tools.map((group) => (
          <div key={group.category} className="mb-10">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">{group.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="card hover:shadow-md hover:border-[var(--primary)] transition-all group"
                >
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h4 className="font-semibold mb-1 group-hover:text-[var(--primary)]">{tool.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="py-12 bg-[var(--bg-secondary)] -mx-4 px-4 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Choose a Tool</h3>
              <p className="text-sm text-[var(--text-secondary)]">Pick from PDF, Image, Text, or Code tools.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Upload or Type</h3>
              <p className="text-sm text-[var(--text-secondary)]">Drop your file or enter your text. Everything stays in your browser.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-[var(--text-secondary)]">Download your file or copy the result. Done!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Snap = Fast, Sum = All in One */}
      <section className="py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-[var(--primary)]">Snap</span> = Fast. <span className="text-[var(--primary)]">Sum</span> = All in One.
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
          One site for every quick task. No more jumping between 10 different tools — 
          SnapSum puts them all in one place, and makes them fast.
        </p>
        <a href="/about" className="text-[var(--primary)] font-medium hover:underline">Learn more about SnapSum →</a>
      </section>
    </div>
  );
}
