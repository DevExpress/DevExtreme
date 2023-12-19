/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';
import { ElementContext, RunOptions } from 'axe-core';

export interface A11yCheckOptions extends RunOptions {
  runOnly?: any;
}

const defaultOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};

export const a11yCheck = async (
  t: TestController,
  options: A11yCheckOptions = defaultOptions,
  selector?: ElementContext,
):
Promise<void> => {
  const { error, results } = await axeCheck(t, selector, { rules: {}, ...options });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createReport(results.violations));
};
