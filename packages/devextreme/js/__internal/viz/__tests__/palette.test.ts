import { describe, expect, it } from '@jest/globals';
import { createPalette, getDiscretePalette, getGradientPalette } from '@ts/viz/palette';

describe('a palette of published names', () => {
  const asked = (count: number, extensionMode: string): string[] => createPalette(
    'fluent next',
    { useHighlight: true, extensionMode },
  ).generateColors(count);

  it('hands the names themselves to the widget while the palette suffices', () => {
    expect(asked(6, 'blend')).toEqual([
      'var(--dx-viz-blue, #0078d4)',
      'var(--dx-viz-red, #c83d3d)',
      'var(--dx-viz-green, #008f04)',
      'var(--dx-viz-yellow, #eaa300)',
      'var(--dx-viz-pink, #e43ba6)',
      'var(--dx-viz-purple, #865cbf)',
    ]);
  });

  it('mixes further colors in css, so they follow the names they are mixed from', () => {
    expect(asked(7, 'blend')[2])
      .toBe('color-mix(in srgb, var(--dx-viz-red, #c83d3d) 50%, var(--dx-viz-green, #008f04))');
  });

  it('shades further colors in css when the palette is cycled', () => {
    const colors = asked(12, 'alternate');

    expect(colors).toHaveLength(12);
    expect(colors[6]).toBe('rgb(from var(--dx-viz-blue, #0078d4) calc(r + 50) calc(g + 50) calc(b + 50))');
  });

  it('fans the cycles out in css when the palette is extrapolated', () => {
    const colors = asked(12, 'extrapolate');

    expect(colors[0]).toBe('hsl(from var(--dx-viz-blue, #0078d4) h s calc(l + 1 * (max(calc(l - 75), min(50, calc(l * 0.9))) - l)))');
    expect(colors[6]).toBe('hsl(from var(--dx-viz-blue, #0078d4) h s calc(l + 1 * (min(calc(l + 75), max(80, calc(l + (100 - l) * 0.15))) - l)))');
  });

  it('keeps the gradient in css too', () => {
    expect(getGradientPalette('fluent next', undefined).getColor(0.25))
      .toBe('color-mix(in srgb, var(--dx-viz-blue, #0078d4) 75%, var(--dx-viz-green, #008f04))');
  });

  it.each([['test'], [-1], [2], [undefined]])('answers with nothing when the ratio is %s', (ratio) => {
    expect(getGradientPalette('fluent next', undefined).getColor(ratio as number)).toBeNull();
  });

  it('splits into discrete colors in css, so a tree map follows the names too', () => {
    const discrete = getDiscretePalette('fluent next', 3, undefined);

    expect([discrete.getColor(0), discrete.getColor(1), discrete.getColor(2)]).toEqual([
      'color-mix(in srgb, var(--dx-viz-blue, #0078d4) 100%, var(--dx-viz-blue, #0078d4))',
      'color-mix(in srgb, var(--dx-viz-blue, #0078d4) 50%, var(--dx-viz-green, #008f04))',
      'color-mix(in srgb, var(--dx-viz-green, #008f04) 100%, var(--dx-viz-green, #008f04))',
    ]);
  });
});
