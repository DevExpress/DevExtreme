/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';

export const a11yCheck = async (t: TestController): Promise<void> => {
  const { error, results } = await axeCheck(t, undefined, {
    rules: {
      'th-has-data-cells': { enabled: false },
    },
  });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createReport(results.violations));
};
