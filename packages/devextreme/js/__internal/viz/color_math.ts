import { Color } from '@ts/color';
import { fallbackOf, isCssVariableReference } from '@ts/core/utils/css_variables';

const PERCENT = 100;
const LIGHTNESS_FLOOR = 'min(50, calc(l * 0.9))';
const LIGHTNESS_CEILING = 'max(80, calc(l + (100 - l) * 0.15))';

function rounded(value: number): number {
  return Number(value.toFixed(4));
}

function shiftLightnessOfName(color: string, cycleIndex: number, cycleCount: number): string {
  const cycleMiddle = (cycleCount - 1) / 2;
  const cycleDiff = cycleIndex - cycleMiddle;

  if (cycleDiff === 0) {
    return color;
  }

  const span = rounded((cycleCount - 1 / cycleCount) * 0.5 * PERCENT);
  const ratio = rounded(Math.abs(cycleDiff / cycleMiddle));
  const bound = cycleDiff < 0
    ? `max(calc(l - ${span}), ${LIGHTNESS_FLOOR})`
    : `min(calc(l + ${span}), ${LIGHTNESS_CEILING})`;

  return `hsl(from ${color} h s calc(l + ${ratio} * (${bound} - l)))`;
}

function shiftLightnessOfLiteral(color: string, cycleIndex: number, cycleCount: number): string {
  const { hsl } = new Color(color);
  let l = hsl.l / PERCENT;
  const diapason = cycleCount - 1 / cycleCount;
  let minL = l - diapason * 0.5;
  let maxL = l + diapason * 0.5;
  const cycleMiddle = (cycleCount - 1) / 2;
  const cycleDiff = cycleIndex - cycleMiddle;

  if (minL < Math.min(0.5, l * 0.9)) {
    minL = Math.min(0.5, l * 0.9);
  }

  if (maxL > Math.max(0.8, l + (1 - l) * 0.15)) {
    maxL = Math.max(0.8, l + (1 - l) * 0.15);
  }

  if (cycleDiff < 0) {
    l -= ((minL - l) * cycleDiff) / cycleMiddle;
  } else {
    l += (maxL - l) * (cycleDiff / cycleMiddle);
  }
  hsl.l = l * PERCENT;

  return Color.fromHSL(hsl).toHex();
}

export function mixColors(first: string, second: string, ratio: number): string {
  if (isCssVariableReference(first) || isCssVariableReference(second)) {
    return `color-mix(in srgb, ${first} ${rounded((1 - ratio) * PERCENT)}%, ${second})`;
  }

  return new Color(fallbackOf(first)).blend(fallbackOf(second), ratio).toHex();
}

export function shiftChannels(color: string, shift: number): string {
  if (isCssVariableReference(color)) {
    return `rgb(from ${color} calc(r + ${shift}) calc(g + ${shift}) calc(b + ${shift}))`;
  }

  return new Color(color).alter(shift).toHex();
}

export function shiftLightness(color: string, cycleIndex: number, cycleCount: number): string {
  return isCssVariableReference(color)
    ? shiftLightnessOfName(color, cycleIndex, cycleCount)
    : shiftLightnessOfLiteral(color, cycleIndex, cycleCount);
}
