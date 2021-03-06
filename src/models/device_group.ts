import type { Device } from "./device.ts";
import type { Location } from "./location.ts";

/**
 * DeviceGroup represents a named collection of devices.
 */
export interface DeviceGroup {
	/** Discriminator for type checks. */
	readonly type: "DeviceGroup";

	/** The Jamf-assigned ID of the device group. */
	readonly id: number;

	/** The name of the device group. */
	readonly name: string;

	/**
	 * A description of the structure or contents of the device group.
	 * This may be empty.
	 */
	readonly description: string;

	/** Additional relevant information. This may be empty. */
	readonly information: string;

	/** The URL used for the device group image, or null if not set. */
	readonly imageUrl: string | null;

	/**
	 * Whether the group is a "smart group". Smart groups are assigned devices
	 * based on specific criteria. These criteria must be set in the web
	 * interface.
	 */
	readonly isSmart: boolean;

	/** The ID of this device group's location. */
	readonly locationId: number;

	/** The number of devices in this group. */
	readonly count: number;

	/** Whether the device group is shared with all locations. */
	readonly isShared: boolean;

	/** Whether the device group belongs to a class. */
	readonly isClass: boolean;

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the device group. */
	toString(): string;

	/**
	 * (Read) Update this device group's data.
	 *
	 * Other device groups created from the same data will not be updated.
	 */
	update(): Promise<void>;

	/** (Read) Get all the devices in the device group. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get the location this device group belongs to. */
	getLocation(): Promise<Location | null>;

	/**
	 * (Edit) Set this device group's name.
	 *
	 * This method will not update the object. To update it, call
	 * `DeviceGroup.update()`.
	 *
	 * This method is a no-op if the name is the same as the device group's
	 * current name.
	 */
	setName(name: string): Promise<void>;

	/**
	 * (Edit) Set this device group's description.
	 *
	 * This method will not update the object. To update it, call
	 * `DeviceGroup.update()`.
	 *
	 * This method is a no-op if the description is the same as the device
	 * group's current description.
	 */
	setDescription(text: string): Promise<void>;

	/**
	 * (Read, Add) Restart all the devices in this device group.
	 *
	 * Note that failing to restart a device will not throw an exception.
	 */
	restartDevices(): Promise<void>;
}
