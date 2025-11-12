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
    },
    // eslint-disable-next-line spellcheck/spell-checker
    textDiffTreshold: 0.5,
  } : {};

  // Merge options with Material theme overrides having priority
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
    .expect(await takeScreenshot(
      screenshotName.replace('.png', `${getThemePostfix(testTheme)}.png`),
      element,
      finalOptions
    ))
    .ok();
}
