/* Scroll progress hook: GSAP ScrollTrigger drives a shared ref consumed by the R3F loop */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollProgress = () => {
  const progress = useRef(0); // 0..1 over the whole page

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    const refresh = () => st.refresh();
    window.addEventListener("resize", refresh);
    // content images/fonts can change page height
    const t = window.setTimeout(refresh, 800);
    return () => {
      st.kill();
      window.removeEventListener("resize", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return progress;
};
