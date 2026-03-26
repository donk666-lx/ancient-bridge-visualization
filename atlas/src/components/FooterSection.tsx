import { useScrollReveal } from "@/hooks/useScrollReveal";

const FooterSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <footer ref={ref} className="py-20 border-t border-border">
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="text-center">
            <h2 className="font-serif-cn text-2xl text-ink mb-4">
              桥<span className="text-cinnabar">·</span>韵
            </h2>
            <p className="text-sm text-muted-foreground font-sans-cn max-w-md mx-auto leading-relaxed">
              中国古代桥梁信息可视化设计 — 以数据之美，致敬千年匠心
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground font-sans-cn">
              <span>通津桥 · 宋代</span>
              <span className="w-1 h-1 rounded-full bg-cinnabar" />
              <span>双龙桥 · 清乾隆年间</span>
        
              <span className="w-1 h-1 rounded-full bg-cinnabar" />
              <span>赵州桥 · 隋代</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
