import { Portal } from "@ark-ui/react/portal";
import { createListCollection, Select } from "@ark-ui/react/select";
import { useMemo } from "react";

interface VariantSelectProps {
	label: string;
	variants: string[];
	value: string;
	disabled?: boolean;
	onValueChange: (value: string) => void;
}

export function VariantSelect({
	label,
	variants,
	value,
	disabled,
	onValueChange,
}: VariantSelectProps) {
	const collection = useMemo(
		() =>
			createListCollection({
				items: variants.map((variant) => ({
					value: variant,
					label: variant.replace(/([a-z])([A-Z])/g, "$1 $2"),
				})),
			}),
		[variants],
	);
	return (
		<Select.Root
			collection={collection}
			value={[value]}
			disabled={disabled}
			onValueChange={(details) => {
				if (details.value[0]) onValueChange(details.value[0]);
			}}
			className="mt-2"
		>
			<Select.Label className="block text-sm mb-2">{label}</Select.Label>
			<Select.Control>
				<Select.Trigger className="ui-input ui-select-trigger">
					<Select.ValueText />
					<Select.Indicator aria-hidden="true">⌄</Select.Indicator>
				</Select.Trigger>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content className="ui-select-content">
						{collection.items.map((item) => (
							<Select.Item
								key={item.value}
								item={item}
								className="ui-select-item"
							>
								<Select.ItemText>{item.label}</Select.ItemText>
								<Select.ItemIndicator>✓</Select.ItemIndicator>
							</Select.Item>
						))}
					</Select.Content>
				</Select.Positioner>
			</Portal>
			<Select.HiddenSelect />
		</Select.Root>
	);
}
