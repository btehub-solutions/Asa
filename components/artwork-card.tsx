import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artwork/${artwork.slug || artwork.id}`} className="gallery-card">
      <div className="gallery-card-frame">
        <Image src={artwork.image_url} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 320px" style={{ objectFit: "contain" }} />
      </div>
      <div className="gallery-card-label">
        <p style={{ margin: "0 0 0.3rem", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          {artwork.artist_name}{artwork.nationality ? ` | ${artwork.nationality}` : (artwork.city_base ? ` | ${artwork.city_base}` : "")}
        </p>
        <h3 className="serif" style={{ margin: "0 0 0.4rem", color: "var(--cream)", fontSize: 18, fontWeight: 400, lineHeight: 1.2 }}>
          {artwork.title}
        </h3>
        <p style={{ margin: 0, color: "var(--cream)", fontSize: 14 }}>
          {formatPrice(artwork.price)}
        </p>
        <span className="gallery-card-cta">View artwork →</span>
      </div>
    </Link>
  );
}
