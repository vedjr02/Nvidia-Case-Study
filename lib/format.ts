/**
 * Formatting helpers.
 *
 * All monetary values in the datasets are stored in millions of US dollars,
 * exactly as NVIDIA reports them, so that no precision is lost in the source
 * of truth. Conversion to billions happens only at the point of display.
 */

const MILLIONS_PER_BILLION = 1_000;

/** $75.2B — the default presentation for revenue-scale figures. */
export function usdBillions(millions: number, decimals = 1): string {
  return `$${(millions / MILLIONS_PER_BILLION).toFixed(decimals)}B`;
}

/** $1,234M — used where sub-billion precision is the point. */
export function usdMillions(millions: number): string {
  return `$${millions.toLocaleString("en-US", { maximumFractionDigits: 0 })}M`;
}

/**
 * Scales automatically. Used in tooltips and axes where a single series spans
 * three orders of magnitude, as NVIDIA's data centre revenue does.
 */
export function usdAuto(millions: number): string {
  if (Math.abs(millions) >= MILLIONS_PER_BILLION) {
    const billions = millions / MILLIONS_PER_BILLION;
    return `$${billions.toFixed(billions >= 100 ? 0 : 1)}B`;
  }
  return usdMillions(millions);
}

/** Compact axis label: 75 rather than $75.2B, with the unit stated on the axis. */
export function axisBillions(millions: number): string {
  return (millions / MILLIONS_PER_BILLION).toFixed(0);
}

export function percent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Signed percentage, for period-on-period change. */
export function percentChange(value: number, decimals = 0): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function multiple(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}×`;
}

/**
 * NVIDIA's fiscal year runs roughly a year ahead of the calendar: fiscal 2027
 * began in late January 2026. Readers consistently misread the fiscal labels,
 * so charts are plotted on calendar time and fiscal labels appear only in
 * tooltips, where there is room to disambiguate.
 */
export function calendarLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  return `Q${quarter} ${date.getUTCFullYear()}`;
}

export function yearOf(isoDate: string): number {
  return Number(isoDate.slice(0, 4));
}

/** Converts an ISO date to a fractional year, for continuous time axes. */
export function toTimeValue(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getTime();
}

export function formatMonthYear(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
