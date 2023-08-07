/* eslint-disable spellcheck/spell-checker */
import { axeCheck, createReport } from '@testcafe-community/axe';

export const a11yCheck = async (t: TestController, rules: object = {}): Promise<void> => {
  const { error, results } = await axeCheck(t, undefined, {
    rules: {
      'color-contrast': { enabled: false },
      'th-has-data-cells': { enabled: false },
      ...rules,
    },
  });

  await t
    .expect(error)
    .eql(null)
    .expect(results.violations.length === 0)
    .ok(createReport(results.violations));
};

export const reloadPage = async (t: TestController): Promise<void> => {
  await t.eval(() => location.reload());
};
