import { test, expect } from '../fixtures/fixtures';

const baseProps = {
  currentView: 'day',
  currentDate: new Date(2015, 10, 1),
  height: 400,
};

test('Loading panel should be shown while datasource is reloading and hide', async ({ page }) => {
  await page.evaluate((props: object) => {
    const global = (window as any);
    $('#container').dxScheduler({
      ...props,
      dataSource: new global.DevExpress.data.DataSource({
        store: new global.DevExpress.data.CustomStore({
          load() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([]);
              }, 300);
            });
          },
        }),
      }),
    });
  }, baseProps);
  const loadingPanel = page.locator('.dx-loadpanel-wrapper');
  await expect(page.locator('.dx-scheduler .dx-scheduler-work-space')).toBeVisible();
  await expect(loadingPanel).toBeVisible();
  await expect(loadingPanel).toBeHidden();
  await page.evaluate(() => {
    $('#container').dxScheduler('instance').option('currentView', 'week');
  });
  await expect(loadingPanel).toBeVisible();
  await expect(loadingPanel).toHaveScreenshot('scheduler-loadpanel.png');
  await expect(loadingPanel).toBeHidden();
});
