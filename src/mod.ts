import type { Client, Credentials } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/client.ts";

// This has to be namespaced for doc.deno.land to link to it, otherwise
// the generated link in `createClient` will go to models/mod.ts
import * as jamfapi from "./api.ts";

/**
 * Create an API client.
 *
 * Clients are a high level abstraction of the Jamf School API.
 *
 * ```
 * const client = jamf.createClient({
 *   id: "your_network_id",
 *   token: "your_api_token",
 *   url: "https://your_school.jamfcloud.com",
 * });
 *
 * const it = await client.getDeviceGroupByName("IT Devices");
 * await it?.restartDevices();
 * ```
 */
export function createClient(init: Credentials | { api: jamfapi.API }): Client {
	let api;
	if ("api" in init) {
		api = init.api;
	} else {
		api = jamfapi.createAPI(init);
	}

	return new InternalClient({ api });
}

export type {
	App,
	Client,
	Credentials,
	Device,
	DeviceGroup,
	Location,
	Profile,
	ProfileSchedule,
	User,
	UserGroup,
} from "./models/mod.ts";
