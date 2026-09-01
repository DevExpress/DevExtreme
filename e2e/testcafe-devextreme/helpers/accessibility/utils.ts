/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';
import { ElementContext, RunOptions } from 'axe-core';
import { getThemeName } from '../themeUtils';

export interface A11yCheckOptions extends RunOptions {
  runOnly?: any;
}

const defaultOptions = {};
const COLOR_CONTRAST_RULE = 'color-contrast';

// axe gives a `rule`-type runOnly precedence over rules[id].enabled, so forcing runOnly would
// silently re-enable color-contrast for callers that opted out of it (or narrowed runOnly).
const isColorContrastChecked = (options: A11yCheckOptions): boolean => {
  if (options.rules?.[COLOR_CONTRAST_RULE]?.enabled === false) {
    return false;
  }

  return options.runOnly === undefined || options.runOnly === COLOR_CONTRAST_RULE;
};

// Whether the given configuration leaves anything for the current theme to check. Call sites
// use it to declare a test with `test.skip`, so a check that cannot run is visible as skipped
// instead of counted as passed.
export const isA11yCheckApplicable = (options: A11yCheckOptions = defaultOptions): boolean => getThemeName() !== 'fluent-next' || isColorContrastChecked(options);

const createFullReport = (results, configuration) => {
  let report = createReport(results.violations);

  if (results.violations.length && configuration) {
    report += `\n${JSON.stringify(configuration)}\n`;
  }

  return report;
};

export const a11yCheck = async (
  t: TestController,
  options: A11yCheckOptions = defaultOptions,
  selector?: ElementContext,
  configuration = {},
):
Promise<void> => {
  // fluent-next shares fluent's structure/ARIA (already covered by the fluent run),
  // so only color-contrast is re-checked for it — regardless of the caller's config.
  const isColorContrastOnly = getThemeName() === 'fluent-next';

  // Returning here used to report the test as passed with no assertion at all. A check that
  // cannot run has to be declared as skipped where the test is declared, not swallowed here.
  if (isColorContrastOnly && !isColorContrastChecked(options)) {
    throw new Error(
      'a11yCheck was called on fluent-next with a configuration that excludes color-contrast, '
      + 'the only rule this theme runs. Nothing would be checked. Either declare the test with '
      + 'isA11yCheckApplicable() so it is skipped explicitly, or leave color-contrast enabled.',
    );
  }

  const effectiveOptions: A11yCheckOptions = isColorContrastOnly
    ? { ...options, runOnly: COLOR_CONTRAST_RULE }
    : options;

  const { error, results } = await axeCheck(t, selector, { rules: {}, ...effectiveOptions });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createFullReport(results, configuration));
};
