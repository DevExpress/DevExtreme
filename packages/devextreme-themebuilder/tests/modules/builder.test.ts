import { readFileSync } from 'fs';
import * as path from 'path';
import CleanCSS from 'clean-css';
import { buildTheme } from '../../src/modules/builder';
import commands from '../../src/modules/commands';
import { version, metadata } from '../../src/data/metadata/dx-theme-builder-metadata';
import commonOptions from '../../src/data/clean-css-options.json';

const buildTimeout = 150000;

const normalizeCss = (css: string): string => css
  .toLowerCase()
  .replace(/\s*\/\*[\s\S]*?\*\/\s*/g, '')
  .trim();

describe('Builder integration tests', () => {
  test('Build theme without parameters', async () => {
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

  test('Build base theme with swatch', async () => {
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

  test('Build theme according to bootstrap', async () => {
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

  test('Build bootstrap 5 theme', async () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      inputFile: 'bootstrap5.scss',
      bootstrapVersion: 5,
      data: '',
      outputColorScheme: 'custom-scheme',
    };

    return buildTheme(config).then((result) => {
      expect(result.css).not.toBe('');
    });
  }, buildTimeout);

  test('Build theme with changed color constants (generic)', async () => {
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

  test('Build theme with changed color constants (material)', async () => {
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

  test('Theme built without parameters is the same that in distribution (generic)', async () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      items: [],
    };

    return buildTheme(config).then(async (result) => {
      const themeBuilderCss = normalizeCss(result.css);
      const cssPath = path.resolve(__dirname, '../../../devextreme/artifacts/css/dx.light.css');
      const distributionCss = normalizeCss(readFileSync(cssPath, 'utf8'));

      const cleaner = new CleanCSS(commonOptions as any);

      const themeBuilderCssMinified = (await cleaner.minify(themeBuilderCss)).styles;
      const distributionCssMinified = (await cleaner.minify(distributionCss)).styles;
      expect(themeBuilderCssMinified).toBe(distributionCssMinified);
    });
  }, buildTimeout);

  test('Theme built without parameters is the same that in distribution (material)', async () => {
    const config: ConfigSettings = {
      command: commands.BUILD_THEME,
      outputColorScheme: 'custom-scheme',
      baseTheme: 'material.blue.light',
      items: [],
    };

    return buildTheme(config).then(async (result) => {
      const themeBuilderCss = normalizeCss(result.css);
      const cssPath = path.resolve(__dirname, '../../../devextreme/artifacts/css/dx.material.blue.light.css');
      const distributionCss = normalizeCss(readFileSync(cssPath, 'utf8'));
     
      const cleaner = new CleanCSS(commonOptions as any);

      const themeBuilderCssMinified = (await cleaner.minify(themeBuilderCss)).styles;
      const distributionCssMinified = (await cleaner.minify(distributionCss)).styles;
      expect(themeBuilderCssMinified).toBe(distributionCssMinified);
    });
  }, buildTimeout);
});
