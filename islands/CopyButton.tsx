import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "fresh/runtime";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  class?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  class: className = "btn btn-sm",
}: CopyButtonProps) {
  const copied = useSignal(false);

  async function handleCopy() {
    if (!IS_BROWSER) return;

    await navigator.clipboard.writeText(value);

    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 1500);
  }

  return (
    <button
      type="button"
      class={className}
      onClick={handleCopy}
    >
      {copied.value ? copiedLabel : label}
    </button>
  );
}
