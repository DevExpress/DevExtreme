export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  material: 'material.blue.light',
};

export const DEFAULT_THEME_NAME = THEME.fluent;

export const isMaterial = (theme = process.env.THEME) => theme?.startsWith('material');
export const isFluent = (theme = process.env.THEME) => theme?.startsWith('fluent');
export const getThemePostfix = (theme = DEFAULT_THEME_NAME) => ` (${theme})`;

export const getScreenshotName = (baseName, theme) => {
  const themePostfix = getThemePostfix(theme);
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
};

export async function testScreenshot(
  t,
  takeScreenshot,
  screenshotName,
  element,
  comparisonOptions,
) {
  const testTheme = process.env.THEME;

  const themeOptions = {
    looksSameComparisonOptions: {
      tolerance: 20,
      antialiasingTolerance: 20,
    },
    textDiffTreshold: 0.2,
  };

  const finalOptions = {
    ...comparisonOptions,
    ...themeOptions,
  };

  await t
    .expect(
      await takeScreenshot(
        getScreenshotName(screenshotName, testTheme),
        element,
        finalOptions,
      ),
    )
    .ok();
}
