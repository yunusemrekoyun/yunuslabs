import Image from "next/image";

/**
 * The YEK monogram from the brand file. yek-logo-mark.png is the original
 * /logo/yek-logo.png with its white padding trimmed and the background made
 * transparent, so it sits cleanly on any surface at any size.
 */
export function YekMark({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{ position: "relative", display: "block", width: "100%", height: "100%" }}
    >
      <Image alt="" fill sizes="160px" src="/logo/yek-logo-mark.png" style={{ objectFit: "contain" }} />
    </span>
  );
}
