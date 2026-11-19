import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Pagination from '../../../models/pagination';

test.describe('Pagination Base Properties', () => {
  test('Pagination width and height property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      width: 270,
      height: '95px',
      itemCount: 50,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).toHaveCSS('width', '270px');
    await expect(pagination.element).toHaveCSS('height', '95px');
    await expect(pagination.element).not.toHaveAttribute('width');
    await expect(pagination.element).not.toHaveAttribute('height');
  });

  test('Pagination elementAttr property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      elementAttr: {
        'aria-label': 'some description',
        'data-test': 'custom data',
      },
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).toHaveAttribute('aria-label', 'some description');
    await expect(pagination.element).toHaveAttribute('data-test', 'custom data');
  });

  test('Pagination hint and accessKey properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      hint: 'Best Pagination',
      accessKey: 'F',
      itemCount: 50,
      focusStateEnabled: true,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).toHaveAttribute('accesskey', 'F');
    await expect(pagination.element).toHaveAttribute('title', 'Best Pagination');
  });

  test('Pagination disabled property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      disabled: true,
      itemCount: 50,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).toHaveAttribute('aria-disabled', 'true');
    await pagination.expectDisabled();
  });

  test('Pagination tabindex and state properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      disabled: false,
      width: '100%',
      focusStateEnabled: true,
      hoverStateEnabled: true,
      activeStateEnabled: true,
      tabIndex: 7,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).toHaveAttribute('tabindex', '7');

    await pagination.getNavPage('3').click();

    await pagination.expectFocused();
    await pagination.expectHovered();
    await pagination.expectActive(false);

    await pagination.element.evaluate((element) => {
      $(element).trigger($.Event('dxpointerdown', {
        pointers: [{ pointerId: 1 }],
      }));
    });

    await pagination.expectActive();
  });

  test('Pagination focus method & accessKey propery without focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      focusStateEnabled: false,
      accessKey: 'F',
      itemCount: 50,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).not.toHaveAttribute('accesskey');
    await expect(pagination.getPageSize(0)).not.toBeFocused();

    await pagination.focus();

    await expect(pagination.getPageSize(0)).toBeFocused();
  });

  test('Pagination focus method with focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      focusStateEnabled: true,
      itemCount: 50,
    });

    const pagination = new Pagination(page, '#container');

    await expect(pagination.element).not.toBeFocused();

    await pagination.focus();

    await expect(pagination.element).toBeFocused();
  });
});
