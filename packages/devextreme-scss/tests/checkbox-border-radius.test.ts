import * as path from 'path';
import { compileStringAsync } from 'sass-embedded';

const scssRoot = path.resolve(__dirname, '..', 'scss');

const probeSelector = '.probe';

const extractBorderRadius = (css: string): string | null => {
  const match = css.match(/\.probe\s*\{\s*border-radius:\s*([^;}]+)/);
  return match ? match[1].trim() : null;
};

const compile = async (source: string): Promise<string> => {
  const result = await compileStringAsync(source, { loadPaths: [scssRoot] });
  return result.css;
};

const genericSource = (baseBorderRadius: string): string => `
  @use "widgets/generic/colors" with (
    $color: "light",
    $base-border-radius: ${baseBorderRadius}
  );
  @use "widgets/generic/sizes" with ($size: "default");
  @use "widgets/generic/checkBox/sizes" as cb;

  ${probeSelector} { border-radius: cb.$generic-checkbox-border-radius; }
`;

const materialSource = (
  baseBorderRadius: string,
  size: 'default' | 'compact' = 'default',
): string => `
  @use "widgets/material/colors" with ($color: "blue", $mode: "light");
  @use "widgets/material/sizes" with (
    $size: "${size}",
    $base-border-radius: ${baseBorderRadius}
  );
  @use "widgets/material/checkBox/sizes" as cb;

  ${probeSelector} { border-radius: cb.$material-checkbox-border-radius; }
`;

describe('CheckBox border-radius capping (T1330300)', () => {
  describe('generic theme', () => {
    test('default radius keeps the original (small) value', async () => {
      const css = await compile(genericSource('2px'));
      expect(extractBorderRadius(css)).toBe('0px');
    });

    test('large base-border-radius is capped at 2px', async () => {
      const css = await compile(genericSource('12px'));
      expect(extractBorderRadius(css)).toBe('2px');
    })

    test('intermediate base-border-radius is not over-clamped', async () => {
      const css = await compile(genericSource('3px'));
      expect(extractBorderRadius(css)).toBe('1px');
    });
  });

  describe('material theme', () => {
    test('default size: large base-border-radius is capped at 2px', async () => {
      const css = await compile(materialSource('12px', 'default'));
      expect(extractBorderRadius(css)).toBe('2px');
    });

    test('default size: small base-border-radius is not over-clamped', async () => {
      const css = await compile(materialSource('3px', 'default'));
      expect(extractBorderRadius(css)).toBe('1px');
    });

    test('compact size: large base-border-radius is capped at 2px', async () => {
      const css = await compile(materialSource('12px', 'compact'));
      expect(extractBorderRadius(css)).toBe('2px');
    });

    test('compact size: small base-border-radius is not over-clamped', async () => {
      const css = await compile(materialSource('1px', 'compact'));
      expect(extractBorderRadius(css)).toBe('1px');
    });
  });
});

