import { readFileSync } from 'fs';
import { join } from 'path';
import { buildTheme } from '../../src/modules/builder';
import commands from '../../src/modules/commands';
// eslint-disable-next-line import/extensions
import { version, metadata } from '../../src/data/metadata/dx-theme-builder-metadata';

const buildTimeout = 150000;

const normalizeCss = (css: string): string => css
  .toLowerCase()
  .replace(/\s*\/\*[\s\S]*?\*\/\s*/g, '')
  .trim();

jest.mock('fibers', () => undefined);

describe('Builder integration tests', () => {
  test('Build theme without parameters', () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
      expect(result.swatchSelector).toBe(null);
      expect(Object.keys(result.compiledMetadata).length).toBeGreaterThan(100);
      expect(result.widgets.length).toBeGreaterThan(50);
      expect(result.unusedWidgets.length).toBe(0);
      expect(result.version).toBe(version);
    });
  }, buildTimeout);

  test('Build base theme with swatch', () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      makeSwatch: true,
      outputColorScheme: 'custom-scheme',
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
      expect(result.swatchSelector).toBe('.dx-swatch-custom-scheme');
    });
  }, buildTimeout);

  test('Build theme according to bootstrap', () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      inputFile: 'some.less',
      data: '',
      outputColorScheme: 'custom-scheme',
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
    });
  }, buildTimeout);

  test('Build theme with changed color constants (generic)', () => {
    const allChangedVariables = metadata.generic.map((item) => ({
      key: item.Key,
      value: item.Type === 'color' ? '#abcdef' : '10px',
    }));

    allChangedVariables.push({ key: '@undefined-variable', value: '#abcdef' });

    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      items: allChangedVariables,
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
      expect(result.css.includes('#abcdef')).toBe(true);
    });
  }, buildTimeout);

  test('Build theme with changed color constants (material)', () => {
    const allChangedVariables = metadata.material.map((item) => ({
      key: item.Key,
      value: item.Type === 'color' ? '#abcdef' : '10px',
    }));

    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      baseTheme: 'material.blue.light',
      items: allChangedVariables,
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
      expect(result.css.includes('#abcdef')).toBe(true);
    });
  }, buildTimeout);

  test('Theme built without parameters is the same that in distribution (generic)', () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      items: [],
    };

    return buildTheme(config).then((result) => {
      const themeBuilderCss = normalizeCss(result.css);
      const distributionCss = normalizeCss(readFileSync(join(__dirname, '../../../artifacts/css/dx.light.css'), 'utf8'));
      expect(themeBuilderCss).toBe(distributionCss);
    });
  }, buildTimeout);

  test('Theme built without parameters is the same that in distribution (material)', () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      baseTheme: 'material.blue.light',
      items: [],
    };

    return buildTheme(config).then((result) => {
      const themeBuilderCss = normalizeCss(result.css);
      const distributionCss = normalizeCss(readFileSync(join(__dirname, '../../../artifacts/css/dx.material.blue.light.css'), 'utf8'));
      expect(themeBuilderCss).toBe(distributionCss);
    });
  }, buildTimeout);
});
