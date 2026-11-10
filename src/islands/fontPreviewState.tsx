import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export interface FontPreviewSelection {
	slug: string;
	family: string;
	weights: number[];
}

const FontPreviewContext = createContext<{
	selectedFont: FontPreviewSelection | null;
	selectFont: (font: FontPreviewSelection) => void;
} | null>(null);

export function FontPreviewProvider({ children }: { children: ReactNode }) {
	const [selectedFont, selectFont] = useState<FontPreviewSelection | null>(
		null,
	);
	return (
		<FontPreviewContext.Provider value={{ selectedFont, selectFont }}>
			{children}
		</FontPreviewContext.Provider>
	);
}

export function useFontPreview() {
	const context = useContext(FontPreviewContext);
	if (!context) throw new Error("FontPreviewProvider is required");
	return context;
}
