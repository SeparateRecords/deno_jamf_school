import * as jamf from "../../src/api.ts";
import validatePutDevicesMigrate from "../../src/schemas/PUT_devices_migrate.ts";
import {
	assert,
	assertEquals,
	assertThrowsAsync,
} from "../deps/std_testing_asserts.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import * as mockFetch from "../deps/mock_fetch.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

// There's nothing special about these numbers
const api = jamf.createAPI({
	id: "1097109",
	token: "1097109710971",
	url: "https://localhost:8181/",
});

mockFetch.install(); // we don't need to uninstall, all fetches should be mocked

const jsonString = await readRelativeTextFile(
	"../example_data/PUT_devices_migrate__200.json",
);
const jsonObject = JSON.parse(jsonString);
validatePutDevicesMigrate(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_devices_migrate__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.moveDevices: rejects empty array",
	async fn() {
		mockFetch.mock("PUT@/devices/migrate", () => response);
		await assertThrowsAsync(async () => {
			await api.moveDevices([], 0);
		});
		mockFetch.reset();
	},
});

Deno.test({
	name: "api.moveDevices: rejects array with more than 20 items",
	async fn() {
		mockFetch.mock("PUT@/devices/migrate", () => response);
		await assertThrowsAsync(async () => {
			// deno-fmt-ignore
			await api.moveDevices([
				"-", "-", "-", "-", "-", "-", "-", "-", "-", "-",
				"-", "-", "-", "-", "-", "-", "-", "-", "-", "-",
				"-", // 21st
			], 0);
		});
		mockFetch.reset();
	},
});

Deno.test({
	name: "api.moveDevices: remaps parameters to their correct names/values",
	async fn() {
		mockFetch.mock("PUT@/devices/migrate", async (req) => {
			const json = await req.json();
			assertEquals(json.udids, ["-"]);
			assertEquals(json.locationId, 0);
			assert(!("onlyDevice" in json));
			return response;
		});
		await api.moveDevices(["-"], 0);

		mockFetch.mock("PUT@/devices/migrate", async (req) => {
			const json = await req.json();
			assertEquals(json.udids, ["-"]);
			assertEquals(json.locationId, 0);
			assertEquals(json.onlyDevice, true);
			return response;
		});
		await api.moveDevices(["-"], 0, { onlyDevice: true });
		mockFetch.reset();
	},
});
