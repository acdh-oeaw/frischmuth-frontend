export function getWorkIdFromUrl(url: string): number | undefined {
	try {
		const { pathname } = new URL(url, "https://example.invalid/");
		const match = /^\/(?:work|apis\/apis_ontology\.work\/update)\/(\d+)\/?$/.exec(pathname);
		return match?.[1] == null ? undefined : Number(match[1]);
	} catch {
		return undefined;
	}
}
