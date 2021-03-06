import { grantOrThrow } from "https://deno.land/std@0.116.0/permissions/mod.ts";
import { createAPI } from "../api.ts";
import { createClient } from "../mod.ts";

// Required for JAMF_SCHOOL_{ID,TOKEN,URL}
await grantOrThrow({ name: "env" });

// This must be done after env permissions are granted
await grantOrThrow({
	name: "net",
	host: new URL(requireEnv("JAMF_SCHOOL_URL")).host,
});

/** Get an environment variable, and throw if it's empty or doesn't exist */
function requireEnv(key: string): string {
	const val = Deno.env.get(key);
	if (!val) {
		throw new Error(`Missing a required environment variable: ${key}`);
	}
	return val;
}

// If you want to use a `.env` file for your own scripts, try this module:
// https://deno.land/x/dotenv
export const api = createAPI({
	id: requireEnv("JAMF_SCHOOL_ID"),
	token: requireEnv("JAMF_SCHOOL_TOKEN"),
	url: requireEnv("JAMF_SCHOOL_URL"),
});

export const client = createClient({ api });
