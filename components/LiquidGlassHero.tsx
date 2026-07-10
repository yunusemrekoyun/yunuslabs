"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./LiquidGlassHero.module.css";

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  lastX: number;
  lastY: number;
  speed: number;
};

const FILTER_ID = "liquid-glass-filter";
const FILTER_PADDING = 72;

function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp(0, (value - edge0) / (edge1 - edge0), 1);
  return x * x * (3 - 2 * x);
}

function roundedRectDistance(x: number, y: number, halfW: number, halfH: number, radius: number) {
  const qx = Math.abs(x) - halfW + radius;
  const qy = Math.abs(y) - halfH + radius;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}

function createDisplacementTexture() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(280 * ratio);
  const height = Math.round(190 * ratio);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return "";
  }

  canvas.width = width;
  canvas.height = height;

  const halfW = width * 0.42;
  const halfH = height * 0.38;
  const radius = Math.min(halfW, halfH) * 0.78;
  const edgeSoftness = 18 * ratio;
  const image = context.createImageData(width, height);
  const pixels = image.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const lx = x - width / 2;
      const ly = y - height / 2;
      const distance = roundedRectDistance(lx, ly, halfW, halfH, radius);
      const mask = 1 - smoothstep(-edgeSoftness, edgeSoftness, distance);

      if (mask <= 0) {
        pixels[i] = 128;
        pixels[i + 1] = 128;
        pixels[i + 2] = 128;
        pixels[i + 3] = 0;
        continue;
      }

      const nx = lx / Math.max(1, halfW);
      const ny = ly / Math.max(1, halfH);
      const edge = smoothstep(-Math.min(halfW, halfH) * 0.62, edgeSoftness, distance);
      const curve = Math.pow(mask, 0.72) * (0.38 + edge * 0.9);
      const ripple = Math.sin(nx * 4.4 - ny * 2.7) * 0.034 * mask;

      pixels[i] = clamp(0, 128 + (nx * curve + ripple) * 118, 255);
      pixels[i + 1] = clamp(0, 128 + (ny * curve - ripple * 0.7) * 118, 255);
      pixels[i + 2] = 128;
      pixels[i + 3] = Math.round(mask * 255);
    }
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

type LiquidGlassHeroProps = {
  children?: ReactNode;
};

