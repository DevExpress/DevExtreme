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

  const themeOptions = isMaterialTheme ? {
    looksSameComparisonOptions: {
      tolerance: 100,
      ignoreAntialiasing: true,
      antialiasingTolerance: 100,
      strict: false,
      caretIgnore: true,
    },
    textDiffTreshold: 1,
  } : {
    looksSameComparisonOptions: {
      tolerance: 20,
      antialiasingTolerance: 20,
    },
    textDiffTreshold: 0.2,
  };

  const finalOptions = isMaterialTheme && comparisonOptions?.looksSameComparisonOptions
    ? {
        ...comparisonOptions,
        looksSameComparisonOptions: {
          ...comparisonOptions.looksSameComparisonOptions,
          ...themeOptions.looksSameComparisonOptions,
        },
        textDiffTreshold: themeOptions.textDiffTreshold,
      }
    : {
        ...comparisonOptions,
        ...themeOptions,
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
