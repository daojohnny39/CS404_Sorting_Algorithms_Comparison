export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#475569] bg-[#0F172A]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-[#F8FAFC]">
          Sort<span className="text-[#22C55E]">Viz</span>
        </span>
        <span className="text-sm text-[#94A3B8]">CS 404 Mini Project</span>
      </div>
    </header>
  );
}
