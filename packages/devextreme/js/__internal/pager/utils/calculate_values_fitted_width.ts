export const oneDigitWidth = 10;
export function calculateValuesFittedWidth(minWidth: number, values: number[]): number {
  return minWidth + oneDigitWidth * Math.max(...values).toString().length;
}
