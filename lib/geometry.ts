/**
 * SVG path construction for the hand-drawn exhibits.
 *
 * Recharts handles the analytical charts, but the opening sequence and the
 * inline sparklines need paths we can animate with `pathLength`, so they are
 * generated here.
 */

export type Point = { x: number; y: number };

export type Scale = {
  (value: number): number;
  domain: [number, number];
  range: [number, number];
};

export function linearScale(
  domain: [number, number],
  range: [number, number],
): Scale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;

  const scale = ((value: number) =>
    r0 + ((value - d0) / span) * (r1 - r0)) as Scale;
  scale.domain = domain;
  scale.range = range;
  return scale;
}

export function logScale(
  domain: [number, number],
  range: [number, number],
): Scale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const l0 = Math.log10(Math.max(d0, 1e-9));
  const l1 = Math.log10(Math.max(d1, 1e-9));
  const span = l1 - l0 || 1;

  const scale = ((value: number) =>
    r0 +
    ((Math.log10(Math.max(value, 1e-9)) - l0) / span) * (r1 - r0)) as Scale;
  scale.domain = domain;
  scale.range = range;
  return scale;
}

export function extent(values: number[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return [min, max];
}

/** Straight-segment path. The honest default for financial series. */
export function linePath(points: Point[]): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
}

/**
 * Monotone cubic interpolation.
 *
 * Used only where the sample density is high enough that the curve cannot
 * invent a movement the data does not contain — the opening sequence plots 138
 * monthly closes across the full width, so between-point curvature is
 * sub-pixel. Monotonicity guarantees the curve never overshoots a local
 * extreme, which a naive Catmull-Rom spline would.
 */
export function smoothPath(points: Point[]): string {
  const n = points.length;
  if (n === 0) return "";
  if (n < 3) return linePath(points);

  // Slopes of the secant lines between consecutive points.
  const dx: number[] = [];
  const dy: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const h = points[i + 1].x - points[i].x;
    dx.push(h);
    dy.push(points[i + 1].y - points[i].y);
    slope.push(h === 0 ? 0 : (points[i + 1].y - points[i].y) / h);
  }

  // Tangents, clamped so the interpolant stays monotone on each interval.
  const tangent: number[] = new Array(n).fill(0);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i += 1) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangent[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }

  let d = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i += 1) {
    const h = dx[i] / 3;
    const c1x = points[i].x + h;
    const c1y = points[i].y + tangent[i] * h;
    const c2x = points[i + 1].x - h;
    const c2y = points[i + 1].y - tangent[i + 1] * h;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${points[i + 1].x.toFixed(2)},${points[i + 1].y.toFixed(2)}`;
  }
  return d;
}

/** Closes a line path down to a baseline, for area fills. */
export function areaFromLine(
  path: string,
  points: Point[],
  baseline: number,
): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${path} L${last.x.toFixed(2)},${baseline.toFixed(2)} L${first.x.toFixed(2)},${baseline.toFixed(2)} Z`;
}
