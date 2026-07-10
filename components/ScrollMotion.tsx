"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const MOTION_SELECTOR = "[data-motion]";

type MotionTarget = {
  element: HTMLElement;
  height: number;
  index: number;
  tokens: Set<string>;
  top: number;
};

type MotionState = {
  clip: number;
  opacity: number;
  progress: number;
  scale: number;
  x: number;
  y: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
}

function getDocumentTop(element: HTMLElement) {
  let node: HTMLElement | null = element;
  let top = 0;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return top;
}

function calculateMotion(
  target: MotionTarget,
  scrollY: number,
  viewportHeight: number,
  compact: boolean,
): MotionState {
  const viewportTop = target.top - scrollY;
  const progress = clamp((viewportHeight - viewportTop) / (viewportHeight + target.height));
  const enter = smoothstep(0.03 + target.index * 0.008, 0.31 + target.index * 0.008, progress);
  const centered = clamp((progress - 0.5) * 2, -1, 1);
  const focus = 1 - Math.min(1, Math.abs(centered));
  const revealDistance = compact ? 20 : 38;
  const parallaxDistance = compact ? 14 : 30;
  let x = 0;
  let y = 0;
  let scale = 1;
  let opacity = 1;

  if (target.tokens.has("reveal")) {
    opacity = 0.08 + enter * 0.92;
    y += (1 - enter) * revealDistance;
  }

  if (target.tokens.has("slide")) {
    const direction = target.index % 2 === 0 ? -1 : 1;
    x += (1 - enter) * revealDistance * direction;
  }

  if (target.tokens.has("parallax")) {
    y += centered * -parallaxDistance;
  }

  if (target.tokens.has("scale")) {
    scale = (compact ? 0.985 : 0.965) + enter * (compact ? 0.015 : 0.035) + focus * 0.008;
  }

  return {
    clip: (1 - enter) * 100,
    opacity,
    progress,
    scale,
    x,
    y,
  };
}

function writeMotion(target: MotionTarget, state: MotionState) {
  target.element.style.setProperty("--motion-x", `${state.x.toFixed(2)}px`);
  target.element.style.setProperty("--motion-y", `${state.y.toFixed(2)}px`);
  target.element.style.setProperty("--motion-scale", state.scale.toFixed(4));
  target.element.style.setProperty("--motion-opacity", state.opacity.toFixed(4));
  target.element.style.setProperty("--motion-clip", `${state.clip.toFixed(2)}%`);
  target.element.style.setProperty("--motion-progress", state.progress.toFixed(4));
}

function clearMotion(element: HTMLElement) {
  element.classList.remove("motion-active");
  element.style.removeProperty("--motion-x");
  element.style.removeProperty("--motion-y");
  element.style.removeProperty("--motion-scale");
  element.style.removeProperty("--motion-opacity");
  element.style.removeProperty("--motion-clip");
  element.style.removeProperty("--motion-progress");
}

