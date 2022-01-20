import { isMaterial, isCompact, current as currentTheme } from '../../../../ui/themes';

export const oneDigitWidth = 10;
export function calculateValuesFittedWidth(minWidth: number, values: number[]): number {
  const themeName = currentTheme();
  const padding = isMaterial(themeName) && !isCompact(themeName) ? 22 : 0;

  return minWidth + padding + oneDigitWidth * Math.max(...values).toString().length;
}
