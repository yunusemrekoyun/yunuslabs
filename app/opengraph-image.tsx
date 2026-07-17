import { ImageResponse } from "next/og";

export const alt = "Yunus Emre Koyun — Full-stack Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f8f7f2",
          backgroundImage:
            "linear-gradient(rgba(5,5,5,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(5,5,5,.055) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#050505",
          padding: "58px 66px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 58,
            right: 66,
            width: 84,
            height: 84,
            display: "flex",
            transform: "rotate(45deg)",
            background: "#050505",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 126 }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: ".12em" }}>PORTFOLIO / 2026</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#438e89" }}>KÜTAHYA, TR</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 34 }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 126,
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: 0.84,
                letterSpacing: "-.055em",
              }}
            >
              Yunus Emre
            </span>
            <span
              style={{
                marginLeft: 184,
                fontFamily: "Georgia, serif",
                fontSize: 126,
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-.055em",
                color: "#58bbb4",
              }}
            >
              Koyun.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(5,5,5,.22)",
              paddingTop: 24,
            }}
          >
            <span style={{ maxWidth: 650, fontSize: 24, fontWeight: 600, lineHeight: 1.35 }}>
              Ürün arayüzlerinden backend mimarisine ve canlı ortama kadar uçtan uca geliştirme.
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".08em" }}>FULL-STACK DEVELOPER</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
