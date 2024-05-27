import { createUrl } from "@acdh-oeaw/lib";

import { expect, test } from "@/e2e/lib/test";
import { ensureTrailingSlash } from "@/utils/ensure-trailing-slash";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

test("should set a canonical url", async ({ page }) => {
	await page.goto("/");

	const canonicalUrl = page.locator('link[rel="canonical"]');
	const href = await canonicalUrl.getAttribute("href");
	expect(ensureTrailingSlash(String(href))).toBe(String(createUrl({ baseUrl })));
});

test("should set document title on not-found page", async ({ page }) => {
	await page.goto("/unknown");
	await expect(page).toHaveTitle("Seite nicht gefunden | ACDH-CH App");
});

test("should disallow indexing of not-found page", async ({ page }) => {
	await page.goto("/unknown");

	const ogTitle = page.locator('meta[name="robots"]');
	await expect(ogTitle).toHaveAttribute("content", "noindex");
});

test("should set page metadata", async ({ page }) => {
	await page.goto("/");

	const ogType = page.locator('meta[property="og:type"]');
	await expect(ogType).toHaveAttribute("content", "website");

	const twCard = page.locator('meta[name="twitter:card"]');
	await expect(twCard).toHaveAttribute("content", "summary_large_image");

	const twCreator = page.locator('meta[name="twitter:creator"]');
	await expect(twCreator).toHaveAttribute("content", "@acdh_oeaw");

	const twSite = page.locator('meta[name="twitter:site"]');
	await expect(twSite).toHaveAttribute("content", "@acdh_oeaw");

	// const googleSiteVerification = page.locator('meta[name="google-site-verification"]');
	// await expect(googleSiteVerification).toHaveAttribute("content", "");

	await expect(page).toHaveTitle("Startseite | ACDH-CH App");

	const metaDescription = page.locator('meta[name="description"]');
	await expect(metaDescription).toHaveAttribute("content", "ACDH-CH App");

	const ogTitle = page.locator('meta[property="og:title"]');
	await expect(ogTitle).toHaveAttribute("content", "Startseite");

	const ogDescription = page.locator('meta[property="og:description"]');
	await expect(ogDescription).toHaveAttribute("content", "ACDH-CH App");

	const ogUrl = page.locator('meta[property="og:url"]');
	const href = await ogUrl.getAttribute("content");
	expect(ensureTrailingSlash(String(href))).toBe(String(createUrl({ baseUrl })));

	const ogLocale = page.locator('meta[property="og:locale"]');
	await expect(ogLocale).toHaveAttribute("content", "de");
});

test("should add json+ld metadata", async ({ page }) => {
	await page.goto("/");

	const metadata = await page.locator('script[type="application/ld+json"]').textContent();
	// eslint-disable-next-line playwright/prefer-web-first-assertions
	expect(metadata).toBe(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "ACDH-CH App",
			description: "ACDH-CH App",
		}),
	);
});

test("should serve an open-graph image", async ({ page, request }) => {
	const imagePath = "/opengraph-image.png";

	await page.goto("/");
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		"content",
		expect.stringContaining(String(createUrl({ baseUrl, pathname: imagePath }))),
	);

	const response = await request.get(imagePath);
	const status = response.status();
	const contentType = response.headers()["content-type"];

	expect(status).toBe(200);
	expect(contentType).toBe("image/png");
});
