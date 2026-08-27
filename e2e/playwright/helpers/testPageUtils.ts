import type { Page } from '@playwright/test';
import { DEFAULT_THEME, TEST_PAGE_URL } from './const';

export async function openTestPage(page: Page): Promise<void> {
  await page.goto(TEST_PAGE_URL);
  await page.waitForFunction(() => !!(window as any).DevExpress);
}

export async function changeTheme(page: Page, themeName: string): Promise<void> {
  await page.evaluate(async (theme) => {
    const { themes } = (window as any).DevExpress.ui;

    if (themes.current() === theme) {
      return;
    }

    await new Promise<void>((resolve) => {
      themes.ready(resolve);
      themes.current(theme);
    });
  }, themeName);
}

export async function getCurrentTheme(page: Page): Promise<string> {
  const theme = await page.evaluate(() => (window as any).DevExpress?.ui.themes.current());

  return theme ?? DEFAULT_THEME;
}

export async function clearTestPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const widgetSelector = '.dx-widget';
    const $elements = $(widgetSelector)
      .filter((_, element) => $(element).parents(widgetSelector).length === 0);

    $elements.each((_, element) => {
      const $widgetElement = $(element);
      const widgetNames = $widgetElement.data().dxComponents;

      widgetNames?.forEach((name) => {
        if ($widgetElement.hasClass('dx-widget')) {
          ($widgetElement as any)[name]?.('dispose');
        }
      });
      $widgetElement.empty();
    });

    document.getElementById('focusable-start')?.remove();
    document.getElementById('stylesheetRules')?.remove();

    const body = document.querySelector('body');

    if (body) {
      body.innerHTML = '';
      body.className = 'dx-surface';
    }

    const temp = document.createElement('div');

    temp.innerHTML = `
      <div id="parentContainer" role="main">
        <h1 style="position: fixed; left: 0; top: 0; clip: rect(1px, 1px, 1px, 1px);">Test header</h1>
        <div id="container"></div>
        <div id="otherContainer"></div>
      </div>
    `;

    body?.prepend(temp.firstElementChild!);
  });
}

export async function resetPageState(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    window.getSelection()?.removeAllRanges();
  });

  await page.mouse.move(1, 1);
}
