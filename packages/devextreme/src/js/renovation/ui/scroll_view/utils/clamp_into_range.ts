export function clampIntoRange(value: number, max: number, min: number): number {
  return Math.max(Math.min(value, max), min);
}
