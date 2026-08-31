export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  'fluent-next': 'fluent-next.blue.light',
  material: 'material.blue.light',
};

export const DEFAULT_THEME_NAME = THEME.fluent;

export const isMaterial = (theme = process.env.THEME) => theme?.startsWith('material');
export const isFluent = (theme = process.env.THEME) => (theme ?? DEFAULT_THEME_NAME).startsWith('fluent');
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

  /*
   * Defaults for every screenshot. `looksSameComparisonOptions` used to live here with
   * tolerance/antialiasingTolerance 20, which made the comparison looser than the comparator's own
   * defaults for EVERY demo in EVERY theme — and it hid real drift: a hairline that changed by 9
   * units, a whole tree shifted by a pixel, an appointment line dropped by a product change, all
   * passed silently for months (wave H, 28.08.2026).
   *
   * A demo that genuinely renders unstable pixels asks for the looser comparison itself, in its own
   * visualtestrc.json ("comparison-options") or at the call site — so the exception is visible,
   * greppable and attached to a reason, instead of covering everything.
   */
  const themeOptions = {
    textDiffTreshold: 0.2,
  };

  // per-demo options win: the defaults above must not silently override what a test asked for
  const finalOptions = {
    ...themeOptions,
    ...comparisonOptions,
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
