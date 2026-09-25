import type { ComponentChildren } from "preact";

export interface MockupProps {
  url?: string;
  content?: ComponentChildren;
}

export function BrowserMockup(props: MockupProps) {
  return (
    <div class="mockup-browser border border-base-300 bg-base-200 w-full max-w-5xl mx-auto">
      <div class="mockup-browser-toolbar">
        <div class="input">
          {props.url ?? "https://font.preview"}
        </div>
      </div>
      <div class="grid place-content-center border-t border-base-300 h-80">
        {props.content ?? "Hello!"}
      </div>
    </div>
  );
}
