import { resolveBundle } from '../modules/bundle-resolver';

interface ThemeData {
    theme: string;
    colorScheme: string;
    fileName: string;
}

describe('Bundle resolver', () => {
    test('resolveBundle - the right filename is generated', () => {

        const fileNamesForThemes: Array<ThemeData> = [
            { theme: 'generic', colorScheme: 'light', fileName: 'bundles/dx.light.scss' },
            { theme: 'generic', colorScheme: 'dark', fileName: 'bundles/dx.dark.scss' },
            { theme: 'generic', colorScheme: 'greenmist', fileName: 'bundles/dx.greenmist.scss' },
            { theme: 'generic', colorScheme: 'light-compact', fileName: 'bundles/dx.light.compact.scss' },
            { theme: 'material', colorScheme: 'blue-light', fileName: 'bundles/dx.material.blue.light.scss' },
            { theme: 'material', colorScheme: 'blue-light-compact', fileName: 'bundles/dx.material.blue.light.compact.scss' }
        ];

        fileNamesForThemes.forEach((themeData: ThemeData) => {
            expect(resolveBundle(themeData.theme, themeData.colorScheme)).toBe(themeData.fileName);
        });
    });
});
