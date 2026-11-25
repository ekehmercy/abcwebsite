import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { palette } from "@/config/brand";

const logo = `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public/brand/axtara-logo-light.png")).toString("base64")}`;


/** Social sharing image: /og?title=... — rendered on demand, cached by the CDN. */
export function GET(req: Request) {
  const title = (new URL(req.url).searchParams.get("title") ?? "Workforce and project operations for construction").slice(0, 120);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: palette.ink[900], color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} height={52} width={198} alt="Axtara" />
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
