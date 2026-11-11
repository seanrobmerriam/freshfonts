import type { ReactNode } from "react";

export interface MockupProps {
	url?: string;
	content?: ReactNode;
}

export function BrowserMockup(props: MockupProps) {
	return (
		<div className="browser-frame border border-line bg-subtle w-full max-w-5xl mx-auto">
			<div className="browser-toolbar">
				<div className="browser-address">
					{props.url ?? "https://font.preview"}
				</div>
			</div>
			<div className="grid place-content-center border-t border-line h-80">
				{props.content ?? "Hello!"}
			</div>
		</div>
	);
}
