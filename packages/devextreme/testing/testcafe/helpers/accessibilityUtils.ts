/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';

const defaultOptions = {
  rules: {
    'color-contrast': { enabled: false },
    'th-has-data-cells': { enabled: false },
  },
};

export const a11yCheck = async (
  t: TestController,
  selector: any = undefined,
  options: any = defaultOptions,
):
Promise<void> => {
  const { error, results } = await axeCheck(t, selector, { rules: {}, ...options });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createReport(results.violations));
};
