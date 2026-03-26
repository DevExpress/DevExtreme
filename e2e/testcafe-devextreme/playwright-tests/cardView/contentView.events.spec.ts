import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

const CONFIG = {
  dataSource: [
    { caption1: 'value11', caption2: 'value21', caption3: 'value31' },
    { caption1: 'value12', caption2: 'value22', caption3: 'value32' },
    { caption1: 'value13', caption2: 'value23', caption3: 'value33' },
    { caption1: 'value14', caption2: 'value24', caption3: 'value34' },
    { caption1: 'value15', caption2: 'value25', caption3: 'value35' },
  ],
  onCardClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardClick ??= [];
    window.dxCardViewEventTest.onCardClick.push(e);
  },
  onCardDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardDblClick ??= [];
    window.dxCardViewEventTest.onCardDblClick.push(e);
  },
  onCardPrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardPrepared ??= [];
    window.dxCardViewEventTest.onCardPrepared.push(e);
  },
  onFieldCaptionClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionClick ??= [];
    window.dxCardViewEventTest.onFieldCaptionClick.push(e);
  },
  onFieldCaptionDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionDblClick ??= [];
    window.dxCardViewEventTest.onFieldCaptionDblClick.push(e);
  },
  onFieldCaptionPrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionPrepared ??= [];
    window.dxCardViewEventTest.onFieldCaptionPrepared.push(e);
  },
  onFieldValueClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValueClick ??= [];
    window.dxCardViewEventTest.onFieldValueClick.push(e);
  },
  onFieldValueDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValueDblClick ??= [];
    window.dxCardViewEventTest.onFieldValueDblClick.push(e);
  },
  onFieldValuePrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValuePrepared ??= [];
    window.dxCardViewEventTest.onFieldValuePrepared.push(e);
  },
  onDisposing() {
    delete window.dxCardViewEventTest;
  },
};

test.describe('CardView - ContentView - events', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('onCardClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().click();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onCardClick?.length);
    expect(count).toBe(1);
  });

  test('onCardDblClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().dblclick();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onCardDblClick?.length);
    expect(count).toBe(1);
  });

  test('onCardPrepared', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onCardPrepared?.length);
    expect(count).toBe(5);
  });

  test('onFieldCaptionClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-caption').first().click();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldCaptionClick?.length);
    expect(count).toBe(1);
  });

  test('onFieldCaptionDblClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-caption').first().dblclick();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldCaptionDblClick?.length);
    expect(count).toBe(1);
  });

  test('onFieldCaptionPrepared', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldCaptionPrepared?.length);
    expect(count).toBe(15);
  });

  test('onFieldValueClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').first().click();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldValueClick?.length);
    expect(count).toBe(1);
  });

  test('onFieldValueDblClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').first().dblclick();

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldValueDblClick?.length);
    expect(count).toBe(1);
  });

  test('onFieldValuePrepared', async ({ page }) => {
    await createWidget(page, 'dxCardView', CONFIG);

    const count = await page.evaluate(() => (window as any).dxCardViewEventTest?.onFieldValuePrepared?.length);
    expect(count).toBe(15);
  });
});
