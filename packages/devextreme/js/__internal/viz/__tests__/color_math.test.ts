import { describe, expect, it } from '@jest/globals';
import { Color } from '@ts/color';
import { mixColors, shiftChannels, shiftLightness } from '@ts/viz/color_math';

const BLUE = 'var(--dx-viz-blue, #0078d4)';
const GREEN = 'var(--dx-viz-green, #008f04)';

describe('mixing two colors', () => {
  it('blends literals in js, exactly as the palettes always did', () => {
    expect(mixColors('#0078d4', '#008f04', 0.25))
      .toBe(new Color('#0078d4').blend('#008f04', 0.25).toHex());
  });

  it('hands the mixing to the browser as soon as one side is a name', () => {
    expect(mixColors(BLUE, '#008f04', 0.25))
      .toBe('color-mix(in srgb, var(--dx-viz-blue, #0078d4) 75%, #008f04)');
    expect(mixColors('#0078d4', GREEN, 0.25))
      .toBe('color-mix(in srgb, #0078d4 75%, var(--dx-viz-green, #008f04))');
  });

  it('states the share as the share of the first color', () => {
    expect(mixColors(BLUE, GREEN, 0)).toContain('100%');
    expect(mixColors(BLUE, GREEN, 1)).toContain('0%');
  });

  it('keeps the share short enough to read', () => {
    expect(mixColors(BLUE, GREEN, 0.8)).toContain('20%');
    expect(mixColors(BLUE, GREEN, 1 / 3)).toContain('66.6667%');
  });
});

describe('shifting every channel', () => {
  it('asks the browser to move the name it was given', () => {
    expect(shiftChannels(BLUE, 50))
      .toBe('rgb(from var(--dx-viz-blue, #0078d4) calc(r + 50) calc(g + 50) calc(b + 50))');
  });

  it('carries a negative shift as a negative step', () => {
    expect(shiftChannels(BLUE, -25)).toContain('calc(r + -25)');
  });
});

describe('fanning the lightness out over the cycles', () => {
  it('leaves the middle cycle alone', () => {
    expect(shiftLightness(BLUE, 1, 3)).toBe(BLUE);
  });

  it('darkens the cycles below the middle, down to a floor', () => {
    expect(shiftLightness(BLUE, 0, 3))
      .toBe('hsl(from var(--dx-viz-blue, #0078d4) h s calc(l + 1 * (max(calc(l - 133.3333), min(50, calc(l * 0.9))) - l)))');
  });

  it('lightens the cycles above the middle, up to a ceiling', () => {
    expect(shiftLightness(BLUE, 2, 3))
      .toBe('hsl(from var(--dx-viz-blue, #0078d4) h s calc(l + 1 * (min(calc(l + 133.3333), max(80, calc(l + (100 - l) * 0.15))) - l)))');
  });

  it('moves the outer cycles further than the inner ones', () => {
    const inner = shiftLightness(BLUE, 1, 5);
    const outer = shiftLightness(BLUE, 0, 5);

    expect(inner).toContain('calc(l + 0.5 * ');
    expect(outer).toContain('calc(l + 1 * ');
  });
});
