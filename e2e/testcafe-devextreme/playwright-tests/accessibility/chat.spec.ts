import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxChat', { items: [], user: { id: 1, name: 'User' } });
    await a11yCheck(page, {}, '#container');
  });

  test('chat with messages', async ({ page }) => {
    const userWithAvatar = { id: 1, name: 'User With Avatar' };
    const userWithoutAvatar = { id: 2, name: 'User Without Avatar' };
    await createWidget(page, 'dxChat', {
      items: [
        { timestamp: new Date(), text: 'Message text', author: userWithAvatar },
        { timestamp: new Date(), text: 'Message text', author: userWithoutAvatar },
      ],
      user: userWithAvatar,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('chat with typing users', async ({ page }) => {
    const user = { id: 1, name: 'User' };
    await createWidget(page, 'dxChat', {
      items: [],
      user,
      typingUsers: [{ id: 2, name: 'Other User' }],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('chat with different user', async ({ page }) => {
    await createWidget(page, 'dxChat', { items: [], user: { id: 2, name: 'User Without Avatar' } });
    await a11yCheck(page, {}, '#container');
  });
});
