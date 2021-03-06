import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
	count: number;
	devices: {
		UDID: string;
		locationId: number;
		serialNumber: string;
		name: string;
		isManaged: boolean;
		isSupervised: boolean;
		class: string;
		assetTag: string;
		os: {
			prefix: string;
			version: string;
		};
		model: {
			name: string;
			identifier: string;
			type: string;
		};
		owner: {
			id: number;
			locationId: number;
			name: string;
			username?: string;
			email?: string;
			firstName?: string;
			lastName?: string;
			notes?: string;
			modified?: string;
			vpp: {
				status: string;
			}[];
		};
		groups: string[];
		enrollType: "manual" | "ac2" | "ac2Pending" | "dep" | "depPending";
		batteryLevel: number;
		totalCapacity: number;
		availableCapacity: number;
		iCloudBackupEnabled: boolean;
		iCloudBackupLatest: string;
		iTunesStoreLoggedIn: boolean;
		isBootstrapStored?: boolean;
		region: {
			// Yeah, it really is a key named "string"
			string: string;
			coordinates?: string;
		};
		apps?: {
			name: string;
			identifier: string;
			version: string;
			vendor: string;
			icon: string;
		}[];
		modified: string;
		depProfile: string;
		notes: string;
		lastCheckin: string;
		networkInformation: {
			IPAddress: string;
			isNetworkTethered: string;
			BluetoothMAC: string;
			WiFiMAC: string;
			EthernetMACs?: string;
			VoiceRoamingEnabled: string;
			DataRoamingEnabled: string;
			PersonalHotspotEnabled: string;
			ServiceSubscription?: {
				CarrierSettingsVersion: string;
				CurrentCarrierNetwork: string;
				CurrentMCC: string;
				CurrentMNC: string;
				ICCID: string;
				IMEI: string;
				IsDataPreferred: boolean;
				IsRoaming: boolean;
				IsVoicePreferred: boolean;
				Label: string;
				LabelID: string;
				MEID?: string;
				EID?: string;
				PhoneNumber: string;
				Slot: string;
			}[];
		};
	}[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		count: { type: "int32" },
		devices: {
			elements: {
				properties: {
					UDID: { type: "string" },
					locationId: { type: "int32" },
					serialNumber: { type: "string" },
					name: { type: "string" },
					isManaged: { type: "boolean" },
					isSupervised: { type: "boolean" },
					class: { type: "string" },
					assetTag: { type: "string" },
					os: {
						properties: {
							prefix: { type: "string" },
							version: { type: "string" },
						},
					},
					model: {
						properties: {
							name: { type: "string" },
							identifier: { type: "string" },
							type: { type: "string" },
						},
					},
					owner: {
						properties: {
							id: { type: "int32" },
							locationId: { type: "int32" },
							name: { type: "string" },
							vpp: {
								elements: {
									properties: {
										status: { type: "string" },
									},
								},
							},
						},
						optionalProperties: {
							username: { type: "string" },
							email: { type: "string" },
							firstName: { type: "string" },
							lastName: { type: "string" },
							notes: { type: "string" },
							modified: { type: "string" },
						},
					},
					groups: {
						elements: { type: "string" },
					},
					enrollType: {
						enum: ["ac2", "ac2Pending", "dep", "depPending", "manual"],
					},
					batteryLevel: { type: "float32" },
					totalCapacity: { type: "float32" },
					availableCapacity: { type: "float32" },
					iCloudBackupEnabled: { type: "boolean" },
					iCloudBackupLatest: { type: "string" },
					iTunesStoreLoggedIn: { type: "boolean" },
					modified: { type: "string" },
					lastCheckin: { type: "string" },
					depProfile: { type: "string" },
					notes: { type: "string" },
					region: {
						properties: {
							string: { type: "string" },
						},
						optionalProperties: {
							coordinates: { type: "string" },
						},
					},
					networkInformation: {
						properties: {
							IPAddress: { type: "string" },
							isNetworkTethered: { type: "string" },
							BluetoothMAC: { type: "string" },
							WiFiMAC: { type: "string" },
							VoiceRoamingEnabled: { type: "string" },
							DataRoamingEnabled: { type: "string" },
							PersonalHotspotEnabled: { type: "string" },
						},
						optionalProperties: {
							EthernetMACs: { type: "string" },
							ServiceSubscription: {
								elements: {
									properties: {
										CarrierSettingsVersion: { type: "string" },
										CurrentCarrierNetwork: { type: "string" },
										CurrentMCC: { type: "string" },
										CurrentMNC: { type: "string" },
										ICCID: { type: "string" },
										IMEI: { type: "string" },
										IsDataPreferred: { type: "boolean" },
										IsRoaming: { type: "boolean" },
										IsVoicePreferred: { type: "boolean" },
										Label: { type: "string" },
										LabelID: { type: "string" },
										PhoneNumber: { type: "string" },
										Slot: { type: "string" },
									},
									optionalProperties: {
										MEID: { type: "string" },
										EID: { type: "string" },
									},
								},
							},
						},
					},
				},
				optionalProperties: {
					isBootstrapStored: { type: "boolean" },
					apps: {
						elements: {
							properties: {
								name: { type: "string" },
								identifier: { type: "string" },
								version: { type: "string" },
								vendor: { type: "string" },
								icon: { type: "string" },
							},
						},
					},
				},
			},
		},
	},
};

export default ajv.compile(responseSchema);
