import { z } from "zod";
import { CATEGORIES } from "./categories";

const categorySet = new Set<string>(CATEGORIES);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export const categoryArraySchema = z.array(
  z.string()
    .trim()
    .min(1)
    .max(80)
    .refine((value) => categorySet.has(value) || value.startsWith("Others: "), "Unknown category.")
).min(1).max(12);

export const tagArraySchema = z.array(
  z.string().trim().min(1).max(60)
).max(20);

export const stringArrayFromForm = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fall through to comma-separated parsing for legacy form values.
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}, z.array(z.string().trim().min(1).max(80)).max(20));

export const optionalNullableString = z.preprocess((value) => {
  if (value === "") return null;
  return value;
}, z.string().max(4000).nullable().optional());

export const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value == null) return null;
  return value;
}, z.coerce.number().finite().nullable().optional());

export function validateImageFile(file: File, label = "image") {
  if (!allowedImageTypes.has(file.type)) {
    return `${label} must be a JPEG, PNG, WebP, or GIF image.`;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return `${label} must be 8 MB or smaller.`;
  }

  return null;
}
