import { cp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const source = join(dirname(require.resolve("decap-cms/package.json")), "dist");
const destination = join(process.cwd(), "public", "admin", "decap");

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
