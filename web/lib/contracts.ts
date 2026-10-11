import { getAddress, zeroAddress, type Address } from "viem";
import raw from "./addresses.json";
import { deskAbi, pitAbi, showroomAbi } from "./abi";

export const addresses = {
  chainId: raw.chainId,
  desk: getAddress(raw.desk),
  pit: getAddress(raw.pit),
  showroom: getAddress(raw.showroom),
  stonk: getAddress(raw.stonk),
  usdg: getAddress(raw.usdg),
} as const;

export const seated = addresses.desk !== zeroAddress;

export const deskContract = {
  address: addresses.desk,
  abi: deskAbi,
} as const;

export const pitContract = {
  address: addresses.pit,
  abi: pitAbi,
} as const;

export const showroomContract = {
  address: addresses.showroom,
  abi: showroomAbi,
} as const;

export function sameAddress(left?: Address | null, right?: Address | null): boolean {
  if (!left || !right) return false;
  return left.toLowerCase() === right.toLowerCase();
}
