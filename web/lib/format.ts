const UNIT = 10n ** 18n;

export function sqrt(value: bigint): bigint {
  if (value < 2n) return value;
  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (value / y + y) / 2n;
  }
  return x;
}

/** Geometric size of a bag. Matches the pit: fees raise it. */
export function bagSize(usdg: bigint, stonk: bigint): bigint {
  if (usdg === 0n || stonk === 0n) return 0n;
  return 2n * sqrt(usdg * stonk);
}

export function formatAmount(value: bigint, digits = 2): string {
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const whole = abs / UNIT;
  const fraction = abs % UNIT;
  const scale = 10n ** BigInt(18 - digits);
  const half = scale / 2n;
  let fracDigits = fraction / scale;
  if (fraction % scale >= half) fracDigits += 1n;

  let wholeNumber = whole;
  const cap = 10n ** BigInt(digits);
  if (fracDigits >= cap) {
    wholeNumber += 1n;
    fracDigits = 0n;
  }

  const grouped = wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const frac = fracDigits.toString().padStart(digits, "0");
  return `${negative ? "-" : ""}${grouped}.${frac}`;
}

export function parseAmount(text: string): bigint | null {
  const trimmed = text.trim();
  if (!/^\d+(\.\d{0,18})?$/.test(trimmed)) return null;
  const [whole, frac = ""] = trimmed.split(".");
  if (whole.length > 1 && whole.startsWith("0")) return null;
  const padded = (frac + "0".repeat(18)).slice(0, 18);
  return BigInt(whole) * UNIT + BigInt(padded);
}

export function toInput(value: bigint): string {
  const whole = value / UNIT;
  const fraction = (value % UNIT).toString().padStart(18, "0").replace(/0+$/, "");
  if (fraction.length === 0) return whole.toString();
  return `${whole.toString()}.${fraction}`;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function deskNumber(id: bigint): string {
  return id.toString().padStart(2, "0");
}
