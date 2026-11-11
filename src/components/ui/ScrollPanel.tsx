import { ScrollArea } from "@ark-ui/react/scroll-area";
import type { ReactNode } from "react";

export function ScrollPanel({
	children,
	label,
	className = "",
}: {
	children: ReactNode;
	label: string;
	className?: string;
}) {
	return (
		<ScrollArea.Root className={`ui-scroll ${className}`}>
			<ScrollArea.Viewport
				tabIndex={0}
				aria-label={label}
				className="ui-scroll-viewport"
			>
				<ScrollArea.Content>{children}</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="vertical" className="ui-scrollbar">
				<ScrollArea.Thumb className="ui-scroll-thumb" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Scrollbar orientation="horizontal" className="ui-scrollbar">
				<ScrollArea.Thumb className="ui-scroll-thumb" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	);
}
