/* eslint no-console: 0 */
import { getThemes } from '../../../devextreme-scss/build/theme-options';
import themes from '../../src/modules/themes';

describe('Themes', () => {
  test('check components and theme builder themes', () => {
    const knownThemes: string[] = getThemes().map(
        ([theme, size, color, mode = null]: [string, string, string, string | null]): string =>
        `${theme}.${color}${mode ? `-${mode}` : ''}${size === 'default' ? '' : '-compact'}`
    );

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
