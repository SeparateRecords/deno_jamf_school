import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./client.ts";
import { suppressAPIError } from "./api_error.ts";
import { assert } from "../deps/std_testing_asserts.ts";
import { customInspect } from "./custom_inspect.ts";

export type AppData = models.APIData["getApps"][number];

export class App implements models.App {
	#api: models.API;
	#client: Creator;
	#data: AppData;

	constructor(init: BasicObjectInit<AppData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toString() {
		return this.name;
	}

	toJSON() {
		return this.#data;
	}

	[Symbol.for("Deno.customInspect")]() {
		return customInspect(this);
	}

	get type() {
		return "App" as const;
	}

	get id() {
		return this.#data.id;
	}

	get appId() {
		return this.#data.adamId ?? null;
	}

	get bundleId() {
		return this.#data.bundleId;
	}

	get icon() {
		return this.#data.icon;
	}

	get isBook() {
		return this.#data.isBook;
	}

	get isTrashed() {
		return this.#data.isDeleted ?? false;
	}

	get name() {
		return this.#data.name;
	}

	get price() {
		return this.#data.price ?? 0;
	}

	get version() {
		return this.#data.version;
	}

	get locationId() {
		return this.#data.locationId;
	}

	async getDevices() {
		let devices;
		try {
			devices = await this.#api.getDevices({
				includeApps: true,
			});
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		// The data returned from GET /devices?includeApps=1 doesn't include the
		// app ID, but does include the bundle ID. That's probably unique enough.
		const found = devices.filter((device) => {
			assert(Array.isArray(device.apps), "Expected an array of apps");
			return device.apps.some((app) => {
				return app.identifier === this.#data.bundleId;
			});
		});

		return found.map((device) => this.#client.createDevice(device));
	}

	async getLocation() {
		let locationData;
		try {
			locationData = await this.#api.getLocation(this.#data.locationId);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}
		return this.#client.createLocation(locationData);
	}

	async update() {
		this.#data = await this.#api.getApp(this.#data.id);
	}
}
