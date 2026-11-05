/* eslint no-console: 0 */
import themes from '../../src/modules/themes';

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const { getThemes } = require('../../../devextreme-scss/build/theme-options.ts');
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

describe('Themes', () => {
  test('check components and theme builder themes', () => {
    const knownThemes: string[] = getThemes()
      .filter(([theme]: [string]) => theme !== 'fluent-next')
      .map(
        ([theme, size, color, mode = null]: [string, string, string, string | null]): string => `${theme}.${color}${mode ? `-${mode}` : ''}${size === 'default' ? '' : '-compact'}`,
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
