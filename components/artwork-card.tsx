import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artwork/${artwork.slug || artwork.id}`} className="panel card-hover" style={{ display: "block", overflow: "hidden" }}>
      <div style={{ aspectRatio: "4 / 5", background: "var(--panel-2)", overflow: "hidden", position: "relative" }}>
        <Image src={artwork.image_url} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 320px" style={{ objectFit: "contain" }} />
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <h3 className="serif" style={{ margin: 0, color: "var(--cream)", fontSize: 18, fontWeight: 400 }}>{artwork.title}</h3>
          <span style={{ color: "var(--gold-light)", whiteSpace: "nowrap", fontWeight: 600 }}>{formatPrice(artwork.price)}</span>
        </div>
        <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: 13 }}>
          {artwork.artist_name}{artwork.year_created ? `, ${artwork.year_created}` : ""}
        </p>
        {artwork.categories[0] ? (
          <p style={{ color: "var(--gold)", margin: "0.55rem 0 0", fontSize: 12 }}>
            {artwork.categories[0]}{artwork.categories.length > 1 ? ` +${artwork.categories.length - 1}` : ""}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
