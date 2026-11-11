import { Clipboard } from "@ark-ui/react/clipboard";
import { Hint } from "../components/ui/Hint";

interface CopyButtonProps {
	value: string;
	label?: string;
	copiedLabel?: string;
	className?: string;
}

export default function CopyButton({
	value,
	label = "Copy",
	copiedLabel = "Copied",
	className = "ui-button ui-button-sm",
}: CopyButtonProps) {
	return (
		<Clipboard.Root
			value={value}
			timeout={1500}
			translations={{
				triggerLabel: (copied) => (copied ? copiedLabel : label),
			}}
			asChild
		>
			<span className="inline-flex">
				<Hint label={`Copy ${label.toLowerCase()} to clipboard`}>
					<Clipboard.Trigger className={className}>
						<Clipboard.Indicator copied={copiedLabel} asChild>
							<span aria-live="polite">{label}</span>
						</Clipboard.Indicator>
					</Clipboard.Trigger>
				</Hint>
			</span>
		</Clipboard.Root>
	);
}
