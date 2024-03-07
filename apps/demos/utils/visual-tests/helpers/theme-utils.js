export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  material: 'material.blue.light',
};

export const DEFAULT_THEME_NAME = THEME.generic;

export const getThemePostfix = (theme = DEFAULT_THEME_NAME) => {
  const themeName = theme === DEFAULT_THEME_NAME ? '' : ` (${theme})`;

  return themeName;
};

export async function testScreenshot(
  t,
  takeScreenshot,
  screenshotName,
  element,
) {
  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(process.env.THEME)}.png`), element))
    .ok();
}
