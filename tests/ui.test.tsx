import { afterEach, expect, mock, spyOn, test } from "bun:test";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { IconImage } from "../src/components/ui/IconImage";
import { DownloadSvg } from "../src/components/ui/DownloadSvg";
import { SearchField } from "../src/components/ui/SearchField";
import { VariantSelect } from "../src/components/ui/VariantSelect";
import CopyButton from "../src/islands/CopyButton";
import FontPreviewButton from "../src/islands/FontPreviewButton";
import { FontPreviewProvider, useFontPreview } from "../src/islands/fontPreviewState";

afterEach(() => { cleanup(); mock.restore(); });

test("clipboard copies the supplied value and announces success", async () => {
  const user = userEvent.setup();
  const copied: string[] = [];
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value: string) => { copied.push(value); } } });
  const view = render(<CopyButton value="<link rel=stylesheet>" label="Embed" />);
  await user.click(view.getByRole("button", { name: "Embed" }));
  await waitFor(() => expect(view.getByRole("button", { name: "Copied" })).toBeDefined());
  expect(copied).toEqual(["<link rel=stylesheet>"]);
});

test("variant selection supports keyboard navigation and reports the chosen variant", async () => {
  function Example() {
    const [value, setValue] = useState("default");
    return <VariantSelect label="Variant for GitHub" variants={["default", "dark"]} value={value} onValueChange={setValue} />;
  }
  const user = userEvent.setup();
  const view = render(<Example />);
  await user.click(view.getByRole("combobox", { name: "Variant for GitHub" }));
  await user.keyboard("{End}{Enter}");
  await waitFor(() => expect(view.getByRole("combobox").textContent).toContain("dark"));
});

test("search field exposes its label and updates typed values", async () => {
  function Example() {
    const [value, setValue] = useState("");
    return <SearchField value={value} onValueChange={setValue} />;
  }
  const user = userEvent.setup();
  const view = render(<Example />);
  const input = view.getByRole("searchbox", { name: "Icon name or category" });
  await user.type(input, "GitHub");
  expect((input as HTMLInputElement).value).toBe("GitHub");
});

test("font selection is scoped to its preview provider", async () => {
  function Selection() { const { selectedFont } = useFontPreview(); return <output>{selectedFont?.family ?? "None"}</output>; }
  function Example() { return <FontPreviewProvider><Selection /><FontPreviewButton slug="allan" family="Allan" weights={[400]} /></FontPreviewProvider>; }
  const user = userEvent.setup();
  const view = render(<Example />);
  await user.click(view.getByRole("button", { name: "Preview" }));
  expect(view.getByRole("status").textContent).toBe("Allan");
  view.unmount();
  expect(render(<Example />).getByRole("status").textContent).toBe("None");
});


test("SVG downloads use the fetched bytes and requested filename", async () => {
  const data = new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], { type: "image/svg+xml" });
  const fetcher = spyOn(globalThis, "fetch").mockResolvedValue(new Response(data));
  const createUrl = spyOn(URL, "createObjectURL").mockReturnValue("blob:icon-download");
  spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const saved: string[] = [];
  spyOn(HTMLAnchorElement.prototype, "dispatchEvent").mockImplementation(function(this: HTMLAnchorElement, event: Event) { if (event.type === "click") saved.push(this.download); return true; });
  const user = userEvent.setup();
  const view = render(<DownloadSvg url="/icons/thesvg/brands/color/11x.svg" fileName="11x.svg" />);
  const button = view.getByRole("button", { name: "Download SVG" }) as HTMLButtonElement;
  await waitFor(() => expect(button.disabled).toBe(false));
  await user.click(button);
  expect(fetcher.mock.calls[0]?.[0]).toBe("/icons/thesvg/brands/color/11x.svg");
  expect(createUrl).toHaveBeenCalledTimes(1);
  expect(saved).toEqual(["11x.svg"]);
});

test("failed SVG downloads remain disabled and report the failure", async () => {
  spyOn(globalThis, "fetch").mockResolvedValue(new Response("Missing", { status: 404 }));
  const view = render(<DownloadSvg url="/missing.svg" fileName="missing.svg" />);
  await waitFor(() => expect(view.getByRole("alert").textContent).toContain("Download unavailable"));
  expect((view.getByRole("button", { name: "Download SVG" }) as HTMLButtonElement).disabled).toBe(true);
});


test("brand thumbnails stay lazy without hiding their layout box, and remove the fallback after loading", async () => {
  const view = render(<IconImage src="/icons/brand.svg" alt="Brand" />);
  const image = view.container.querySelector("img")!;
  expect(image.getAttribute("loading")).toBe("lazy");
  expect(image.hidden).toBe(false);
  Object.defineProperties(image, { complete: { value: true, configurable: true }, naturalWidth: { value: 24, configurable: true }, naturalHeight: { value: 24, configurable: true } });
  await act(async () => { fireEvent.load(image); });
  await waitFor(() => expect((view.getByText("SVG") as HTMLElement).hidden).toBe(true));
});
