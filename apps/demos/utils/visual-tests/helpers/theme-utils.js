export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  material: 'material.blue.light',
};

export const DEFAULT_THEME_NAME = THEME.fluent;

export const getThemePostfix = (theme = DEFAULT_THEME_NAME) => {
  return ` (${theme})`;
};

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
  const isMaterialTheme = testTheme?.includes('material');

  const materialThemeOptions = isMaterialTheme ? {
    looksSameComparisonOptions: {
      tolerance: 80,
      ignoreAntialiasing: true,
      antialiasingTolerance: 80,
      strict: false,
      caretIgnore: true,
    },
    textDiffTreshold: 0.8,
  } : {};

  const finalOptions = isMaterialTheme && comparisonOptions?.looksSameComparisonOptions
    ? {
        ...comparisonOptions,
        looksSameComparisonOptions: {
          ...comparisonOptions.looksSameComparisonOptions,
          ...materialThemeOptions.looksSameComparisonOptions,
        },
        enableTextMask: materialThemeOptions.enableTextMask,
        textMaskRadius: materialThemeOptions.textMaskRadius,
        textDiffTreshold: materialThemeOptions.textDiffTreshold,
      }
    : {
        ...comparisonOptions,
        ...materialThemeOptions,
      };

  await t
    .expect(
      await takeScreenshot(
        getScreenshotName(screenshotName, testTheme),
        element,
        finalOptions
      )
    )
    .ok();
}
