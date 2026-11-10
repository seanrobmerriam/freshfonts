import type { ReactNode } from "react";

export interface MockupProps {
	url?: string;
	content?: ReactNode;
}

export function BrowserMockup(props: MockupProps) {
	return (
		<div className="mockup-browser border border-base-300 bg-base-200 w-full max-w-5xl mx-auto">
			<div className="mockup-browser-toolbar">
				<div className="input">{props.url ?? "https://font.preview"}</div>
			</div>
			<div className="grid place-content-center border-t border-base-300 h-80">
				{props.content ?? "Hello!"}
			</div>
		</div>
	);
}
