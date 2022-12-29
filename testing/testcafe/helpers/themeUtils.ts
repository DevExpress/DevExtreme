import { isString } from '../../../js/core/utils/type';
import { changeTheme } from './changeTheme';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? 'generic.light';
  return `-theme=${themeName.replace(/\./g, '-')}`;
};

export const isMaterial = (): boolean => process.env.theme === 'material.blue.light';

export async function screenshotTestFn(
  t: TestController,
  takeScreenshot: (screenshotName: string, element?: Selector | string | null) => Promise<boolean>,
  screenshotName: string,
  selector?: Selector | string | null,
  shouldTestInCompact = false,
  compactCallBack?: () => Promise<unknown>,
  theme?: string,
): Promise<void> {
  if (isString(theme)) {
    await changeTheme(theme);
  }

  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(theme)}.png`), selector))
    .ok();

  if (shouldTestInCompact) {
    const themeName = (theme ?? process.env.theme) ?? 'generic.light';
    await changeTheme(`${themeName}.compact`);

    await compactCallBack?.();

    await t
      .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(`${themeName}-compact`)}.png`), selector))
      .ok();
  }

  await changeTheme(process.env.theme ?? 'generic.light');
}
