import { assertValid } from "./util.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

Deno.test("schemas/assertValid: PUT /devices/:udid/owner (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/PUT_devices_udid_owner__200.json",
	);
	assertValid("PUT /devices/:udid/owner", JSON.parse(json));
});
