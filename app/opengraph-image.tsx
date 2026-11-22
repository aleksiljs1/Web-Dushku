import { ImageResponse } from "next/og";

export const alt = "Mobileri Dushku · Mobilojmë sipas dëshirës dhe ëndrrave tuaja";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview for WhatsApp, Facebook, Instagram DMs
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #f4eee4 0%, #e8dccb 60%, #e3c9a0 100%)",
          color: "#2a1d14",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#5b3a22", display: "flex" }} />
          Mobileri <span style={{ color: "#b4582b" }}>Dushku</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 600, letterSpacing: -2, maxWidth: 980 }}>
            Mobilojmë sipas dëshirës dhe ëndrrave tuaja.
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#5b3a22" }}>Mobilje me porosi · Montim mobiljesh</div>
        </div>
        <div style={{ display: "flex", height: 18 }}>
          {["#9a6638", "#c08a55", "#5b3a22", "#b47a45", "#7a4e2c", "#d39a63"].map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
