import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import createPlugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";

const fluidColumnsPlugin = createPlugin(({ addUtilities, matchUtilities, theme }) => {
	matchUtilities(
		{
			"grid-fluid-cols"(value: string) {
				return {
					gridTemplateColumns: `repeat(var(--fluid-columns-mode, auto-fill), minmax(${value}, 1fr))`,
				};
			},
		},

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		{ values: theme("width")! },
	);

	addUtilities({
		".grid-fluid-cols-auto-fill": { "--fluid-columns-mode": "auto-fill" },
		".grid-fluid-cols-auto-fit": { "--fluid-columns-mode": "auto-fit" },
	});
});

const config: Config = {
	content: [
		"./app.vue",
		"./error.vue",
		"./components/**/*.@(css|ts|vue)",
		"./content/**/*.md",
		"./layouts/**/*.@(css|ts|vue)",
		"./pages/**/*.@(css|ts|vue)",
		"./styles/**/*.css",
	],
	darkMode: ["selector", '[data-ui-color-scheme="dark"]'],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "5rem",
			screens: {
				"2xl": "max-width",
			},
		},
		extend: {
			fontFamily: {
				sans: ["Inter Variable", "system-ui", "sans-serif"],
			},
			colors: {
				"frisch-indigo": "rgb(20 28 84 / <alpha-value>)",
				"frisch-grey": "rgb(148 151 170 / <alpha-value>)",
				"frisch-orange": "rgb(236 81 0 / <alpha-value>)",
				"frisch-orange-light": "rgb(231 171 147 / <alpha-value>)",
				"frisch-orange-super-light": "rgb(253 234 226 / <alpha-value>)",
				"frisch-marine": "rgb(233 238 252 / <alpha-value>)",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"collapsible-down": {
					from: { height: "0" },
					to: { height: "var(--radix-collapsible-content-height)" },
				},
				"collapsible-up": {
					from: { height: "var(--radix-collapsible-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"collapsible-down": "collapsible-down 0.2s ease-in-out",
				"collapsible-up": "collapsible-up 0.2s ease-in-out",
			},
		},
	},
	plugins: [animate, typography, fluidColumnsPlugin],
};

export default config;
