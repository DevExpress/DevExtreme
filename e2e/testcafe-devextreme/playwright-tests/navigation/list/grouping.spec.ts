import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Grouped list appearance', async ({ page }) => {
    await createWidget(page, 'dxList', {
    width: 300,
    dataSource: [
      {
        key: 'group_1',
        items: ['item_1_1', 'item_1_2', 'item_1_3'],
        expanded: false,
      },
      {
        key: 'group_2',
        items: [
          { text: 'item_2_1', disabled: true },
          { text: 'item_2_2', icon: 'home' },
          { text: 'item_2_3', showChevron: true, badge: 'item_2_3' },
          { text: 'item_2_4', badge: 'item_2_4' },
          'item_2_5',
        ],
      },
      {
        key: 'group_3',
        items: ['item_3_1', 'item_3_2', 'item_3_3'],
        expanded: false,
      },
    ],
    collapsibleGroups: true,
    grouped: true,
    allowItemDeleting: true,
    itemDeleteMode: 'static',
    itemDragging: {
      allowReordering: true,
    },
  });

    const list = page.locator('#container');

    await list.getItem(2).element.click()
      .pressKey('down');

    await testScreenshot(page, 'Grouped list appearance, header focused.png', { element: '#container' });

    await page.click(list.getGroup(0).header)
      .click(list.getGroup(2).header)
      .click(list.getItem(4).element)
      .hover(list.getGroup(1).header);

    await testScreenshot(page, 'Grouped list appearance, item focused, header hovered.png', { element: '#container' });

    await list.option('collapsibleGroups', false);

    await testScreenshot(page, 'Grouped list appearance,collapsibleGroups=false.png', { element: '#container' });

    });

  test.skip('Grouped list appearance with template', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; padding: 8px; width: fit-content;');

    const dataSource = [
      { key: 'One', items: ['1_1', '1_2', '1_3'] },
      { key: 'Two', items: ['2_1', '2_2', '2_3'] },
      { key: 'Three', items: ['3_1', '3_2', '3_3'] },
    ];

    await Promise.all([false, true].map((rtlEnabled) => appendElementTo(page, '#container', 'div', `list-rtl-${rtlEnabled}`)));
    await Promise.all([false, true].map((rtlEnabled) => createWidget(page, 'dxList', {
      dataSource,
      width: 300,
      groupTemplate(data) {
        const wrapper = $('<div>');

        $(`<span>${data.key}</span>`).appendTo(wrapper);
        $('<div>second row</div>').appendTo(wrapper);

        return wrapper;
      },
      collapsibleGroups: true,
      grouped: true,
      rtlEnabled,
    }, `#list-rtl-${rtlEnabled}`)));

    const list = page.locator('#list-rtl-false');
    const list2 = page.locator('#list-rtl-true');

    await page.click(list.getGroup(0).header)
      .click(list.getGroup(2).header)
      .click(list2.getGroup(0).header)
      .click(list2.getGroup(2).header)
      .click('#container');

    await testScreenshot(page, 'Grouped list appearance with template.png', { element: '#container' });

    });
});
