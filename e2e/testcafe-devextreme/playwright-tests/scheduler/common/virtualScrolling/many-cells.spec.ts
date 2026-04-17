import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, generateOptionMatrix } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const buildScreenshotName = (viewType: string, orientation: string, step: string) => `virtual-scrolling-many-cells-${viewType}-${orientation}-${step}.png`;

async function scrollTo(page, date: Date, groups?: Record<string, unknown>): Promise<void> {
  await page.evaluate(({ d, g }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.scrollTo(new Date(d), g);
  }, { d: date.toISOString(), g: groups });
}

const testCases = generateOptionMatrix({
  viewType: ['month', 'week', 'workWeek'],
  groupOrientation: ['horizontal', 'vertical'],
});

test.describe('Scheduler: Virtual scrolling (many cells)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  testCases.forEach(({ viewType, groupOrientation }) => {
    const resourceCount = 400;

    test(`it should correctly render virtual table if a lot of resources are presented for ${viewType} view and ${groupOrientation} orientation (T1205597, T1137490)`, async ({ page }) => {
      const resources = Array.from({ length: resourceCount }, (_, i) => ({
        id: i,
        text: `Resource ${i}`,
      }));

      const appointmentDateInfo = Array.from({ length: 29 })
        .map((_, i) => ({
          startDate: new Date(2024, 1, i + 1, 1),
          endDate: new Date(2024, 1, i + 1, 4),
        }));

      const appointments = Array.from({ length: resourceCount })
        .map((_, resourceIndex) => appointmentDateInfo.map(({ startDate, endDate }) => ({
          text: `Appointment for Resource ${resourceIndex}`,
          startDate,
          endDate,
          groupId: resourceIndex,
        })))
        .flat();

      await createWidget(page, 'dxScheduler', {
        height: 600,
        currentDate: new Date(2024, 1, 1),
        dataSource: appointments,
        views: [{
          type: viewType,
          groupOrientation,
        }],
        currentView: viewType,
        scrolling: {
          mode: 'virtual',
        },
        groups: ['groupId'],
        resources: [{
          fieldExpr: 'groupId',
          dataSource: resources,
          label: 'Group',
        }],
      });

      const scheduler = page.locator('.dx-scheduler');
      await testScreenshot(page, buildScreenshotName(viewType, groupOrientation, 'start'), { element: scheduler });

      await scrollTo(page, new Date(2024, 1, 1, 1), { groupId: resourceCount / 2 });
      await testScreenshot(page, buildScreenshotName(viewType, groupOrientation, 'middle'), { element: scheduler });

      await scrollTo(page, new Date(2024, 1, 1, 1), { groupId: resourceCount - 1 });
      await testScreenshot(page, buildScreenshotName(viewType, groupOrientation, 'end'), { element: scheduler });
    });
  });
});
