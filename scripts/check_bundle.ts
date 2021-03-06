import * as path from "./deps/std_path.ts";
import { equal } from "./deps/std_testing_asserts.ts";

const thisFile = path.fromFileUrl(import.meta.url);
const thisDir = path.dirname(thisFile);
const repoRoot = path.dirname(thisDir);
const repo = (p: string) => p.slice(repoRoot.length + 1);

const bundlePath = path.join(repoRoot, "src", "schemas", "mod.bundle.js");

const inputText = await Deno.readTextFile(bundlePath);

console.info("Hashing bundle");
const beforeBytes = new TextEncoder().encode(inputText);
const beforeHash = await crypto.subtle.digest("SHA-256", beforeBytes);

// The hashes will never match if we don't also bundle as release. The bundle
// script injects a comment for release builds, specifically so this script can
// detect that and also bundle as a release build.
const isReleaseBuild = inputText.includes("// Bundle mode: release\n");

const scriptPath = path.join(thisDir, "bundle.ts");
console.info(`Running ${repo(scriptPath)}`);
console.log();
const status = await Deno.run({
	cmd: [
		"deno",
		"run",
		"--no-check",
		"--quiet",
		"--unstable",
		"--allow-all",
		path.join(thisDir, "bundle.ts"),
	],
	env: {
		"BUNDLE_RELEASE": isReleaseBuild ? "1" : "0",
	},
}).status();
console.log();

if (!status.success) {
	console.error(`${repo(scriptPath)} exited with a non-zero status code`);
	Deno.exit(1);
}

console.info("Hashing bundle again");
const afterBytes = new TextEncoder().encode(inputText);
const afterHash = await crypto.subtle.digest("SHA-256", afterBytes);

if (!equal(beforeHash, afterHash)) {
	console.error(
		"%cHashes are unequal. Schemas must be bundled before committing.",
		"color: red",
	);
	console.error("$ deno run --unstable --allow-all ./scripts/bundle.ts");
	Deno.exit(1);
}

console.info("Hashes are equal");
