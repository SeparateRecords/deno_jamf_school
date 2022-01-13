import * as JamfAPI from "../../src/api.ts";
import validatePutDevicesUdidMigrate from "../../src/schemas/PUT_devices_udid_migrate.ts";
import { assert, assertEquals } from "../deps/std_testing_asserts.ts";
import * as mockFetch from "../deps/mock_fetch.ts";

// There's nothing special about these numbers
const api = JamfAPI.createAPI({
	id: "1097109",
	token: "1097109710971",
	url: "https://localhost:8181/",
});

mockFetch.install(); // we don't need to uninstall, all fetches should be mocked

const jsonObject = await import(
	"../example_data/PUT_devices_udid_migrate__200.json",
	{ assert: { type: "json" } }
);
const jsonString = JSON.stringify(jsonObject);
validatePutDevicesUdidMigrate(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_devices_udid_migrate__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.moveDevice: remaps parameters to their correct names/values",
	async fn() {
		mockFetch.mock("PUT@/devices/:udid/migrate", async (req, { udid }) => {
			const json = await req.json();
			assertEquals(udid, "c0ffee");
			assertEquals(json.locationId, 0);
			assert(!("onlyDevice" in json));
			return response;
		});
		await api.moveDevice("c0ffee", 0);

		mockFetch.mock("PUT@/devices/:udid/migrate", async (req) => {
			const json = await req.json();
			assertEquals(json.locationId, 0);
			assertEquals(json.onlyDevice, true);
			return response;
		});
		await api.moveDevice("-", 0, { onlyDevice: true });
		mockFetch.reset();
	},
});
