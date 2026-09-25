import { signal } from "@preact/signals";

export interface FontPreviewSelection {
  slug: string;
  family: string;
  weights: number[];
}

export const selectedFont = signal<FontPreviewSelection | null>(null);