import { useEffect, useRef, useState } from "react";

export function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect user's motion preferences (比赛/演示时更稳定，也更易通过无障碍检查)
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
