import type { Schema } from "./scripts/render.ts";
import * as path from "./scripts/deps/std_path.ts";
import { version } from "./src/version.ts";

// This file is configuration for scripts/render.ts and exists purely to
// separate the logic from any opinions.
// $ deno run tpl.ts | deno run --allow-read=. --allow-write=. scripts/render.ts

export const config: Schema = {
	settings: {
		inputFileSuffix: ".tpl.md",
		outputFileSuffix: ".md",
		replaceLeadingTabs: "  ",
		contentPrefix:
			"<!-- deno-fmt-ignore-file -->${eol}<!-- DO NOT EDIT: Generated from ./${name} -->",
		lineEnding: "lf",
		excludePaths: [
			"**/node_modules", // just in case!
		],
		// Regardless of CWD, the root will be relative to this file.
		root: path.dirname(path.fromFileUrl(import.meta.url)),
	},
	variables: {
		VERSION: version,
		src: `https://deno.land/x/jamf_school@${version}`,
		REPO: "https://github.com/SeparateRecords/deno_jamf_school",
		DOCS: `https://doc.deno.land/https/deno.land/x/jamf_school@${version}`,
		// Pre-made links for issues 0 to 100
		...Array(100).fill(null).reduce((acc, _, i) => {
			acc[i] =
				`[#${i}](https://github.com/SeparateRecords/deno_jamf_school/issues/${i})`;
			return acc;
		}, {}),
	},
};

if (import.meta.main) {
	if (!Deno.isatty(Deno.stdout.rid)) {
		// If the output isn't a terminal, we're being piped into another program.
		console.log(JSON.stringify(config, null, 2));
	} else {
		// The output is a terminal (not a file), so be helpful.
		const commands = [
			"deno run --no-check ./tpl.ts",
			"deno run --no-check --allow-read=. --allow-write=. ./scripts/render.ts",
		];
		console.log(commands.join(" | "));
	}
}
