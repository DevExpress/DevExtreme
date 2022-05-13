import { join, resolve } from 'path';
import resolveBundle from '../../src/modules/bundle-resolver';

interface ThemeData {
  theme: string;
  colorScheme: string;
  fileName: string;
}

describe('Bundle resolver', () => {
  test('resolveBundle - the right filename is generated', () => {
    const fileNamesForThemes: ThemeData[] = [
      { theme: 'generic', colorScheme: 'light', fileName: 'dx.light.scss' },
      { theme: 'generic', colorScheme: 'dark', fileName: 'dx.dark.scss' },
      { theme: 'generic', colorScheme: 'greenmist', fileName: 'dx.greenmist.scss' },
      { theme: 'generic', colorScheme: 'light-compact', fileName: 'dx.light.compact.scss' },
      { theme: 'material', colorScheme: 'blue-light', fileName: 'dx.material.blue.light.scss' },
      { theme: 'material', colorScheme: 'blue-light-compact', fileName: 'dx.material.blue.light.compact.scss' },
    ];

    fileNamesForThemes.forEach((themeData: ThemeData) => {
      const basePath = resolve(join(__dirname, '..', '..', 'src', 'data', 'scss', 'bundles'));
      const includePath = resolve(join(__dirname, '..', '..', 'src', 'data', 'scss', 'widgets', themeData.theme));

      const result = resolveBundle(themeData.theme, themeData.colorScheme);
      expect(result.file).toBe(join(basePath, themeData.fileName));
      expect(result.options.loadPaths).toEqual([includePath]);
    });
  });
});
