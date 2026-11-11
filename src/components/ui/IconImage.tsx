import { Avatar } from "@ark-ui/react/avatar";

export function IconImage({
	src,
	alt,
	className = "",
	imageClassName = "",
}: {
	src: string;
	alt: string;
	className?: string;
	imageClassName?: string;
}) {
	return (
		<Avatar.Root className={`ui-icon-image ${className}`} key={src}>
			<Avatar.Fallback className="ui-icon-fallback text-xs opacity-60">
				SVG
			</Avatar.Fallback>
			<Avatar.Image
				src={src}
				alt={alt}
				loading="lazy"
				hidden={false}
				className={`object-contain ${imageClassName}`}
			/>
		</Avatar.Root>
	);
}
