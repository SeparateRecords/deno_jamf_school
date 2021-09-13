import type { User } from "./User.ts";

/**
 * UserGroup represents a named group of users.
 */
export interface UserGroup {
	/** Discriminator for type checks. */
	readonly type: "UserGroup";

	/** The ID of the user group. */
	readonly id: number;

	/** The name of the user group. */
	readonly name: string;

	/** A description of the user group (may be empty) */
	readonly description: string;

	/**
	 * (Read) Update this user group's data.
	 *
	 * Other user groups created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the users in the user group. */
	getUsers(): Promise<User[]>;
}
