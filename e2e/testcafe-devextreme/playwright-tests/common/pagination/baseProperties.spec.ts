import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pagination Base Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Pagination width and height property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    width: 270,
    height: '95px',
    itemCount: 50,
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getStyleProperty('width'))
      .eql('270px')
      .expect(pagination.element.getStyleProperty('height'))
      .eql('95px')
      .expect(pagination.element.getAttribute('width'))
      .eql(null)
      .expect(pagination.element.getAttribute('height'))
      .eql(null);

    });

  test.skip('Pagination elementAttr property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    elementAttr: {
      'aria-label': 'some description',
      'data-test': 'custom data',
    },
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getAttribute('aria-label'))
      .eql('some description')
      .expect(pagination.element.getAttribute('data-test'))
      .eql('custom data');

    });

  test.skip('Pagination hint and accessKey properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    hint: 'Best Pagination',
    accessKey: 'F',
    itemCount: 50,
    focusStateEnabled: true,
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getAttribute('accesskey'))
      .eql('F')
      .expect(pagination.element.getAttribute('title'))
      .eql('Best Pagination');

    });

  test.skip('Pagination disabled property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    disabled: true,
    itemCount: 50,
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getAttribute('aria-disabled'))
      .eql('true')
      .expect(pagination.element.hasClass('dx-state-disabled'))
      .ok();

    });

  test.skip('Pagination tabindex and state properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    itemCount: 50,
    disabled: false,
    width: '100%',
    focusStateEnabled: true,
    hoverStateEnabled: true,
    activeStateEnabled: true,
    tabIndex: 7,
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getAttribute('tabindex'))
      .eql('7')

      .click(pagination.getNavPage('3').element)
      .expect(pagination.element.hasClass('dx-state-focused'))
      .ok()
      .expect(pagination.element.hasClass('dx-state-hover'))
      .ok()
      .expect(pagination.element.hasClass('dx-state-active'))
      .notOk();

    await ClientFunction((_pagination) => {
      const $root = $(_pagination.element());

      $root.trigger($.Event('dxpointerdown', {
        pointers: [{ pointerId: 1 }],
      }));
    })(pagination);

    await page.expect(pagination.element.hasClass('dx-state-active'))
      .ok();

    });

  test.skip('Pagination focus method & accessKey propery without focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    focusStateEnabled: false,
    accessKey: 'F',
    itemCount: 50,
  });

    const pagination = page.locator('#container');
    await page.expect(pagination.element.getAttribute('accesskey'))
      .eql(null)
      .expect(pagination.getPageSize(0).element.focused)
      .notOk();

    await page.evaluate(() => {
      _pagination.getInstance().focus();
    });

    await page.expect(pagination.getPageSize(0).element.focused)
      .ok();

    });

  test.skip('Pagination focus method with focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    focusStateEnabled: true,
    itemCount: 50,
  });

    const pagination = page.locator('#container');
    expect(pagination.element.focused).toBeFalsy();

    await page.evaluate(() => {
      _pagination.getInstance().focus();
    });

    expect(pagination.element.focused).toBeTruthy();

    });
});
