import type { Page } from '@playwright/test';
import path from 'path';
import { removeStylesheetRulesFromPage } from './domUtils';

export function getContainerUrl(dirname: string, relativePath = '../../../tests/container.html'): string {
  return `file://${path.resolve(dirname, relativePath)}`;
}

export async function clearTestPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const widgetSelector = '.dx-widget';
    const elements = document.querySelectorAll(widgetSelector);
    elements.forEach((element) => {
      if (element.closest(widgetSelector) === element) {
        const $el = $(element) as any;
        const widgetNames = $el.data()?.dxComponents;
        widgetNames?.forEach((name: string) => {
          if ($el.hasClass('dx-widget')) {
            $el[name]?.('dispose');
          }
        });
        $el.empty();
      }
    });

    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = '';
      body.className = 'dx-surface';

      const parent = document.createElement('div');
      parent.id = 'parentContainer';
      parent.setAttribute('role', 'main');
      parent.innerHTML = '<h1 style="position:fixed;left:0;top:0;clip:rect(1px,1px,1px,1px)">Test header</h1><div id="container"></div><div id="otherContainer"></div>';
      body.appendChild(parent);
    }
  });

  await removeStylesheetRulesFromPage(page);
}

const TARGET_CONTENT_WIDTH = 1184;

export async function adjustViewportForContent(page: Page): Promise<void> {
  const currentContentWidth = await page.evaluate(
    () => document.body.clientWidth,
  );

  if (currentContentWidth === TARGET_CONTENT_WIDTH) return;

  const current = page.viewportSize();
  if (!current) return;

  const diff = TARGET_CONTENT_WIDTH - currentContentWidth;
  await page.setViewportSize({ width: current.width + diff, height: current.height });
  await page.evaluate(() => new Promise<void>((resolve) => {
    window.dispatchEvent(new Event('resize'));
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

export async function setupTestPage(page: Page, containerUrl: string, theme = 'fluent.blue.light'): Promise<void> {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((themeName) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(themeName);
  }), theme);

  await page.addStyleTag({
    content: '*, *::before, *::after { caret-color: transparent !important; }',
  });

  await adjustViewportForContent(page);
}
