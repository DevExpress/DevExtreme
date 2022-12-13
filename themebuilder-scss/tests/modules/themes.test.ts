/* eslint no-console: 0 */
import {
  sizes, materialColors, materialModes, genericColors,
} from '../../../build/gulp/styles/theme-options';
import themes from '../../src/modules/themes';

const generateThemeName = (theme: string, size: string, color: string, mode: string = null): string => `${theme}.${color}${mode ? `-${mode}` : ''}${size === 'default' ? '' : '-compact'}`;

describe('Themes', () => {
  test('check if all possible themes are available', () => {
    const allThemes: string[] = [];
    sizes.forEach((size) => {
      materialModes.forEach((mode) => {
        materialColors.forEach((color) => allThemes.push(generateThemeName('material', size, color, mode)));
      });
      genericColors.forEach((color) => allThemes.push(generateThemeName('generic', size, color)));
    });
    const builderConfigThemes: string[] = themes.map((t) => `${t.name}.${t.colorScheme}`);
    const nonListedThemes = allThemes.filter((t) => !builderConfigThemes.includes(t));
    if (nonListedThemes.length > 0) console.log(nonListedThemes);
    expect(nonListedThemes.length).toBe(0);
  });
});
