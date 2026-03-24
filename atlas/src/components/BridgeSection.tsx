import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BridgeData {
  name: string;
  subtitle: string;
  location: string;
  era: string;
  builder: string;
  length: string;
  width: string;
  height: string;
  type: string;
  image: string;
  description: string;
  structure: string;
  culture: string;
  protection: string;
  features: string[];
  index: number;
  builderInfo?: string;
  parts?: Array<{
    id: string;
    name: string;
    description: string;
    position: { top: string; left: string };
  }>;
}

const BridgeSection = ({ bridge }: { bridge: BridgeData }) => {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.15);
  const { ref: dataRef, isVisible: dataVisible } = useScrollReveal(0.15);
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal(0.15);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef2 = useRef<HTMLElement>(null);
  
  // 游戏彩蛋相关状态
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [lightProgress, setLightProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  
  const [selectedPart, setSelectedPart] = useState<{ name: string; description: string } | null>(null);
  const [showBuilderDialog, setShowBuilderDialog] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const isReversed = bridge.index % 2 !== 0;

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef2.current) {
        const rect = sectionRef2.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        
        // Calculate progress based on element position in viewport
        let progress = 0;
        if (rect.top < windowHeight && rect.bottom > 0) {
          // Element is in viewport
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          progress = visibleHeight / (elementHeight + windowHeight);
          progress = Math.max(0, Math.min(1, progress));
        }
        
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 处理点击事件，实现连续点击检测
  const handleImageClick = () => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    // 重置点击计数如果超过时间窗口
    if (timeSinceLastClick > 500) {
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }
    
    setLastClickTime(currentTime);
    
    // 检测连续3次点击
    if (clickCount + 1 === 3) {
      triggerEasterEgg();
    }
  };

  // 触发彩蛋效果
  const triggerEasterEgg = () => {
    setShowEasterEgg(true);
    
    // 灯光动画
    setLightProgress(0);
    const lightInterval = setInterval(() => {
      setLightProgress(prev => {
        if (prev >= 1) {
          clearInterval(lightInterval);
          return 1;
        }
        return prev + 0.02;
      });
    }, 30);
    
    // 文字动画（延迟开始）
    setTimeout(() => {
      setTextProgress(0);
      const textInterval = setInterval(() => {
        setTextProgress(prev => {
          if (prev >= 1) {
            clearInterval(textInterval);
            return 1;
          }
          return prev + 0.01;
        });
      }, 50);
    }, 1000);
    
    // 3秒后重置彩蛋效果
    setTimeout(() => {
      setShowEasterEgg(false);
    }, 5000);
  };

  return (
    <section
      id={`bridge-${bridge.index}`}
      ref={sectionRef2}
      className="py-24 md:py-32 scroll-mt-24"
    >
      {/* Bridge Number & Title */}
      <div ref={sectionRef} className="container mx-auto px-6 max-w-6xl">
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Number label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-serif-cn text-7xl md:text-9xl font-bold text-ink/[0.06] leading-none select-none">
              {String(bridge.index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-ancient text-3xl md:text-5xl font-bold text-ink">
                {bridge.name}
              </h2>
              <p className="text-ink-light font-sans-cn text-sm mt-1">{bridge.subtitle}</p>
            </div>
          </div>

          {/* Hero image */}
          <div className="bg-paper-warm/60 border border-border/50 rounded-sm p-6 md:p-8 backdrop-blur-sm">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
                isReversed ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={`${isReversed ? "lg:order-2" : ""}`}>
                <div className="relative overflow-hidden rounded-sm group cursor-pointer" onClick={handleImageClick}>
                  <img
                    src={bridge.image}
                    alt={bridge.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                  
                  {/* 晨昏切换效果 */}
                  <div 
                    className="absolute inset-0 transition-all duration-1000 ease-in-out"
                    style={{
                      background: `linear-gradient(
                        rgba(255, 248, 230, ${0.3 * (1 - scrollProgress)}), 
                        rgba(255, 210, 150, ${0.4 * scrollProgress})
                      )`,
                      mixBlendMode: 'overlay'
                    }}
                  />
                  
                  {/* 水面波纹动画 */}
                  <div className="absolute inset-0 overflow-hidden opacity-30">
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1/2"
                      style={{
                        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent)',
                        animation: 'wave 15s infinite linear'
                      }}
                    >
                      <div 
                        className="absolute bottom-0 left-0 w-full h-full"
                        style={{
                          background: 'radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.2), transparent 70%)',
                          animation: 'ripple 8s infinite ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 彩蛋：桥身暖灯亮起动画 */}
                  {showEasterEgg && (
                    <div 
                      className="absolute inset-0 transition-all duration-1000 ease-in-out"
                      style={{
                        background: `radial-gradient(circle at ${50 * lightProgress}% 50%, rgba(255, 220, 150, ${0.5 * lightProgress}), transparent 70%)`,
                        mixBlendMode: 'overlay'
                      }}
                    />
                  )}
                  
                  {/* 彩蛋：水面浮现书法字效果 */}
                  {showEasterEgg && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `translateY(${50 * (1 - textProgress)}%)`,
                        opacity: textProgress,
                        transition: 'all 1s ease-in-out'
                      }}
                    >
                      <h3 className="font-ancient text-4xl md:text-5xl font-bold text-yellow-200 drop-shadow-lg">
                        {bridge.name}
                      </h3>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 rounded-sm" />
                  
                  {/* 可交互的热点区域 - 使用纯视觉效果，不影响布局 */}
                  {bridge.parts && bridge.parts.length > 0 && (
                    <>
                      {bridge.parts.map((part) => (
                        <button
                          key={part.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPart({ name: part.name, description: part.description });
                          }}
                          onMouseEnter={() => setHoveredPart(part.id)}
                          onMouseLeave={() => setHoveredPart(null)}
                          className={`absolute transition-all duration-500 ease-out cursor-pointer group/part`}
                          style={{
                            top: part.position.top,
                            left: part.position.left,
                            width: hoveredPart === part.id ? '80px' : '56px',
                            height: hoveredPart === part.id ? '80px' : '56px',
                            transform: hoveredPart === part.id ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            background: hoveredPart === part.id 
                              ? 'radial-gradient(circle, rgba(200, 80, 80, 0.3) 0%, rgba(200, 80, 80, 0.1) 50%, transparent 70%)'
                              : 'transparent',
                            boxShadow: hoveredPart === part.id 
                              ? '0 0 40px rgba(200, 80, 80, 0.4), 0 0 80px rgba(200, 80, 80, 0.2)'
                              : 'none',
                            border: hoveredPart === part.id 
                              ? '2px solid rgba(200, 80, 80, 0.6)'
                              : '2px solid transparent',
                            zIndex: hoveredPart === part.id ? 30 : 10
                          }}
                        >
                          <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded opacity-0 group-hover/part:opacity-100 transition-opacity whitespace-nowrap shadow-lg font-sans-cn pointer-events-none">
                            {part.name}
                          </span>
                        </button>
                      ))}
                      
                      {/* 悬停时的分离效果 - 周围变暗 */}
                      {hoveredPart && (
                        <div 
                          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                          style={{
                            background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.3) 100%)',
                            opacity: 0.8
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={`flex flex-col justify-center ${isReversed ? "lg:order-1" : ""}`}>
                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <MetaItem label="地点" value={bridge.location} />
                  <MetaItem label="始建" value={bridge.era} />
                  <MetaItem 
                    label="建造者" 
                    value={bridge.builder} 
                    hasInfo={!!bridge.builderInfo}
                    onShowInfo={() => setShowBuilderDialog(true)}
                  />
                  <MetaItem label="类型" value={bridge.type} />
                </div>

                <p className="text-foreground/80 font-sans-cn text-sm leading-relaxed">
                  {bridge.description}
                </p>

                {bridge.protection && (
                  <div className="mt-4 px-3 py-2 bg-cinnabar/[0.06] border-l-2 border-cinnabar rounded-sm">
                    <p className="text-xs text-ink-light font-sans-cn">
                      {bridge.protection}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data visualization bar */}
      <div ref={dataRef} className="container mx-auto px-6 max-w-6xl mt-16">
        <div
          className={`transition-all duration-700 delay-100 ${dataVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="bg-paper-warm/60 border border-border/50 rounded-sm p-6 md:p-8 backdrop-blur-sm">
            <h3 className="font-serif-cn text-lg text-ink mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-cinnabar inline-block" />
              建筑参数
            </h3>

            <div className="grid grid-cols-3 gap-6 md:gap-12">
              <DataBar label="桥长" value={bridge.length} />
              <DataBar label="桥宽" value={bridge.width} />
              <DataBar label="桥高" value={bridge.height} />
            </div>

            {/* Structure description */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-serif-cn text-sm text-ink mb-3">结构特征</h4>
              <p className="text-sm text-ink-light font-sans-cn leading-relaxed">{bridge.structure}</p>
            </div>

            {/* Feature tags */}
            {bridge.features.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {bridge.features.map((f) => (
                  <span key={f} className="px-3 py-1 text-xs font-sans-cn bg-ink/[0.04] text-ink-light rounded-sm">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cultural story */}
      <div ref={storyRef} className="container mx-auto px-6 max-w-6xl mt-12">
        <div
          className={`transition-all duration-700 delay-200 ${storyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="bg-paper-warm/60 border border-border/50 rounded-sm p-6 md:p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-cinnabar/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cinnabar text-xs font-serif-cn">文</span>
                </div>
              </div>
              <div>
                <h3 className="font-serif-cn text-lg text-ink mb-3">历史文化</h3>
                <p className="text-sm text-ink-light font-sans-cn leading-[1.9]">
                  {bridge.culture}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 部位介绍弹窗 */}
      <Dialog open={!!selectedPart} onOpenChange={() => setSelectedPart(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ancient text-2xl">{selectedPart?.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm font-sans-cn leading-relaxed text-foreground">
            {selectedPart?.description}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* 建造者介绍弹窗 */}
      <Dialog open={showBuilderDialog} onOpenChange={setShowBuilderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ancient text-2xl">{bridge.builder}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm font-sans-cn leading-relaxed text-foreground">
            {bridge.builderInfo}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const MetaItem = ({ label, value, hasInfo, onShowInfo }: { label: string; value: string; hasInfo?: boolean; onShowInfo?: () => void }) => (
  <div>
    <span className="text-xs text-muted-foreground font-sans-cn">{label}</span>
    <p 
      className={`text-sm font-medium text-ink font-sans-cn mt-0.5 ${hasInfo ? 'cursor-pointer hover:text-cinnabar transition-colors' : ''}`}
      onClick={hasInfo ? onShowInfo : undefined}
    >
      {value}
      {hasInfo && <span className="ml-1 text-xs text-cinnabar">ℹ️</span>}
    </p>
  </div>
);

const DataBar = ({ label, value }: { label: string; value: string }) => {
  const numericValue = parseFloat(value);
  const maxValue = 160; // max scale
  const percentage = Math.min((numericValue / maxValue) * 100, 100);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-muted-foreground font-sans-cn">{label}</span>
        <span className="text-lg md:text-2xl font-serif-cn font-bold text-ink tabular-nums">{value}</span>
      </div>
      <div className="h-1 bg-ink/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-cinnabar/60 rounded-full transition-all duration-1000"
          style={{
            width: `${percentage}%`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
};

export default BridgeSection;
