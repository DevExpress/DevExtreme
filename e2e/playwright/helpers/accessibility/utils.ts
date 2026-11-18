/* eslint-disable spellcheck/spell-checker */
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { Result, RunOptions } from 'axe-core';
import { getCurrentTheme } from '../testPageUtils';
import { getThemeName } from '../themeUtils';

export interface A11yCheckOptions extends RunOptions {
  runOnly?: any;
}

export type A11yContext = string | { include: string[][] };

const COLOR_CONTRAST_RULE = 'color-contrast';

// The TestCafe runner checked accessibility on a "dx-viewport" body, not the "dx-surface" one the
// other tests use: it is where overlays render and what the theme styles as the page background.
export async function applyViewportEnvironment(page: Page): Promise<void> {
  await page.evaluate(() => {
    const { body } = document;

    body.classList.remove('dx-surface');
    body.classList.add('dx-viewport');

    (window as any).DevExpress.viewPort('.dx-viewport');
  });
}

const isColorContrastChecked = (options: A11yCheckOptions): boolean => {
  if (options.rules?.[COLOR_CONTRAST_RULE]?.enabled === false) {
    return false;
  }

  return options.runOnly === undefined || options.runOnly === COLOR_CONTRAST_RULE;
};

const formatViolations = (violations: Result[], configuration: unknown): string => {
  const lines = violations.flatMap(({
    id, impact, help, helpUrl, nodes,
  }) => [
    `${id} (${impact}): ${help}`,
    `  ${helpUrl}`,
    ...nodes.map(({ target, failureSummary }) => `  ${target.join(' ')}\n    ${failureSummary?.replace(/\n/g, '\n    ')}`),
  ]);

  return [
    `${violations.length} accessibility violation(s):`,
    ...lines,
    ...(configuration ? [JSON.stringify(configuration)] : []),
  ].join('\n');
};

export const a11yCheck = async (
  page: Page,
  options: A11yCheckOptions = {},
  selector?: A11yContext,
  configuration: unknown = {},
): Promise<void> => {
  const isColorContrastOnly = getThemeName(await getCurrentTheme(page)) === 'fluent-next';

  if (isColorContrastOnly && !isColorContrastChecked(options)) {
    throw new Error(
      'a11yCheck was called on fluent-next with a configuration that excludes color-contrast, '
      + 'the only rule this theme runs, so nothing would be checked. Leave color-contrast '
      + 'enabled, or do not declare the test for this theme.',
    );
  }

  const effectiveOptions: A11yCheckOptions = isColorContrastOnly
    ? { ...options, runOnly: COLOR_CONTRAST_RULE }
    : options;

  const builder = new AxeBuilder({ page }).options({ rules: {}, ...effectiveOptions });

  if (typeof selector === 'string') {
    builder.include(selector);
  } else if (selector) {
    selector.include.forEach((frameSelector) => builder.include(frameSelector));
  }

  const { violations } = await builder.analyze();

  expect(violations.length, formatViolations(violations, configuration)).toBe(0);
};
