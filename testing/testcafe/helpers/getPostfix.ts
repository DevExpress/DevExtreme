import { changeTheme } from './changeTheme';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? 'generic.light';
  return `-theme=${themeName.replace(/\./g, '-')}`;
};

export async function takeScreenshotInTheme(
  t: TestController,
  takeScreenshot: (screenshotName: string, element?: string) => Promise<boolean>,
  screenshotName: string,
  element?: string,
  shouldTestInCompact = false,
): Promise<void> {
  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix()}.png`), element))
    .ok();

  if (shouldTestInCompact) {
    const themeName = process.env.theme ?? 'generic.light';
    await changeTheme(`${themeName}.compact`);

    await t
      .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(`${themeName}.compact`)}.png`), element))
      .ok();

    await changeTheme(themeName);
  }
}
