import { ark } from "@ark-ui/react/factory";
import type { ComponentProps } from "react";

export function Button({
	className = "",
	...props
}: ComponentProps<typeof ark.button>) {
	return (
		<ark.button type="button" {...props} className={`ui-button ${className}`} />
	);
}
