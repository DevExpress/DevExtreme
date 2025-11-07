import { isString } from 'devextreme/core/utils/type';
import { ClientFunction } from 'testcafe';
import { changeTheme } from './changeTheme';

const defaultThemeName = 'fluent.blue.light';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
  return ` (${themeName})`;
};

export const getCurrentTheme = async (t: TestController): Promise<string> => {
  // eslint-disable-next-line @stylistic/max-len
  const currentTheme = await ClientFunction(() => (window as any).DevExpress?.ui.themes.current()).with({ boundTestRun: t })();

  return currentTheme;
};

export const isMaterial = (): boolean => process.env.theme === 'material.blue.light';

export const isFluent = (): boolean => process.env.theme === 'fluent.blue.light';

export const isMaterialBased = (): boolean => isMaterial() || isFluent();

export const getFullThemeName = (): string => process.env.theme ?? defaultThemeName;

export const getThemeName = (): string => getFullThemeName().split('.')[0];

export const getDarkThemeName = (): string => getFullThemeName().replace('light', 'dark');

const getScreenshotName = (baseName: string, theme?: string): string => {
  const themePostfix = getThemePostfix(theme);
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
};

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
    .expect(await takeScreenshot(getScreenshotName(screenshotName, theme), element))
    .ok();

  if (shouldTestInCompact) {
    const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
    await changeTheme(`${themeName}.compact`);

    await compactCallBack?.();

    await t
      .expect(await takeScreenshot(getScreenshotName(screenshotName, `${themeName}.compact`), element))
      .ok();
  }

  if (isString(theme) || shouldTestInCompact) {
    await changeTheme(process.env.theme ?? defaultThemeName);
  }
}
