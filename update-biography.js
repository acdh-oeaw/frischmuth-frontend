import fs from "fs";
import matter from "gray-matter";
import path from "path";
import YAML from "yaml";

const folderPath = "content/pages/biography";

// Define all required/optional fields
const expectedFields = {
	year: "",
	image: "",
	imageTitle: "",
	alt: "",
	copyright: "",
};

const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".md"));

for (const file of files) {
	const filePath = path.join(folderPath, file);
	const raw = fs.readFileSync(filePath, "utf8");
	const parsed = matter(raw);

	let updated = false;

	for (const [key, defaultValue] of Object.entries(expectedFields)) {
		if (!(key in parsed.data)) {
			parsed.data[key] = defaultValue;
			updated = true;
		}
	}

	if (updated) {
		// Custom YAML dump to use double quotes and minimal quoting
		const yamlStr = YAML.stringify(parsed.data, {
			defaultStringType: "QUOTE_DOUBLE", // Use double quotes
			defaultKeyType: "PLAIN",
		}).trim();

		const newContent = `---\n${yamlStr}\n---\n${parsed.content.trim()}\n`;

		fs.writeFileSync(filePath, newContent);
		console.log(`✅ Updated: ${file}`);
	} else {
		console.log(`✔ Already complete: ${file}`);
	}
}

console.log("🎉 All biography Markdown files processed.");
