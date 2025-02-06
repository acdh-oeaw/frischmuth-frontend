export function ensureTrailingSlash(pathname: string): string {
	return pathname.endsWith("/") ? pathname : `${pathname}/`;
}
