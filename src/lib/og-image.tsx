import { ImageResponse } from "next/og";

import { PROFILE } from "@/lib/llms";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export type OgImageOptions = {
  title: string;
  subtitle?: string;
  description: string;
  label?: string;
  tags?: string[];
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function createOgImage({
  title,
  subtitle,
  description,
  label,
  tags = [],
}: OgImageOptions) {
  const visibleTags = tags.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            {label ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#d4d4d8",
                }}
              >
                {label}
              </div>
            ) : (
              <div />
            )}
            {!subtitle ? (
              <div
                style={{
                  fontSize: 22,
                  color: "#a1a1aa",
                  letterSpacing: "0.02em",
                }}
              >
                {PROFILE.name}
              </div>
            ) : (
              <div />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                maxWidth: 980,
              }}
            >
              {truncate(title, 72)}
            </div>
            {subtitle ? (
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#e4e4e7",
                  maxWidth: 980,
                }}
              >
                {subtitle}
              </div>
            ) : null}
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.45,
                color: "#d4d4d8",
                maxWidth: 920,
              }}
            >
              {truncate(description, 140)}
            </div>
          </div>

          {visibleTags.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {visibleTags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    fontSize: 20,
                    color: "#e4e4e7",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 24,
            color: "#a1a1aa",
          }}
        >
          <div>{PROFILE.title}</div>
          <div>Data · AI · Production ML</div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE
  );
}
