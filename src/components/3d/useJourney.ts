/* Scroll → journey progress. GSAP ScrollTrigger (scrub) drives a ref that the
   R3F frame loop reads, so no React re-renders happen per scroll tick. */

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bandFor } from "./journey";

gsap.registerPlugin(ScrollTrigger);

export type Quality = {
  mobile: boolean;
  reduced: boolean;
  dpr: [number, number];
  particles: number;
  shadows: boolean;
};

export function detectQuality(): Quality {
  if (typeof window === "undefined") {
    return { mobile: false, reduced: false, dpr: [1, 1.5], particles: 220, shadows: false };
  }
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    mobile,
    reduced,
    dpr: mobile ? [1, 1.25] : [1, 1.6],
    particles: reduced ? 60 : mobile ? 90 : 240,
    shadows: false,
  };
}

/** Returns a ref holding the master journey parameter (0..1). */
export function useJourneyProgress() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    const [start, end] = bandFor(pathname);
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 8 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      target.current = start + p * (end - start);
    };
    compute();
    t.current = target.current;

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        target.current = start + self.progress * (end - start);
      },
    });

    const onScroll = () => compute();
    const refresh = () => st.refresh();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refresh);
    const timer = window.setTimeout(refresh, 700);

    return () => {
      st.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refresh);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return { t, target };
}
