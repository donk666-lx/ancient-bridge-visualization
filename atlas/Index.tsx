import HeroSection from "@/components/HeroSection";
import BridgeSection from "@/components/BridgeSection";
import ComparisonSection from "@/components/ComparisonSection";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

import tongjinImg from "@/assets/tongjin-bridge.jpg";
import shuanglongImg from "@/assets/shuanglong-bridge.jpg";
import zhaozhouImg from "@/assets/zhaozhou-bridge.jpg";

const bridgesData = [
  {
    name: "通津桥",
    subtitle: "南浔第一桥 · 浙江省文物保护单位",
    location: "浙江湖州南浔",
    era: "宋代始建",
    builder: "时敏主持重建",
    length: "28",
    width: "4",
    height: "7.6",
    type: "单孔石拱桥",
    image: tongjinImg,
    description:
      `通津桥原名"浔溪桥"，俗称"大桥"，跨越荻塘分水，是南浔古镇三大古桥之首。自南宋起至20世纪七八十年代，通津桥一带是南浔镇中心，是南浔过頔塘往黄浦江通道上的重要桥梁。`,
    structure:
      `拱券石采用纵联分节并列砌置法，上覆券睑石，金刚墙为靴钉式砌筑。肩墙中有两对系石加固外伸，其中一对系梁端首雕刻为吞水兽。桥侧置护栏间嵌方形望柱，桥台两侧设吴王靠式供行人坐憩。桥额阳刻楷书"重建通津桥"。`,
    culture:
      `明清时期南浔丝市盛况空前，通津桥畔成为"辑里湖丝"集散中心。近代，湖丝从通津桥堍运丝上船，经水路运往上海销往海内外。当时俗语云："湖州一个城，不如南浔半个镇"。董恂《南浔十景》中第五景"通津霁雪"——雪后初晴，太阳照在错落有致的古建筑上，与通津桥氤氲成一幅素雅的丹青水墨画。`,
    protection: "2017年作为頔塘故道双桥的组成部分被列为浙江省第七批省级文物保护单位",
    features: ["纵联分节并列砌置", "靴钉式砌筑", "吴王靠式", "阳刻楷书桥额"],
    index: 0,
  },
  {
    name: "双龙桥",
    subtitle: "十七孔桥 · 全国重点文物保护单位",
    location: "云南建水西庄镇",
    era: "清乾隆年间始建",
    builder: "地方官民集资",
    length: "148",
    width: "3.5",
    height: "20",
    type: "十七孔石拱廊桥",
    image: shuanglongImg,
    description:
      `双龙桥俗称"十七孔桥"，跨泸江河与塌冲河交汇处。清乾隆年间始建三孔石桥，后因河床加宽，道光十九年（1839年）续建十四孔，首尾相连合为一体。桥身用约500块石块镶砌，融桥梁建筑科学和造型艺术为一体，在中国桥梁史上占有重要地位。`,
    structure:
      `桥上建有三座飞檐式阁楼，中间一楼蔚为壮观，层垒为三，高约20米，方形三重檐歇山顶，琉璃黄瓦。顶层建小楼一楹三间，呈"山"字形排列，顶檐分解为"品"字状三个歇山小顶。桥墩上游端均为尖形以分水减力，下游端均为方形，拱碹均系半圆形纵联式结构。`,
    culture:
      `"双龙"之名取自泸江与塌冲河两条河流交汇，寓意镇锁双龙、安澜太平。远看犹如一艘楼船，近观似长虹卧波。1965年桥梁专家茅以升前来考察，将其列为全国大型古桥之一。建水为多民族聚居地，桥梁的修建促进了哈尼族、彝族、汉族等民族的商贸与文化交流。`,
    protection: "2006年被国务院公布为第六批全国重点文物保护单位",
    features: ["十七孔联拱", "三座飞檐阁楼", "船形桥墩分水", "纵联式拱碹", "楼中有楼檐外有檐"],
    index: 1,
  },
  {
    name: "赵州桥",
    subtitle: "世界最早敞肩石拱桥 · 全国重点文物保护单位",
    location: "河北赵县",
    era: "隋代（约605年）",
    builder: "李春",
    length: "50.82",
    width: "9.6",
    height: "7.23",
    type: "单孔坦弧敞肩石拱桥",
    image: zhaozhouImg,
    description:
      `赵州桥由著名匠师李春设计建造，距今已有1400余年，是世界上现存年代最久远、跨度最大、保存最完整的单孔坦弧敞肩石拱桥。由28道石拱圈纵向并列砌筑而成，首创"敞肩拱"设计，比欧洲同类桥梁早了1200多年。`,
    structure:
      `全桥1个大拱4个小拱，大拱弧形桥洞由28道拱圈拼成。每道拱圈都能独立支撑上方重量，避免一道拱圈受损影响其它。敞肩拱设计可节省石料260立方米，减轻自身重量700吨。桥面按"中间行车马、两旁走行人"理念设计。`,
    culture:
      `民间传说赵州桥是鲁班一夜修成，张果老骑着驴、褡裢装太阳月亮，柴王推车载五岳名山，两人上桥试其坚固。唐朝张鷟赞曰"望之如初月出云，长虹引涧"。河北民间将赵州桥与沧州铁狮子、定州开元寺塔、正定隆兴寺菩萨像并称"华北四宝"。`,
    protection: "入选世界纪录协会世界最早的敞肩石拱桥",
    features: ["敞肩拱设计", "28道拱圈并列", "坦弧设计", "独立承重拱圈", "比欧洲早1200年"],
    index: 2,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      {/* Divider */}
      <div className="flex items-center justify-center py-16">
        <div className="w-16 h-px bg-border" />
        <span className="mx-4 text-xs tracking-[0.3em] text-muted-foreground font-sans-cn">三桥志</span>
        <div className="w-16 h-px bg-border" />
      </div>

      {bridgesData.map((bridge) => (
        <BridgeSection key={bridge.name} bridge={bridge} />
      ))}

      <ComparisonSection />
      <FooterSection />
    </div>
  );
};

export default Index;
