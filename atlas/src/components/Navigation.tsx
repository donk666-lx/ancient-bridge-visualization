import { useState, useEffect } from "react";

const navItems = [
  { id: "bridge-0", label: "通津桥" },
  { id: "bridge-1", label: "双龙桥" },
  { id: "bridge-2", label: "赵州桥" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      // Find active section
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3"
          : "py-5"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-serif-cn text-lg text-ink hover:text-cinnabar transition-colors duration-300 active:scale-[0.97]"
        >
          桥<span className="text-cinnabar">·</span>韵
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-sans-cn text-sm transition-colors duration-300 active:scale-[0.97] ${
                activeSection === item.id
                  ? "text-cinnabar"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="w-px h-4 bg-border/50" />
          <a
            href="http://localhost:3006/"
            className="font-sans-cn text-sm text-ink-light hover:text-cinnabar transition-colors duration-300 active:scale-[0.97] flex items-center gap-1"
          >
            <span>数据报告</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
