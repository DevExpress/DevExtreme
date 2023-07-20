import { isString } from '../../../js/core/utils/type';
import { changeTheme } from './changeTheme';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? 'generic.light';
  return ` (${themeName.replace(/\./g, '-')})`;
};

export const isMaterial = (): boolean => process.env.theme === 'material.blue.light';

export async function testScreenshot(
  t: TestController,
  takeScreenshot: (screenshotName: string, element?: Selector | string | null) => Promise<boolean>,
  screenshotName: string,
  options?: {
    element?: Selector | string | null;
    theme?: string;
    shouldTestInCompact?: boolean;
    compactCallBack?: () => Promise<unknown>;
  },

): Promise<void> {
  const {
    element,
    theme,
    shouldTestInCompact = false,
    compactCallBack,
  } = options ?? {};

  if (isString(theme)) {
    await changeTheme(theme);
  }

  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(theme)}.png`), element))
    .ok();

  if (shouldTestInCompact) {
    const themeName = (theme ?? process.env.theme) ?? 'generic.light';
    await changeTheme(`${themeName}.compact`);

    await compactCallBack?.();

    await t
      .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(`${themeName}-compact`)}.png`), element))
      .ok();
  }

  await changeTheme(process.env.theme ?? 'generic.light');
}
