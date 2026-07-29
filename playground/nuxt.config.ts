import fs from "node:fs";
import path from "node:path";

import locale from "@open-xamu-co/ui-common-helpers/es";
import { type Stylesheet, getStyleSheetPreload } from "@open-xamu-co/ui-nuxt";

const production = process.env.NODE_ENV === "production";
const title = "Xamu Countries ⋅ Free REST API with countries data & Nuxt module.";
const keywords =
	"indicatives, countries with indicatives, countries, countries and states, countries with states and cities, states and cities, rest, api, nuxt, nuxt module, nuxt server module";
const description =
	"Xamu Countries API offers REST endpoints with useful country data as well as their states and cities. Use our Nuxt module for faster responses";
const canonical = "https://countries.xamu.com.co/";

// Styling
const loaderCss = fs.readFileSync(path.resolve(__dirname, "app/assets/loader.css"), {
	encoding: "utf8",
});
const stylesheets: Stylesheet[] = [
	"https://unpkg.com/@open-xamu-co/ui-styles@^5.0.0-next.14/dist/index.min.css",
	"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700;1,900&display=swap",
	"https://unpkg.com/@fortawesome/fontawesome-free@^6/css/all.min.css",
	"https://unpkg.com/sweetalert2@^11/dist/sweetalert2.min.css",
];

export default defineNuxtConfig({
	compatibilityDate: "2024-12-08",
	devtools: { enabled: !production },
	// Follow nuxt 4 directory structure
	srcDir: "./app",
	serverDir: "./server",
	dir: { public: "../public" },
	app: {
		pageTransition: { name: "page", mode: "out-in" },
		layoutTransition: { name: "layout", mode: "out-in" },
		head: {
			title,
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "robots", content: "index, follow" },
				{ name: "description", content: description },
				{ name: "keywords", content: keywords },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:image", content: "/images/seo.jpg" },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: canonical },
				{ property: "og:site_name", content: "Xamu Countries" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: "/images/seo.jpg" },
				{ name: "msvalidate.01", content: "BBF99508118DB02449397517DA5EAE5C" },
			],
			link: [
				{ rel: "icon", type: "image/png", href: "/favicon.png" },
				{ rel: "canonical", href: canonical },
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com",
					crossorigin: "anonymous",
				},
				{ rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: "anonymous",
				},
				{ rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
				{ rel: "preconnect", href: "https://unpkg.com", crossorigin: "anonymous" },
				{ rel: "dns-prefetch", href: "https://unpkg.com" },
				...stylesheets.map(getStyleSheetPreload),
			],
			style: [{ innerHTML: loaderCss, tagPriority: 0 }],
			noscript: [{ innerHTML: "This app requires javascript to work" }],
		},
	},
	modules: ["../src/module", "@open-xamu-co/ui-nuxt"],
	countries: { base: "/api/v1" },
	xamu: {
		locale,
		lang: "es",
		country: "CO",
		disableCSSMeta: true,
	},
});
