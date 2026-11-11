import { Progress } from "@ark-ui/react/progress";

export function Spinner({ label = "Loading" }: { label?: string }) {
	return (
		<Progress.Root value={null} aria-label={label} className="ui-spinner">
			<Progress.Circle>
				<Progress.CircleTrack />
				<Progress.CircleRange />
			</Progress.Circle>
		</Progress.Root>
	);
}
