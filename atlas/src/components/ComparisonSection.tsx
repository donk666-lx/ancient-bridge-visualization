import { useScrollReveal } from "@/hooks/useScrollReveal";

const bridges = [
  { name: "通津桥", era: "宋代", year: 960, rebuilt: "1798年", type: "单孔石拱桥", length: 28, material: "石" },
  { name: "双龙桥", era: "清代", year: 1750, rebuilt: "1839年扩建", type: "十七孔石拱廊桥", length: 148, material: "石" },
  { name: "赵州桥", era: "隋代", year: 605, rebuilt: "多次修缮", type: "敞肩石拱桥", length: 50.82, material: "石" },
];

const ComparisonSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="py-24 md:py-32 bg-paper-warm/90" ref={ref}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <p className="text-sunray text-xs tracking-[0.3em] font-sans-cn mb-3">DATA COMPARISON</p>
          <h2 className="font-serif-cn text-3xl md:text-4xl font-bold text-ink mb-16">
            三桥对比
          </h2>

          {/* Timeline */}
          <div className="relative mb-20">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-ink/10" />
            <div className="flex justify-between relative">
              {bridges
                .sort((a, b) => a.year - b.year)
                .map((b, i) => (
                  <div
                    key={b.name}
                    className={`flex flex-col items-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{
                      transitionDelay: `${300 + i * 150}ms`,
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <span className="text-ink/50 text-base font-sans-cn mb-2">{b.era}</span>
                    <div className="w-3 h-3 rounded-full bg-sunray ring-4 ring-paper-warm z-10" />
                    <span className="text-ink font-ancient text-lg mt-2 font-medium">{b.name}</span>
                    <span className="text-ink/40 text-sm font-sans-cn mt-0.5 tabular-nums">
                      约{b.year}年
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Length comparison bars */}
          <div className="space-y-6">
            <h3 className="text-ink/50 text-sm tracking-[0.2em] font-sans-cn mb-4">
              桥长对比（米）
            </h3>
            {bridges.map((b, i) => (
              <div
                key={b.name}
                className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                style={{
                  transitionDelay: `${600 + i * 100}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-ink font-ancient text-lg w-28 flex-shrink-0">{b.name}</span>
                  <div className="flex-1 h-8 bg-ink/[0.04] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-sunray rounded-full transition-all duration-1000 flex items-center justify-end pr-4"
                      style={{
                        width: isVisible ? `${(b.length / 160) * 100}%` : "0%",
                        transitionDelay: `${800 + i * 100}ms`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <span className="text-ink text-lg tabular-nums font-sans-cn">{b.length}m</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Material & Type grid */}
          <div className="grid grid-cols-3 gap-4 mt-16">
            {bridges.map((b, i) => (
              <div
                key={b.name}
                className={`border border-ink/10 rounded-sm p-4 md:p-6 transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                style={{
                  transitionDelay: `${900 + i * 100}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <p className="text-sunray text-sm font-ancient mb-2">{b.name}</p>
                <p className="text-ink font-serif-cn text-base mb-1">{b.type}</p>
                <p className="text-ink/40 text-sm font-sans-cn">
                  材质：{b.material}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
