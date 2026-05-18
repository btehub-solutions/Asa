import type { AVAILABILITY, PUBLICATION_STATUS } from "./categories";

export type Availability = (typeof AVAILABILITY)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUS)[number];

export type Artwork = {
  id: string;
  title: string;
  slug: string;
  artist_name: string;
  artist_image_url: string | null;
  artist_bio: string | null;
  artist_quote: string | null;
  cultural_roots: string | null;
  artist_story: string | null;
  nationality: string | null;
  city_base: string | null;
  year_active: string | null;
  image_url: string;
  extra_image_urls: string[];
  medium: string;
  year_created: string | null;
  dimensions: string | null;
  categories: string[];
  price: number | null;
  availability: Availability;
  cultural_significance: string | null;
  piece_story: string | null;
  yoruba_connection: string | null;
  tags: string[];
  commission_rate: number | null;
  admin_notes: string | null;
  publication_status: PublicationStatus;
  created_at: string;
  updated_at: string;
};

export type JoinApplication = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  style: string | null;
  instagram: string | null;
  website: string | null;
  commission: string | null;
  message: string;
  created_at: string;
};
