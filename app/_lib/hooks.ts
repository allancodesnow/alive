"use client";
import { useState, useEffect, useRef, useCallback, type RefObject } from "react";

/** Returns true when the element is visible in the viewport */
export function useVisibility(ref: RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return isVisible;
}

/** Returns true when user prefers reduced motion */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** Debounced callback — resets timer on each call */
export function useDebouncedCallback<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]) as unknown as T;
}
