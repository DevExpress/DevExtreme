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

  test.skip('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', {
    items: [{}, {}, {}],
    itemTemplate: () => ($('<div>') as any).dxRadioGroup({
      dataSource: [{}, {}, {}],
      layout: 'horizontal',
    }),
  });

    const parentGroup = page.locator('#container');
    const firstChildGroup = new RadioGroup(parentGroup.getItem().content.child().nth(0));
    const secondChildGroup = new RadioGroup(parentGroup.getItem(1).content.child());
    const thirdChildGroup = new RadioGroup(parentGroup.getItem(2).content.child());

    const checkGroup = async (
      group: RadioGroup,
      firstChecked = false,
      secondChecked = false,
      thirdChecked = false,
    ): Promise<void> => {
      await page.expect(group.getItem().radioButton.isChecked).eql(firstChecked)
        .expect(group.getItem(1).radioButton.isChecked).eql(secondChecked)
        .expect(group.getItem(2).radioButton.isChecked)
        .eql(thirdChecked);
    };

    await checkGroup(parentGroup);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem().radioButton.element.click();
    await checkGroup(parentGroup, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem(1).radioButton.element.click();
    await checkGroup(parentGroup, false, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem(2).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await firstChildGroup.getItem().radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await secondChildGroup.getItem(1).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup, false, true);
    await checkGroup(thirdChildGroup);

    await thirdChildGroup.getItem(2).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup, false, true);
    await checkGroup(thirdChildGroup, false, false, true);

    });

  test.skip('Dot of Radio button placed in scaled container should have valid centering(T1165339)', async ({ page }) => {

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
