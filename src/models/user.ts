import type { Device } from "./device.ts";
import type { UserGroup } from "./user_group.ts";
import type { Location } from "./location.ts";

/**
 * User represents a single user.
 */
export interface User {
	/** Discriminator for type checks. */
	readonly type: "User";

	/** The Jamf-assigned ID of the user. */
	readonly id: number;

	/** The user's email address. */
	readonly email: string;

	/** The username of the user. */
	readonly username: string;

	/** The user's domain, if they were imported from a LDAP server. */
	readonly domain: string;

	/** The full name of the user. */
	readonly name: string;

	/** The user's first name.*/
	readonly firstName: string;

	/** The user's last name.*/
	readonly lastName: string;

	/** Additional notes associated with the user. */
	readonly notes: string;

	/** Whether the user is in the trash (deleted). */
	readonly isTrashed: boolean;

	/** Whether the user is excluded from teacher restrictions. */
	readonly isExcludedFromRestrictions: boolean;

	/** The ID of this user's location. */
	readonly locationId: number;

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The full name of the user. */
	toString(): string;

	/**
	 * (Read) Update this user's data.
	 *
	 * Other users created from the same data will not be updated.
	 */
	update(): Promise<void>;

	/** (Read) Get all the devices assigned to this user. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get all the groups the user is in. */
	getGroups(): Promise<UserGroup[]>;

	/** (Read) Get all the groups the user can teach. */
	getClasses(): Promise<UserGroup[]>;

	/** (Read) Get the location this user belongs to. */
	getLocation(): Promise<Location | null>;

	/**
	 * (Edit) Set this user's username.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the username is the same as the user's current
	 * username.
	 */
	setUsername(username: string): Promise<void>;

	/**
	 * (Edit) Set this user's LDAP domain.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the domain is the same as the user's current
	 * domain.
	 */
	setDomain(domain: string): Promise<void>;

	/**
	 * (Edit) Set this user's first name.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the name is the same as the user's current
	 * first name.
	 */
	setFirstName(firstName: string): Promise<void>;

	/**
	 * (Edit) Set this user's last name.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the name is the same as the user's current
	 * last name.
	 */
	setLastName(lastName: string): Promise<void>;

	/**
	 * (Edit) Set this user's Jamf School login password.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 */
	setPassword(password: string): Promise<void>;

	/**
	 * (Edit) Set this user's email address.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the email is the same as the user's current
	 * email.
	 */
	setEmail(email: string): Promise<void>;

	/**
	 * (Edit) Set the groups this user is in.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 */
	setGroups(groups: { id: number }[]): Promise<void>;

	/**
	 * (Edit) Set this user's location. Moving a user will also move all the
	 * devices they own.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 *
	 * This method is a no-op if the location ID is the same as the user's
	 * current location ID.
	 */
	setLocation(location: { id: number }): Promise<void>;

	/**
	 * (Edit) Set the groups this user can teach.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 */
	setClasses(groups: { id: number }[]): Promise<void>;

	/**
	 * (Edit) Set this user's children.
	 *
	 * This method will not update the user object. To update the object, call
	 * `User.update()`.
	 */
	setChildren(children: { id: number }[]): Promise<void>;

	/**
	 * (Read, Add) Restart all of this user's devices.
	 *
	 * Note that failing to restart a device will not throw an exception.
	 */
	restartDevices(): Promise<void>;
}
