/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createUrl, createUrlSearchParams, request, type RequestConfig } from "@acdh-oeaw/lib";
import type {
	FilterKeys,
	HasRequiredKeys,
	HttpMethod,
	MediaType,
	OperationRequestBodyContent,
	PathsWithMethod,
	ResponseObjectMap,
	SuccessResponse,
} from "openapi-typescript-helpers";

interface ClientOptions {
	baseUrl: URL | string;
}

export type ParamsOption<T> = T extends { parameters: any }
	? HasRequiredKeys<T["parameters"]> extends never
		? { params?: T["parameters"] }
		: { params: T["parameters"] }
	: never;

export type RequestBodyOption<T> =
	OperationRequestBodyContent<T> extends never
		? { body?: never }
		: undefined extends OperationRequestBodyContent<T>
			? { body?: OperationRequestBodyContent<T> }
			: { body: OperationRequestBodyContent<T> };

export type RequestOptions<T> = ParamsOption<T> & RequestBodyOption<T>;

export type FetchOptions<T> = Omit<RequestConfig, "body"> & RequestOptions<T>;

export type FetchResponse<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>;

/**
 * Create api client.
 *
 * @see https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-fetch
 */
export default function createClient<Paths extends {}>({ baseUrl }: ClientOptions) {
	const _baseUrl = new URL(baseUrl);

	if (!_baseUrl.pathname.endsWith("/")) {
		_baseUrl.pathname = _baseUrl.pathname + "/";
	}

	function _request<P extends keyof Paths, M extends HttpMethod>(
		pathname: P,
		options: FetchOptions<M extends keyof Paths[P] ? Paths[P][M] : never>,
	): Promise<FetchResponse<M extends keyof Paths[P] ? Paths[P][M] : unknown>> {
		const { params = {}, ...init } = options;

		const url = createRequestUrl(_baseUrl, pathname as string, params);

		return request(url, init as any) as any;
	}

	type DeletePaths = PathsWithMethod<Paths, "delete">;
	type GetPaths = PathsWithMethod<Paths, "get">;
	type HeadPaths = PathsWithMethod<Paths, "head">;
	type OptionsPaths = PathsWithMethod<Paths, "options">;
	type PatchPaths = PathsWithMethod<Paths, "patch">;
	type PostPaths = PathsWithMethod<Paths, "post">;
	type PutPaths = PathsWithMethod<Paths, "put">;
	type TracePaths = PathsWithMethod<Paths, "trace">;
	type DeleteFetchOptions<P extends DeletePaths> = FetchOptions<FilterKeys<Paths[P], "delete">>;
	type GetFetchOptions<P extends GetPaths> = FetchOptions<FilterKeys<Paths[P], "get">>;
	type HeadFetchOptions<P extends HeadPaths> = FetchOptions<FilterKeys<Paths[P], "head">>;
	type OptionsFetchOptions<P extends OptionsPaths> = FetchOptions<FilterKeys<Paths[P], "options">>;
	type PatchFetchOptions<P extends PatchPaths> = FetchOptions<FilterKeys<Paths[P], "patch">>;
	type PostFetchOptions<P extends PostPaths> = FetchOptions<FilterKeys<Paths[P], "post">>;
	type PutFetchOptions<P extends PutPaths> = FetchOptions<FilterKeys<Paths[P], "put">>;
	type TraceFetchOptions<P extends TracePaths> = FetchOptions<FilterKeys<Paths[P], "trace">>;

	return {
		DELETE<P extends DeletePaths>(
			url: P,
			...init: HasRequiredKeys<DeleteFetchOptions<P>> extends never
				? [DeleteFetchOptions<P>?]
				: [DeleteFetchOptions<P>]
		) {
			return _request<P, "delete">(url, {
				...init[0],
				method: "DELETE",
			} as any);
		},
		GET<P extends GetPaths>(
			url: P,
			...init: HasRequiredKeys<GetFetchOptions<P>> extends never
				? [GetFetchOptions<P>?]
				: [GetFetchOptions<P>]
		) {
			return _request<P, "get">(url, { ...init[0], method: "GET" } as any);
		},
		HEAD<P extends HeadPaths>(
			url: P,
			...init: HasRequiredKeys<HeadFetchOptions<P>> extends never
				? [HeadFetchOptions<P>?]
				: [HeadFetchOptions<P>]
		) {
			return _request<P, "head">(url, { ...init[0], method: "HEAD" } as any);
		},
		OPTIONS<P extends OptionsPaths>(
			url: P,
			...init: HasRequiredKeys<OptionsFetchOptions<P>> extends never
				? [OptionsFetchOptions<P>?]
				: [OptionsFetchOptions<P>]
		) {
			return _request<P, "options">(url, {
				...init[0],
				method: "OPTIONS",
			} as any);
		},
		PATCH<P extends PatchPaths>(
			url: P,
			...init: HasRequiredKeys<PatchFetchOptions<P>> extends never
				? [PatchFetchOptions<P>?]
				: [PatchFetchOptions<P>]
		) {
			return _request<P, "patch">(url, { ...init[0], method: "PATCH" } as any);
		},
		POST<P extends PostPaths>(
			url: P,
			...init: HasRequiredKeys<PostFetchOptions<P>> extends never
				? [PostFetchOptions<P>?]
				: [PostFetchOptions<P>]
		) {
			return _request<P, "post">(url, { ...init[0], method: "POST" } as any);
		},
		PUT<P extends PutPaths>(
			url: P,
			...init: HasRequiredKeys<PutFetchOptions<P>> extends never
				? [PutFetchOptions<P>?]
				: [PutFetchOptions<P>]
		) {
			return _request<P, "put">(url, { ...init[0], method: "PUT" } as any);
		},
		TRACE<P extends TracePaths>(
			url: P,
			...init: HasRequiredKeys<TraceFetchOptions<P>> extends never
				? [TraceFetchOptions<P>?]
				: [TraceFetchOptions<P>]
		) {
			return _request<P, "trace">(url, { ...init[0], method: "TRACE" } as any);
		},
	};
}

function createRequestUrl(
	baseUrl: URL,
	pathname: string,
	params: { path?: Record<string, any>; query?: Record<string, any> },
): URL {
	const { path, query } = params;

	/**
	 * When a base url has a path, ensure that pathname is appended correctly.
	 *
	 * E.g. `new URL('/query/', 'https://example.com/api/')` would result in
	 * `https://example.com/query/` not `https://example.com/api/query/`.
	 */
	const _pathname = pathname.startsWith("/") ? pathname.slice(1) : pathname;

	const url = createUrl({
		baseUrl,
		pathname: path
			? _pathname.replace(/{(.+?)}/g, (_, key) => encodeURIComponent(path[key]))
			: _pathname,
		searchParams: query ? createUrlSearchParams(query) : undefined,
	});

	return url;
}
