/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';
import { ElementContext, RunOptions } from 'axe-core';
import { getThemeName } from '../themeUtils';

export interface A11yCheckOptions extends RunOptions {
  runOnly?: any;
}

const defaultOptions = {};

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
  // dxdsfluent shares fluent's structure/ARIA (already covered by the fluent run),
  // so only color-contrast is re-checked for it — regardless of the caller's config.
  // Spread the caller's options first so any per-component color-contrast disabling is kept.
  const effectiveOptions: A11yCheckOptions = getThemeName() === 'dxdsfluent'
    ? { ...options, runOnly: 'color-contrast' }
    : options;

  const { error, results } = await axeCheck(t, selector, { rules: {}, ...effectiveOptions });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createFullReport(results, configuration));
};
