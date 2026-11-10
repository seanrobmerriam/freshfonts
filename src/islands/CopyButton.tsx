import { useEffect, useRef, useState } from "react";

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
	className = "btn btn-sm",
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);

	async function handleCopy() {
		if (typeof navigator === "undefined") return;

		try {
			await navigator.clipboard.writeText(value);
		} catch {
			return;
		}

		setCopied(true);
		clearTimeout(timer.current);

		timer.current = setTimeout(() => {
			setCopied(false);
		}, 1500);
	}

	return (
		<button type="button" className={className} onClick={handleCopy}>
			{copied ? copiedLabel : label}
		</button>
	);
}
