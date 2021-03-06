import { assert } from "../deps/std_testing_asserts.ts";
import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./client.ts";
import { suppressAPIError } from "./api_error.ts";
import { customInspect } from "./custom_inspect.ts";

const enrollment = {
	"ac2": Object.freeze({ type: "ac2", pending: false } as const),
	"dep": Object.freeze({ type: "dep", pending: false } as const),
	"ac2Pending": Object.freeze({ type: "ac2", pending: true } as const),
	"depPending": Object.freeze({ type: "dep", pending: true } as const),
	"manual": Object.freeze({ type: "manual", pending: false } as const),
} as const;

// Very dumb regex that matches the Jamf School region coordinate string format
const coords = /^([+-]?\d{1,3}(?:\.\d{1,15})?),([+-]?\d{1,3}(?:\.\d{1,15})?)$/;

// /devices and /devices/:udid both return subtly different data, but /devices
// is the more sane of the two routes.
export type DeviceData = models.APIData["getDevices"][number];

export class Device implements models.Device {
	#api: models.API;
	#client: Creator;
	#data: DeviceData;

	constructor(init: BasicObjectInit<DeviceData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toString() {
		return this.#data.name;
	}

	toJSON() {
		return this.#data;
	}

	[Symbol.for("Deno.customInspect")]() {
		return customInspect(this);
	}

	get type() {
		return "Device" as const;
	}

	get udid() {
		return this.#data.UDID;
	}

	get serialNumber() {
		return this.#data.serialNumber;
	}

	get name() {
		return this.#data.name;
	}

	get isManaged() {
		return this.#data.isManaged;
	}

	get isSupervised() {
		return this.#data.isSupervised;
	}

	get deviceClass() {
		return this.#data.class;
	}

	get assetTag() {
		return this.#data.assetTag;
	}

	get os() {
		return `${this.osPrefix} ${this.osVersion}`;
	}

	get osPrefix() {
		return this.#data.os.prefix;
	}

	get osVersion() {
		return this.#data.os.version;
	}

	get modelName() {
		return this.#data.model.name;
	}

	get modelIdentifier() {
		return this.#data.model.identifier;
	}

	get modelType() {
		return this.#data.model.type;
	}

	get batteryPercentage() {
		return this.#data.batteryLevel;
	}

	get batteryCapacity() {
		return this.#data.totalCapacity;
	}

	get storageTotal() {
		return this.#data.totalCapacity;
	}

	get storageRemaining() {
		return this.#data.availableCapacity;
	}

	get enrollment() {
		return enrollment[this.#data.enrollType];
	}

	get locationId() {
		return this.#data.locationId;
	}

	get ownerId() {
		return this.#data.owner.id;
	}

	get ownerName() {
		return this.#data.owner.name;
	}

	getRegion() {
		if (this.#data.region.string === "") {
			return null;
		}

		const match = this.#data.region.coordinates?.match(coords);
		assert(match, "Unexpected coordinate format");

		return {
			name: this.#data.region.string,
			latitude: parseFloat(match[1]),
			longitude: parseFloat(match[2]),
		};
	}

	async update() {
		const devices = await this.#api.getDevices({
			serialNumber: this.#data.serialNumber,
		});

		if (devices.length !== 1) {
			throw new Error(`Expected 1 device, got ${devices.length}`);
		}

		this.#data = devices[0];
	}

	async getOwner() {
		if (this.#data.owner.id === 0) {
			return null;
		}

		let userData;
		try {
			userData = await this.#api.getUser(this.#data.owner.id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.#client.createUser(userData);
	}

	async setOwner(user: { id: number }) {
		assert(
			user.id !== 0,
			"Using ID 0 would remove the owner. If this is intentional, use `Device.removeOwner()`",
		);
		if (this.#data.owner.id !== user.id) {
			await this.#api.setDeviceOwner(this.#data.UDID, user.id);
		}
	}

	async removeOwner() {
		if (this.#data.owner.id !== 0) {
			await this.#api.setDeviceOwner(this.#data.UDID, 0);
		}
	}

	async getGroups(): Promise<models.DeviceGroup[]> {
		let allGroups;
		try {
			allGroups = await this.#api.getDeviceGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const groups = new Set(this.#data.groups);
		const myGroups = allGroups.filter((group) => groups.has(group.name));

		return myGroups.map((group) => this.#client.createDeviceGroup(group));
	}

	async restart() {
		await this.#api.restartDevice(this.#data.UDID);
	}

	async wipe() {
		await this.#api.wipeDevice(this.#data.UDID);
	}

	async getApps() {
		let apps, myAppData;
		try {
			[apps, myAppData] = await Promise.all([
				this.#api.getApps(),
				this.#api.getDevice(this.#data.UDID, { includeApps: true }),
			]);
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}
		// It's possible that this could be omitted, which is an error condition.
		// That shouldn't fail silently, since that's (in this particular case) a
		// validation failure.
		if (!("apps" in myAppData)) {
			throw new Error("Missing 'apps' property in returned apps");
		}
		const myAppIdentifiers = new Set(myAppData.apps!.map((app) => app.identifier));
		const myApps = apps.filter((app) => myAppIdentifiers.has(app.bundleId));
		return myApps.map((app) => this.#client.createApp(app));
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

	async setAssetTag(text: string) {
		if (this.#data.assetTag !== text) {
			await this.#api.updateDevice(this.#data.UDID, { assetTag: text });
		}
	}

	async setNotes(text: string) {
		if (this.#data.notes !== text) {
			await this.#api.updateDevice(this.#data.UDID, { notes: text });
		}
	}

	async setLocation(location: { id: number }) {
		if (this.#data.locationId !== location.id) {
			await this.#api.moveDevice(this.#data.UDID, location.id);
		}
	}
}