export function LiquidGlassHero({ children }: LiquidGlassHeroProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<SVGFilterElement | null>(null);
  const mapRef = useRef<SVGFEImageElement | null>(null);
  const redShiftRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const greenShiftRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blueShiftRef = useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const lens = lensRef.current;
    const cursor = cursorRef.current;
    const filter = filterRef.current;
    const map = mapRef.current;
    const redShift = redShiftRef.current;
    const greenShift = greenShiftRef.current;
    const blueShift = blueShiftRef.current;

    if (!scene || !lens || !cursor || !filter || !map || !redShift || !greenShift || !blueShift) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const supportsSvgBackdropFilter =
      CSS.supports("backdrop-filter", `url(#${FILTER_ID})`) ||
      CSS.supports("-webkit-backdrop-filter", `url(#${FILTER_ID})`);

    if (!supportsSvgBackdropFilter) {
      scene.classList.add(styles.backdropFallback);
    }

    const state: PointerState = {
      x: window.innerWidth * 0.36,
      y: window.innerHeight * 0.39,
      targetX: window.innerWidth * 0.36,
      targetY: window.innerHeight * 0.39,
      lastX: window.innerWidth * 0.36,
      lastY: window.innerHeight * 0.39,
      speed: 0,
    };

    let lensWidth = 150;
    let lensHeight = 104;
    let frameId = 0;
    let isAnimating = false;
    let interactionEnabled = false;
    let textureReady = false;

    const ensureTexture = () => {
      if (textureReady) {
        return;
      }

      const texture = createDisplacementTexture();
      map.setAttribute("href", texture);
      map.setAttributeNS("http://www.w3.org/1999/xlink", "href", texture);
      textureReady = true;
    };

    const syncBounds = () => {
      lensWidth = lens.offsetWidth;
      lensHeight = lens.offsetHeight;

      filter.setAttribute("x", String(-FILTER_PADDING));
      filter.setAttribute("y", String(-FILTER_PADDING));
      filter.setAttribute("width", String(lensWidth + FILTER_PADDING * 2));
      filter.setAttribute("height", String(lensHeight + FILTER_PADDING * 2));
      map.setAttribute("x", "0");
      map.setAttribute("y", "0");
      map.setAttribute("width", String(lensWidth));
      map.setAttribute("height", String(lensHeight));

      const horizontalInset = Math.min(lensWidth / 2, window.innerWidth / 2);
      const verticalInset = Math.min(lensHeight / 2, window.innerHeight / 2);
      const maxX = Math.max(horizontalInset, window.innerWidth - horizontalInset);
      const maxY = Math.max(verticalInset, window.innerHeight - verticalInset);

      state.x = clamp(horizontalInset, state.x, maxX);
      state.y = clamp(verticalInset, state.y, maxY);
      state.targetX = clamp(horizontalInset, state.targetX, maxX);
      state.targetY = clamp(verticalInset, state.targetY, maxY);
      state.lastX = state.targetX;
      state.lastY = state.targetY;
      state.speed = 0;
      startAnimation();
    };

    const startAnimation = () => {
      if (interactionEnabled && !isAnimating) {
        isAnimating = true;
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const moveTo = (event: PointerEvent) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;

      const dx = state.targetX - state.lastX;
      const dy = state.targetY - state.lastY;
      state.speed = Math.min(1, Math.hypot(dx, dy) / 120);
      state.lastX = state.targetX;
      state.lastY = state.targetY;
      startAnimation();
    };

    const animate = () => {
      if (!interactionEnabled) {
        isAnimating = false;
        frameId = 0;
        return;
      }

      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;

      const dx = state.targetX - state.x;
      const dy = state.targetY - state.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = 1 + state.speed * 0.12;
      const activeWidth = lensWidth * (1 + state.speed * 0.1);
      const activeHeight = lensHeight * (1 + state.speed * 0.04);
      const x = state.x - activeWidth / 2;
      const y = state.y - activeHeight / 2;

      lens.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle * 0.04}deg) scale(${stretch})`;
      cursor.style.transform = `translate3d(${state.targetX - 3.5}px, ${state.targetY - 3.5}px, 0)`;

      redShift.setAttribute("scale", (28 + state.speed * 14).toFixed(2));
      greenShift.setAttribute("scale", (24 + state.speed * 12).toFixed(2));
      blueShift.setAttribute("scale", (20 + state.speed * 9).toFixed(2));

      state.speed *= 0.88;
      const remainingDistance = Math.hypot(state.targetX - state.x, state.targetY - state.y);

      if (remainingDistance < 0.08 && state.speed < 0.001) {
        state.x = state.targetX;
        state.y = state.targetY;
        isAnimating = false;
        frameId = 0;
        return;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (interactionEnabled) {
        syncBounds();
      }
    });

    resizeObserver.observe(lens);

    const enableInteraction = () => {
      if (interactionEnabled) {
        return;
      }

      interactionEnabled = true;
      scene.classList.remove(styles.fallback);
      lens.style.removeProperty("display");
      cursor.style.removeProperty("display");
      ensureTexture();
      syncBounds();
      window.addEventListener("pointermove", moveTo, { passive: true });
      window.addEventListener("pointerdown", moveTo, { passive: true });
      window.addEventListener("resize", syncBounds);
      startAnimation();
    };

    const disableInteraction = () => {
      scene.classList.add(styles.fallback);
      lens.style.display = "none";
      cursor.style.display = "none";

      if (!interactionEnabled) {
        return;
      }

      interactionEnabled = false;
      isAnimating = false;
      state.speed = 0;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      window.removeEventListener("pointermove", moveTo);
      window.removeEventListener("pointerdown", moveTo);
      window.removeEventListener("resize", syncBounds);
    };

    const syncInteractionMode = () => {
      if (reducedMotion.matches || coarsePointer.matches) {
        disableInteraction();
      } else {
        enableInteraction();
      }
    };

    reducedMotion.addEventListener("change", syncInteractionMode);
    coarsePointer.addEventListener("change", syncInteractionMode);
    syncInteractionMode();

    return () => {
      disableInteraction();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", syncInteractionMode);
      coarsePointer.removeEventListener("change", syncInteractionMode);
      scene.classList.remove(styles.fallback, styles.backdropFallback);
      lens.style.removeProperty("display");
      cursor.style.removeProperty("display");
    };
  }, []);

  return (
    <>
      <div className={styles.liquidScene} ref={sceneRef}>
        <a className={styles.skipLink} href="#about">
          İçeriğe geç
        </a>
        <svg className={styles.filterDefs} aria-hidden="true" focusable="false">
          <filter
            id={FILTER_ID}
            ref={filterRef}
            x="0"
            y="0"
            width="1600"
            height="1000"
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodColor="rgb(128, 128, 128)" floodOpacity="1" result="NEUTRAL" />
            <feImage
              ref={mapRef}
              x="0"
              y="0"
              width="260"
              height="180"
              preserveAspectRatio="none"
              result="MAP_IMAGE"
            />
            <feComposite in="MAP_IMAGE" in2="NEUTRAL" operator="over" result="DISPLACEMENT_MAP" />
            <feDisplacementMap
              ref={redShiftRef}
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
              result="RED_SHIFT"
            />
            <feColorMatrix
              in="RED_SHIFT"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="RED_CHANNEL"
            />
            <feDisplacementMap
              ref={greenShiftRef}
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
              result="GREEN_SHIFT"
            />
            <feColorMatrix
              in="GREEN_SHIFT"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="GREEN_CHANNEL"
            />
            <feDisplacementMap
              ref={blueShiftRef}
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
              result="BLUE_SHIFT"
            />
            <feColorMatrix
              in="BLUE_SHIFT"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="BLUE_CHANNEL"
            />
            <feBlend in="RED_CHANNEL" in2="GREEN_CHANNEL" mode="screen" result="RG" />
            <feBlend in="RG" in2="BLUE_CHANNEL" mode="screen" />
          </filter>
        </svg>

        <main className={styles.glassStage}>
          <section className={styles.hero} id="hero-scene">
            <h1 className={styles.srOnly}>Yunus Emre Koyun — Full-stack Software Developer</h1>

            <header className={styles.siteHeader} aria-label="Primary navigation">
              <Link className={styles.mark} href="/" aria-label="Ana sayfa" />
              <nav className={styles.nav}>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
                <a href="#experience">Experience</a>
                <a href="#stack">Stack</a>
                <a className={styles.navPill} href="#contact">
                  Contact <span aria-hidden="true">-&gt;</span>
                </a>
              </nav>
            </header>

            <div className={styles.nameBlock} data-motion="parallax scale" aria-hidden="true">
              <span>Yunus</span>
              <span>Emre</span>
              <small>KOYUN / FULL-STACK DEVELOPER</small>
            </div>

            <div className={styles.stamp} data-motion="parallax" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="stampCircle" d="M 100 100 m -74 0 a 74 74 0 1 1 148 0 a 74 74 0 1 1 -148 0" />
                </defs>
                <text fill="currentColor">
                  <textPath href="#stampCircle" startOffset="0">
                    PRODUCT ENGINEERING * SYSTEM DESIGN * FULL STACK *
                  </textPath>
                </text>
                <path fill="currentColor" d="M100 48 L115 83 L152 100 L115 117 L100 152 L85 117 L48 100 L85 83 Z" />
              </svg>
            </div>

            <div className={styles.fineDot} data-motion="parallax" aria-hidden="true" />
            <div className={styles.sideBadge} data-motion="parallax" aria-hidden="true">
              <span>Available</span>
            </div>

            <section className={styles.heroCopy} aria-label="Intro">
              <p>
                Arayüzden veritabanına, sunucudan canlı ortama kadar ürünün tamamıyla ilgileniyorum.
                Sağlam sistemleri, net kullanıcı deneyimleriyle bir araya getiriyorum.
              </p>
            </section>
          </section>
          {children}
        </main>
      </div>

      <div className={styles.liquidLens} aria-hidden="true" ref={lensRef}>
        <span className={styles.lensFill} />
      </div>
      <div className={styles.cursorDot} aria-hidden="true" ref={cursorRef} />
    </>
  );
}
