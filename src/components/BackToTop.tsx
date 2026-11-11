import { Button } from "./ui/Button";
import { Hint } from "./ui/Hint";

export function BackToTop() {
	function scrollToTop() {
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
	}

	return (
		<Hint label="Back to top">
			<Button
				aria-label="Back to top"
				onClick={scrollToTop}
				className="ui-button-primary fixed bottom-6 right-6 z-40 size-12 rounded-full p-0 shadow-lg"
			>
				<svg
					aria-hidden="true"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 19V5m-7 7 7-7 7 7" />
				</svg>
			</Button>
		</Hint>
	);
}
