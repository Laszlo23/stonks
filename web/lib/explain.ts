import { BaseError, ContractFunctionRevertedError } from "viem";

type RevertName =
  | "NotIdle"
  | "NotOwner"
  | "EmptyBag"
  | "Slippage"
  | "NoLiquidity"
  | "NotListed"
  | "NotSeller"
  | "BadAmount"
  | "BadPrice"
  | "BadId"
  | "NotLocal"
  | "NoneHeld"
  | "EmptyTill"
  | "BadLabel"
  | "BadCover"
  | "Taken"
  | "NotParent";

function isRevertName(name: string): name is RevertName {
  switch (name) {
    case "NotIdle":
    case "NotOwner":
    case "EmptyBag":
    case "Slippage":
    case "NoLiquidity":
    case "NotListed":
    case "NotSeller":
    case "BadAmount":
    case "BadPrice":
    case "BadId":
    case "NotLocal":
    case "NoneHeld":
    case "EmptyTill":
    case "BadLabel":
    case "BadCover":
    case "Taken":
    case "NotParent":
      return true;
    default:
      return false;
  }
}

function reason(name: RevertName): string {
  switch (name) {
    case "NotIdle":
      return "That desk is not free.";
    case "NotOwner":
      return "That desk is not yours.";
    case "EmptyBag":
      return "The bag needs both USDG and STONK.";
    case "Slippage":
      return "The quote moved. Try again.";
    case "NoLiquidity":
      return "The pit has nothing to trade.";
    case "NotListed":
      return "That listing is gone.";
    case "NotSeller":
      return "Only the seller can take it back.";
    case "BadAmount":
    case "BadPrice":
      return "Enter an amount.";
    case "BadId":
      return "That desk does not exist.";
    case "NotLocal":
      return "The draw only works on the practice table.";
    case "NoneHeld":
      return "You do not hold that pass.";
    case "EmptyTill":
      return "There is no cover to take.";
    case "BadLabel":
      return "Use 3 to 32 letters, numbers, or a hyphen.";
    case "BadCover":
      return "The cover is 0.001 ETH.";
    case "Taken":
      return "That name is taken.";
    case "NotParent":
      return "street.hood is not seated on this contract.";
    default: {
      const exhaustive: never = name;
      return exhaustive;
    }
  }
}

export function explain(error: unknown): string {
  if (error instanceof BaseError) {
    const revert = error.walk((item) => item instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? "";
      if (isRevertName(name)) return reason(name);
    }
    if (error.shortMessage.toLowerCase().includes("user rejected") || error.message.toLowerCase().includes("user rejected")) {
      return "The wallet did not confirm.";
    }
  }
  if (error instanceof Error && error.message.toLowerCase().includes("user rejected")) {
    return "The wallet did not confirm.";
  }
  return "The table refused the move.";
}
