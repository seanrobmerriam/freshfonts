import { useFontPreview } from "./fontPreviewState";

interface FontPreviewButtonProps {
	slug: string;
	family: string;
	weights: number[];
	className?: string;
}

export default function FontPreviewButton({
	slug,
	family,
	weights,
	className = "btn btn-sm btn-ghost",
}: FontPreviewButtonProps) {
	const { selectFont } = useFontPreview();
	function handleClick() {
		selectFont({
			slug,
			family,
			weights,
		});
	}

	return (
		<button type="button" className={className} onClick={handleClick}>
			Preview
		</button>
	);
}
