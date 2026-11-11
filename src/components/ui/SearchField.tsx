import { Field } from "@ark-ui/react/field";

export function SearchField({
	value,
	onValueChange,
}: {
	value: string;
	onValueChange: (value: string) => void;
}) {
	return (
		<Field.Root required className="min-w-0 flex-1">
			<Field.Label className="block font-semibold mb-2">
				Icon name or category
			</Field.Label>
			<Field.Input
				type="search"
				className="ui-input w-full"
				placeholder="Try GitHub, Vercel, or cloud"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				maxLength={100}
			/>
		</Field.Root>
	);
}
