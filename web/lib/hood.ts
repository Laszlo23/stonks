import type { Address } from "viem";

export const hoodRegistry = "0x3E717dc89AAF4605b607324329EEeB0a8B3C8A1c" as const;
export const hoodController = "0x7900b2B8Cc3f0616B18C68AdA7E115A9022Ca04a" as const;
export const hoodResolver = "0xa9ed3C73F522875F18DAa631429125da893D8E53" as const;
export const streetNode = "0xe53fc30b856d0932ab00a9321c7a444ee971220c8a940119b9cb0cd7f112e0dd" as const;
export const nameCover = 1_000_000_000_000_000n;
export const nameYear = 31_536_000n;

/** Filled when RegisterStreet broadcasts. Zero until the deployer can pay for street.hood. */
export const streetNames: Address = "0x0000000000000000000000000000000000000000";

export const resolverAbi = [
  {
    type: "function",
    name: "resolve",
    stateMutability: "view",
    inputs: [{ name: "name", type: "string" }],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

export const controllerAbi = [
  {
    type: "function",
    name: "available",
    stateMutability: "view",
    inputs: [{ name: "name", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "price",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "string" },
      { name: "duration", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const registryAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [{ name: "node", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

export const streetNamesAbi = [
  {
    type: "function",
    name: "buy",
    stateMutability: "payable",
    inputs: [{ name: "label", type: "string" }],
    outputs: [],
  },
  {
    type: "error",
    name: "BadLabel",
    inputs: [],
  },
  {
    type: "error",
    name: "BadCover",
    inputs: [],
  },
  {
    type: "error",
    name: "Taken",
    inputs: [],
  },
  {
    type: "error",
    name: "NotParent",
    inputs: [],
  },
] as const;

export function hoodLabel(label: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(label);
}
