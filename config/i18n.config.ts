import type { LocaleObject } from "vue-i18n-routing";

import type de from "@/messages/de/index.json";
import type metadata from "@/messages/de/metadata.json";

export const locales = ["de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const localesMap = {
	de: { code: "de", language: "de", files: ["de/index.json", "de/metadata.json"] },
} satisfies Record<Locale, LocaleObject>;

export type Messages = typeof de & typeof metadata;

export interface Schema {
	message: Messages;
}

export function isValidLocale(value: string): value is Locale {
	return value in localesMap;
}

export interface Translations extends Record<Locale, Messages> {
	de: typeof de & typeof metadata;
}
