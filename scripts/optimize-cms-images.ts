import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join, parse, relative } from "node:path";

const IMAGE_DIRECTORY = join(process.cwd(), "public", "assets", "images");
const SEARCH_DIRECTORIES = ["content", "components", "pages", "server", "public"];
const CONVERTIBLE_EXTENSIONS = new Set([".heic", ".jpeg", ".jpg", ".png", ".tif", ".tiff"]);
const MAX_DIMENSION = 2560;
const WEBP_QUALITY = 82;

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type SharpModule = typeof import("sharp");
interface SharpLoader {
	default: SharpModule;
}

async function loadSharp(): Promise<SharpModule> {
	try {
		return ((await import("sharp")) as unknown as SharpLoader).default;
	} catch {
		const fallbackPath = join(
			process.cwd(),
			"node_modules",
			".pnpm",
			"sharp@0.32.6",
			"node_modules",
			"sharp",
			"lib",
			"index.js",
		);

		return ((await import(fallbackPath)) as unknown as SharpLoader).default;
	}
}

async function getFiles(directory: string): Promise<Array<string>> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const location = join(directory, entry.name);

			if (entry.isDirectory()) {
				return await getFiles(location);
			}

			if (entry.isFile()) {
				return [location];
			}

			return [];
		}),
	);

	return files.flat();
}

async function updateReferences(replacements: Map<string, string>): Promise<number> {
	const files = (
		await Promise.all(
			SEARCH_DIRECTORIES.map(async (directory) => {
				const location = join(process.cwd(), directory);
				try {
					const info = await stat(location);
					if (!info.isDirectory()) return [];
					return await getFiles(location);
				} catch {
					return [];
				}
			}),
		)
	).flat();

	let updatedFiles = 0;

	for (const file of files) {
		const source = await readFile(file, "utf8");
		let output = source;

		for (const [before, after] of Array.from(replacements.entries())) {
			output = output.split(before).join(after);
		}

		if (output !== source) {
			await writeFile(file, output, "utf8");
			updatedFiles += 1;
		}
	}

	return updatedFiles;
}

async function main(): Promise<void> {
	const sharp = await loadSharp();

	try {
		const info = await stat(IMAGE_DIRECTORY);
		if (!info.isDirectory()) {
			throw new Error(`Not a directory: ${IMAGE_DIRECTORY}`);
		}
	} catch {
		console.log(`skipping image optimization, directory not found: ${IMAGE_DIRECTORY}`);
		return;
	}

	const files = await getFiles(IMAGE_DIRECTORY);
	const replacements = new Map<string, string>();
	let optimizedCount = 0;

	for (const file of files) {
		const { dir, ext, name } = parse(file);
		const normalizedExtension = ext.toLowerCase();
		const publicPath = `/${relative(join(process.cwd(), "public"), file).split("\\").join("/")}`;

		if (normalizedExtension === ".webp") {
			for (const extension of Array.from(CONVERTIBLE_EXTENSIONS)) {
				replacements.set(`${publicPath.slice(0, -".webp".length)}${extension}`, publicPath);
			}

			continue;
		}

		if (!CONVERTIBLE_EXTENSIONS.has(normalizedExtension)) {
			continue;
		}

		const outputFile = join(dir, `${name}.webp`);

		try {
			const image = sharp(file, { animated: false }).rotate();
			const metadata = await image.metadata();

			await image
				.resize({
					fit: "inside",
					height: MAX_DIMENSION,
					withoutEnlargement: true,
					width: MAX_DIMENSION,
				})
				.webp({ quality: WEBP_QUALITY })
				.toFile(outputFile);

			if (outputFile !== file) {
				await rm(file);
			}

			const from = publicPath;
			const to = `/${relative(join(process.cwd(), "public"), outputFile).split("\\").join("/")}`;

			replacements.set(from, to);
			optimizedCount += 1;

			const dimensions =
				metadata.width != null && metadata.height != null
					? `${metadata.width.toString()}x${metadata.height.toString()}`
					: "unknown";

			console.log(`optimized ${relative(process.cwd(), file)} (${dimensions}) -> ${to}`);
		} catch (error: unknown) {
			await rm(outputFile, { force: true });
			console.warn(`skipped ${relative(process.cwd(), file)}: ${String(error)}`);
		}
	}

	const updatedReferences = await updateReferences(replacements);

	console.log(
		`optimized ${optimizedCount.toString()} images, updated references in ${updatedReferences.toString()} files`,
	);
}

main().catch((error: unknown) => {
	console.error(error);
	process.exitCode = 1;
});
