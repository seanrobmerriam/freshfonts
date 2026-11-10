export type FontStyle = "normal" | "italic";

export interface FontVariant {
	weight: number;
	style: FontStyle;
	file: string;
}

export interface FontFamily {
	slug: string;
	family: string;
	variants: FontVariant[];
}
