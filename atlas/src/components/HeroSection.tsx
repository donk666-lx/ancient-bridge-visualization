import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="水墨山水"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <p className="text-center text-sm tracking-[0.4em] text-ink-light font-sans-cn font-light mb-6">
            中国古代桥梁 · 信息可视化
          </p>
        </div>

        <h1
          className="font-serif-cn text-5xl md:text-7xl lg:text-8xl font-bold text-ink text-center leading-tight opacity-0 animate-fade-up"
          style={{ animationDelay: "500ms", animationFillMode: "forwards", lineHeight: "1.1" }}
        >
          桥<span className="text-cinnabar">·</span>韵
        </h1>

        <div
          className="mt-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
        >
          <p className="text-center text-ink-light font-sans-cn text-base md:text-lg max-w-md leading-relaxed font-light">
            跨越千年时光，三座古桥的建筑智慧与文化记忆
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 opacity-0 animate-fade-in"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <div 
            className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => {
              const calligraphySection = document.querySelector('section.py-24.md\:py-32.bg-paper-warm\/80');
              if (calligraphySection) {
                calligraphySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-sm tracking-[0.3em] text-ink-light font-sans-cn transition-colors duration-300 hover:text-ink">向下探索</span>
            <div className="w-px h-8 bg-ink-light/40 animate-pulse transition-colors duration-300 hover:bg-ink/60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
