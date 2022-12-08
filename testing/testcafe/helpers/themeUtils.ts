import { changeTheme } from './changeTheme';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? 'generic.light';
  return `-theme=${themeName.replace(/\./g, '-')}`;
};

export const isMaterial = (): boolean => process.env.theme === 'material.blue.light';

export async function takeScreenshotInTheme(
  t: TestController,
  takeScreenshot: (screenshotName: string, element?: string) => Promise<boolean>,
  screenshotName: string,
  element?: string,
  shouldTestInCompact = false,
  compactCallBack?: () => Promise<unknown>,
  theme?: string,
): Promise<void> {
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

    await changeTheme(process.env.theme ?? 'generic.light');
  }
}
