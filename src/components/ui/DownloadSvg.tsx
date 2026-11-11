import { DownloadTrigger } from "@ark-ui/react/download-trigger";
import { useEffect, useState } from "react";

export function DownloadSvg({
	url,
	fileName,
}: {
	url: string;
	fileName: string;
}) {
	const [result, setResult] = useState<{
		url: string;
		data?: Blob;
		failed?: boolean;
	}>();
	useEffect(() => {
		const controller = new AbortController();
		fetch(url, { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) throw new Error("SVG download failed");
				const data = await response.blob();
				if (!controller.signal.aborted) setResult({ url, data });
			})
			.catch(() => {
				if (!controller.signal.aborted) setResult({ url, failed: true });
			});
		return () => controller.abort();
	}, [url]);
	const current = result?.url === url ? result : undefined;
	return (
		<div>
			<DownloadTrigger
				data={current?.data ?? ""}
				fileName={fileName}
				mimeType="image/svg+xml"
				disabled={!current?.data}
				className="ui-button ui-button-primary"
			>
				Download SVG
			</DownloadTrigger>
			{current?.failed && (
				<p role="alert" className="text-danger text-sm mt-2">
					Download unavailable. Try opening the original SVG.
				</p>
			)}
		</div>
	);
}
