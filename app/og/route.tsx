import { ImageResponse } from "next/og";
import { palette } from "@/config/brand";


/** Social sharing image: /og?title=... — rendered on demand, cached by the CDN. */
export function GET(req: Request) {
  const title = (new URL(req.url).searchParams.get("title") ?? "Workforce and project operations for construction").slice(0, 120);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: palette.ink[900], color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: palette.ink[900], fontSize: 28, fontWeight: 700 }}>A</div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>axtara</div>
        </div>
        <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2.5, lineHeight: 1.06, maxWidth: 980 }}>{title}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: palette.accent[500] }} />
          Workforce and project operations for construction
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