export function ScrollMotion() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const progressBar = progressRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(MOTION_SELECTOR));
    const targets: MotionTarget[] = elements.map((element) => ({
      element,
      height: Math.max(1, element.offsetHeight),
      index: clamp(Number(element.dataset.motionIndex) || 0, 0, 12),
      tokens: new Set((element.dataset.motion ?? "").split(/\s+/).filter(Boolean)),
      top: getDocumentTop(element),
    }));
    const targetByElement = new Map(targets.map((target) => [target.element, target]));
    const activeTargets = new Set<MotionTarget>();
    const pendingTargets = new Set<MotionTarget>();
    let frameId = 0;
    let settleTimer = 0;
    let forceAll = true;
    let needsMeasurement = false;
    let runtimeActive = false;
    let lastScrollY = window.scrollY;
    let lastFrameTime = performance.now();

    const render = (frameTime = performance.now()) => {
      frameId = 0;

      if (needsMeasurement) {
        const measurements = targets.map((target) => ({
          height: Math.max(1, target.element.offsetHeight),
          target,
          top: getDocumentTop(target.element),
        }));

        measurements.forEach(({ height, target, top }) => {
          target.height = height;
          target.top = top;
        });

        needsMeasurement = false;
        forceAll = true;
      }

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      const elapsed = clamp(frameTime - lastFrameTime || 16.67, 8, 64);
      const viewportHeight = window.innerHeight;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      const pageProgress = clamp(scrollY / scrollRange);
      const velocity = clamp(Math.abs(scrollDelta) / (elapsed * 2.8));

      root.style.setProperty("--page-scroll", pageProgress.toFixed(5));
      root.style.setProperty("--scroll-velocity", velocity.toFixed(4));

      if (Math.abs(scrollDelta) > 0.5) {
        root.dataset.scrollDirection = scrollDelta > 0 ? "down" : "up";
      }

      if (progressBar) {
        progressBar.style.transform = `scaleX(${pageProgress.toFixed(5)})`;
        progressBar.style.opacity = String(0.72 + velocity * 0.28);
      }

      if (settleTimer) {
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      }

      if (velocity > 0) {
        settleTimer = window.setTimeout(() => {
          settleTimer = 0;
          root.style.setProperty("--scroll-velocity", "0");

          if (progressBar) {
            progressBar.style.opacity = "0.72";
          }
        }, 140);
      }

      if (!motionPreference.matches) {
        const renderTargets = forceAll
          ? targets
          : Array.from(new Set([...activeTargets, ...pendingTargets]));
        const compact = window.innerWidth < 760 || coarsePointer.matches;
        const states = renderTargets.map((target) => ({
          state: calculateMotion(target, scrollY, viewportHeight, compact),
          target,
        }));

        states.forEach(({ state, target }) => writeMotion(target, state));
      }

      forceAll = false;
      pendingTargets.clear();
      lastScrollY = scrollY;
      lastFrameTime = frameTime;
    };

    const requestRender = () => {
      if (!motionPreference.matches && !frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const requestMeasurement = () => {
      needsMeasurement = true;
      requestRender();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = targetByElement.get(entry.target as HTMLElement);

          if (!target) {
            return;
          }

          if (entry.isIntersecting) {
            activeTargets.add(target);
            target.element.classList.add("motion-active");
          } else {
            activeTargets.delete(target);
            pendingTargets.add(target);
            target.element.classList.remove("motion-active");
          }
        });

        requestRender();
      },
      { rootMargin: "14% 0px 14% 0px", threshold: [0, 0.01, 1] },
    );

    const syncTargets = (layoutChanged = false) => {
      let changed = false;

      for (let index = targets.length - 1; index >= 0; index -= 1) {
        const target = targets[index];

        if (!target.element.isConnected || !target.element.matches(MOTION_SELECTOR)) {
          observer.unobserve(target.element);
          activeTargets.delete(target);
          pendingTargets.delete(target);
          targetByElement.delete(target.element);
          targets.splice(index, 1);
          clearMotion(target.element);
          changed = true;
          continue;
        }

        const nextIndex = clamp(Number(target.element.dataset.motionIndex) || 0, 0, 12);
        const nextTokens = (target.element.dataset.motion ?? "").split(/\s+/).filter(Boolean);

        if (target.index !== nextIndex || Array.from(target.tokens).join(" ") !== nextTokens.join(" ")) {
          target.index = nextIndex;
          target.tokens = new Set(nextTokens);
          changed = true;
        }
      }

      document.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((element) => {
        if (targetByElement.has(element)) {
          return;
        }

        const target: MotionTarget = {
          element,
          height: Math.max(1, element.offsetHeight),
          index: clamp(Number(element.dataset.motionIndex) || 0, 0, 12),
          tokens: new Set((element.dataset.motion ?? "").split(/\s+/).filter(Boolean)),
          top: getDocumentTop(element),
        };

        targets.push(target);
        targetByElement.set(element, target);
        pendingTargets.add(target);

        if (runtimeActive) {
          observer.observe(element);
        }

        changed = true;
      });

      if (changed || layoutChanged) {
        needsMeasurement = true;
        forceAll = true;
        requestRender();
      }
    };

    const mutationObserver = new MutationObserver((mutations) => {
      syncTargets(mutations.some((mutation) => mutation.type === "childList"));
    });
    const layoutObserver = new ResizeObserver(requestMeasurement);

    const enableRuntime = () => {
      if (runtimeActive) {
        return;
      }

      runtimeActive = true;
      syncTargets();
      targets.forEach((target) => observer.observe(target.element));
      mutationObserver.observe(document.body, {
        attributeFilter: ["data-motion", "data-motion-index"],
        attributes: true,
        childList: true,
        subtree: true,
      });
      layoutObserver.observe(document.body);
      window.addEventListener("scroll", requestRender, { passive: true });
      window.addEventListener("resize", requestMeasurement, { passive: true });
      coarsePointer.addEventListener("change", requestMeasurement);
    };

    const disableRuntime = () => {
      if (!runtimeActive) {
        return;
      }

      runtimeActive = false;
      observer.disconnect();
      mutationObserver.disconnect();
      layoutObserver.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestMeasurement);
      coarsePointer.removeEventListener("change", requestMeasurement);
      activeTargets.forEach((target) => target.element.classList.remove("motion-active"));
      activeTargets.clear();
      pendingTargets.clear();
    };

    const syncMotionPreference = () => {
      const enhanced = !motionPreference.matches;
      root.dataset.motionMode = enhanced ? "enhanced" : "reduced";
      forceAll = true;

      if (enhanced) {
        enableRuntime();

        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }

        lastScrollY = window.scrollY;
        lastFrameTime = performance.now();
        render(lastFrameTime);
        root.classList.add("motion-ready");
      } else {
        root.classList.remove("motion-ready");
        disableRuntime();

        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }

        if (settleTimer) {
          window.clearTimeout(settleTimer);
          settleTimer = 0;
        }

        root.style.setProperty("--scroll-velocity", "0");

        if (progressBar) {
          progressBar.style.opacity = "0.72";
        }
      }
    };

    motionPreference.addEventListener("change", syncMotionPreference);
    syncMotionPreference();
    requestRender();

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }

      disableRuntime();
      motionPreference.removeEventListener("change", syncMotionPreference);
      root.classList.remove("motion-ready");
      delete root.dataset.motionMode;
      delete root.dataset.scrollDirection;
      root.style.removeProperty("--page-scroll");
      root.style.removeProperty("--scroll-velocity");

      if (progressBar) {
        progressBar.style.removeProperty("transform");
        progressBar.style.removeProperty("opacity");
      }

      targets.forEach(({ element }) => clearMotion(element));
    };
  }, [pathname]);

  return (
    <div className="motion-progress-track" aria-hidden="true">
      <div className="motion-progress-bar" ref={progressRef} />
    </div>
  );
}
