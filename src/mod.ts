export { createAPI } from "./api.ts";
export type { Credentials } from "./api.ts";

export { createClient } from "./client.ts";

export type {
	API,
	APIGetDeviceOptions,
	APIGetDevicesOptions,
	APIRestartDeviceOptions,
	APIWipeDeviceOptions,
	Client,
	Device,
	DeviceGroup,
	User,
	UserGroup,
} from "./models.ts";

// Deno's standard library does the same thing. Good for consistency.
export { version } from "./version.ts";
