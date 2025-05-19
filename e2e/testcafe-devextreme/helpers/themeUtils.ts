import { isString } from 'devextreme/core/utils/type';
import { changeTheme } from './changeTheme';
import { a11yCheck } from './accessibility/utils';

const defaultThemeName = 'generic.light';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
  return ` (${themeName.replace(/\./g, '-')})`;
};

export const isMaterial = (): boolean => process.env.theme === 'material.blue.light';

export const isFluent = (): boolean => process.env.theme === 'fluent.blue.light';

export const isMaterialBased = (): boolean => isMaterial() || isFluent();

export const getFullThemeName = (): string => process.env.theme ?? defaultThemeName;

export const getThemeName = (): string => getFullThemeName().split('.')[0];

export const getDarkThemeName = (): string => getFullThemeName().replace('light', 'dark');

export async function testScreenshot(
  t: TestController,
  takeScreenshot: (screenshotName: string, element?: Selector | string | null) => Promise<boolean>,
  screenshotName: string,
  options?: {
    element?: Selector | string | null;
    theme?: string;
    shouldTestInCompact?: boolean;
    compactCallBack?: () => Promise<unknown>;
    themeChanged?: () => Promise<unknown>;
  },

): Promise<void> {
  const {
    element,
    theme,
    shouldTestInCompact = false,
    compactCallBack,
    themeChanged,
  } = options ?? {};

  if (isString(theme)) {
    await changeTheme(theme);
    await themeChanged?.();
  }

  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(theme)}.png`), element))
    .ok();

  const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
  const a11yCheckConfig = themeName === defaultThemeName ? {} : {
    runOnly: 'color-contrast',
  };
  await a11yCheck(t, a11yCheckConfig);

  if (shouldTestInCompact) {
    await changeTheme(`${themeName}.compact`);

    await compactCallBack?.();

    await t
      .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(`${themeName}-compact`)}.png`), element))
      .ok();

    await a11yCheck(t, a11yCheckConfig);
  }

  if (isString(theme) || shouldTestInCompact) {
    await changeTheme(process.env.theme ?? defaultThemeName);
  }
}
