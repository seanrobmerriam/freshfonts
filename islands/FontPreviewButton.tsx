import { selectedFont } from "./fontPreviewState.ts";

interface FontPreviewButtonProps {
  slug: string;
  family: string;
  weights: number[];
  class?: string;
}

export default function FontPreviewButton({
  slug,
  family,
  weights,
  class: className = "btn btn-sm btn-ghost",
}: FontPreviewButtonProps) {
  function handleClick() {
    selectedFont.value = {
      slug,
      family,
      weights,
    };
  }

  return (
    <button
      type="button"
      class={className}
      onClick={handleClick}
    >
      Preview
    </button>
  );
}