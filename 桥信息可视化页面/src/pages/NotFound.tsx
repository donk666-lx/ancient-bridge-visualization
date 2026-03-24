import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="font-serif-cn text-4xl md:text-5xl font-bold text-ink mb-4">
        页面不存在
      </h1>
      <p className="text-muted-foreground max-w-xl leading-relaxed mb-8">
        你访问的页面不存在。回到首页继续浏览古代桥梁介绍吧。
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-accent-foreground font-medium hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFound;

