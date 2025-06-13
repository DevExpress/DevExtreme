import { test as base } from '@playwright/test';
import path from 'path';

const htmlPath = process.env.DOCKER
  ? path.resolve(__dirname, '../../artifacts/container.html')
  : path.resolve(__dirname, '../../container.html');

interface Fixtures {
  forEachTest: any;
  dxScheduler: (config: object) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  forEachTest: [async ({ page }, use) => {
    await page.goto(`file://${htmlPath}`);
    await use();
  }, { auto: true }],
  dxScheduler: async ({ page }, use) => {
    await use(async (dxSchedulerConfig: object) => {
      await page.evaluate((config: object) => {
        $('#container').dxScheduler(config);
      }, dxSchedulerConfig);
    });
  },
});

export { expect } from '@playwright/test';
