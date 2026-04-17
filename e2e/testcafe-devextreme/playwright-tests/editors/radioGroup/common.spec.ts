import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Radio Group', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', {
      items: [{}, {}, {}],
      itemTemplate: () => ($('<div>') as any).dxRadioGroup({
        dataSource: [{}, {}, {}],
        layout: 'horizontal',
      }),
    });

    const parentGroup = page.locator('#container');

    const getRadioButton = (groupLocator: string, index: number) =>
      page.locator(`${groupLocator} > .dx-radiobutton`).nth(index);

    const isChecked = async (groupSelector: string, index: number) => {
      return page.evaluate(({ sel, idx }) => {
        const group = document.querySelector(sel);
        if (!group) return false;
        const buttons = group.querySelectorAll(':scope > .dx-radiobutton');
        const btn = buttons[idx];
        return btn ? btn.classList.contains('dx-radiobutton-checked') : false;
      }, { sel: groupSelector, idx: index });
    };

    const parentSelector = '#container .dx-radiogroup';
    const getItemContentSelector = (parentSel: string, index: number) =>
      `${parentSel} > .dx-scrollable-wrapper .dx-item:nth-child(${index + 1}) .dx-item-content`;

    const checkParentGroup = async (first = false, second = false, third = false) => {
      const items = page.locator('#container > .dx-widget.dx-collection > .dx-radiobutton');
      expect(await items.nth(0).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(first);
      expect(await items.nth(1).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(second);
      expect(await items.nth(2).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(third);
    };

    const getChildGroupButtons = (parentItemIndex: number) => {
      return page.locator('#container > .dx-widget.dx-collection > .dx-radiobutton').nth(parentItemIndex)
        .locator('.dx-radiogroup .dx-radiobutton');
    };

    const checkChildGroup = async (parentItemIndex: number, first = false, second = false, third = false) => {
      const childButtons = getChildGroupButtons(parentItemIndex);
      expect(await childButtons.nth(0).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(first);
      expect(await childButtons.nth(1).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(second);
      expect(await childButtons.nth(2).evaluate((el) => el.classList.contains('dx-radiobutton-checked'))).toBe(third);
    };

    await checkParentGroup();
    await checkChildGroup(0);
    await checkChildGroup(1);
    await checkChildGroup(2);

    const parentButtons = page.locator('#container > .dx-widget.dx-collection > .dx-radiobutton');

    await parentButtons.nth(0).click();
    await checkParentGroup(true);
    await checkChildGroup(0);
    await checkChildGroup(1);
    await checkChildGroup(2);

    await parentButtons.nth(1).click();
    await checkParentGroup(false, true);
    await checkChildGroup(0);
    await checkChildGroup(1);
    await checkChildGroup(2);

    await parentButtons.nth(2).click();
    await checkParentGroup(false, false, true);
    await checkChildGroup(0);
    await checkChildGroup(1);
    await checkChildGroup(2);

    await getChildGroupButtons(0).nth(0).click();
    await checkParentGroup(false, false, true);
    await checkChildGroup(0, true);
    await checkChildGroup(1);
    await checkChildGroup(2);

    await getChildGroupButtons(1).nth(1).click();
    await checkParentGroup(false, false, true);
    await checkChildGroup(0, true);
    await checkChildGroup(1, false, true);
    await checkChildGroup(2);

    await getChildGroupButtons(2).nth(2).click();
    await checkParentGroup(false, false, true);
    await checkChildGroup(0, true);
    await checkChildGroup(1, false, true);
    await checkChildGroup(2, false, false, true);
  });

  test('Dot of Radio button placed in scaled container should have valid centering(T1165339)', async ({ page }) => {

    await setStyleAttribute(page, '#container', 'width: 600px; height: 100px;');

    await appendElementTo(page, '#container', 'div', 'radioGroup');
    await setStyleAttribute(page, '#radioGroup', 'transform: scale(0.7);');

    await createWidget(page, 'dxRadioGroup', {
      items: ['One', 'Two', 'Three'],
      value: 'Two',
    }, '#radioGroup');

    await testScreenshot(page, 'RadioGroup in scaled container.png', { element: '#container' });
  });
});
