/* eslint no-console: 0 */
import {
  sizes, materialColors, materialModes, genericColors,
} from '../../../devextreme/build/gulp/styles/theme-options';
import themes from '../../src/modules/themes';

const generateThemeName = (theme: string, size: string, color: string, mode: string | null = null): string =>
  `${theme}.${color}${mode ? `-${mode}` : ''}${size === 'default' ? '' : '-compact'}`;

describe('Themes', () => {
  test('check components and theme builder themes', () => {
    const knownThemes: string[] = [];
    sizes.forEach((size: string) => {
      materialModes.forEach((mode: string) => {
        materialColors.forEach((color: string) => knownThemes.push(generateThemeName('material', size, color, mode)));
      });
      genericColors.forEach((color: string) => knownThemes.push(generateThemeName('generic', size, color)));
    });
    const builderThemes: string[] = themes.map((t) => `${t.name}.${t.colorScheme}`);

    const nonListedBuilderThemes: string[] = knownThemes.filter((t) => !builderThemes.includes(t));
    const ownBuilderThemes: string[] = builderThemes.filter((t) => !knownThemes.includes(t));

    if (nonListedBuilderThemes.length > 0) {
      console.log(nonListedBuilderThemes);
    }
    if (ownBuilderThemes.length > 0) {
      console.log(ownBuilderThemes);
    }

    expect(nonListedBuilderThemes.length).toBe(0);
    expect(ownBuilderThemes.length).toBe(0);
  });
});
