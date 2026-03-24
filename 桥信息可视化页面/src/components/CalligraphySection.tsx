import { useEffect, useRef } from 'react';

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
}

interface CalligraphySectionProps {
  bridges: BridgeData[];
}

const CalligraphySection = ({ bridges }: CalligraphySectionProps) => {
  const calligraphyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 动态笔锋效果
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const texts = entry.target.querySelectorAll('.calligraphy-text');
            texts.forEach((text, index) => {
              setTimeout(() => {
                (text as HTMLElement).classList.add('animate-in');
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (calligraphyRef.current) {
      observer.observe(calligraphyRef.current);
    }

    return () => {
      if (calligraphyRef.current) {
        observer.unobserve(calligraphyRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={calligraphyRef}
      className="py-24 md:py-32 bg-paper-warm/80 border-t border-border"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="font-calligraphy text-4xl md:text-5xl font-bold text-ink mb-4">
            桥韵
          </h2>
          <p className="text-ink-light font-sans-cn text-sm max-w-2xl mx-auto">
            水乡，桥影波光，承载着千年文化的智慧与美学
          </p>
        </div>

        {/* 书法风格桥信息展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bridges.map((bridge, index) => {
            // 为每座桥准备古诗
            let poetry = '';
            let poet = '';
            
            switch (bridge.name) {
              case '通津桥':
                poetry = '红蚕上簇四眠过，金茧成来欲化蛾。\n听道今年丝价好，通津桥口贩船多。';
                poet = '清・曹仁虎';
                break;
              case '双龙桥':
                poetry = '南海之源此半瓢，岸斜烟柳碧丝绦。\n长虹卧看双龙会，楼阁凌驾万象娇。\n云淡淡，水迢迢，匆匆岁月古今潮。\n诗家早已称封号，千里珠江第一桥。';
                poet = '孔祥庚（当代）';
                break;
              case '赵州桥':
                poetry = '驾石飞梁尽一虹，苍龙惊蛰背磨空。\n坦途箭直千人过，驿使驰驱万国通。\n云吐月轮高拱北，雨添春色去朝东。\n休夸世俗遗仙迹，自古神丁役此工。';
                poet = '宋・杜德源';
                break;
              default:
                poetry = '桥影波光映古今，千年风雨见初心。\n行人过客皆如织，唯有长桥识旧音。';
                poet = '佚名';
            }
            
            return (
              <div key={bridge.name} className="bg-paper rounded-sm p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="calligraphy-text opacity-0 transform translate-y-4 transition-all duration-1000 ease-out">
                  <h3 className="font-ancient text-2xl font-medium text-ink mb-4">
                    {bridge.name}
                  </h3>
                  <div className="space-y-4">
                    <div className="writing-mode-vertical-rl h-80 flex items-center justify-center flex-grow">
                      <p className="text-ink font-ancient text-lg md:text-xl leading-relaxed whitespace-pre-line">
                        {poetry}
                      </p>
                    </div>
                    <p className="text-ink-light font-sans-cn text-xs text-right italic">
                      —— {poet}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 书法风格引用 */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <div className="calligraphy-text opacity-0 transform translate-y-4 transition-all duration-1000 ease-out">
            <p className="font-elegant text-2xl md:text-3xl text-ink mb-4 italic">
              "桥如虹，水如空，一叶飘然烟雨中"
            </p>
            <p className="text-ink-light font-sans-cn text-sm">
              —— 桥韵
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalligraphySection;