export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-black bg-[#C0C0C0]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-black">
          SortViz
        </span>
        <span className="text-sm text-[#333333]">CS 404 Mini Project</span>
      </div>
    </header>
  );
}
