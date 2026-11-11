import { Button } from "../components/ui/Button";
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
	className = "ui-button ui-button-sm ui-button-ghost",
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
		<Button type="button" className={className} onClick={handleClick}>
			Preview
		</Button>
	);
}
