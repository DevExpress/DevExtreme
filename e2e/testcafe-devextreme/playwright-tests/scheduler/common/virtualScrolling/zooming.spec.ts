import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const resources = [{
  fieldExpr: 'resourceId',
  allowMultiple: true,
  dataSource: [
    { text: 'Resource 0', id: 0, color: '#20B2AA' },
    { text: 'Resource 1', id: 1, color: '#87CEEB' },
    { text: 'Resource 2', id: 2, color: '#228B22' },
    { text: 'Resource 3', id: 3, color: '#98FB98' },
    { text: 'Resource 4', id: 4, color: '#2E8B57' },
    { text: 'Resource 5', id: 5, color: '#66CDAA' },
    { text: 'Resource 6', id: 6, color: '#008080' },
    { text: 'Resource 7', id: 7, color: '#00FFFF' },
  ],
  label: 'Priority',
}];

const views = [
  { type: 'day', intervalCount: 7, endDayHour: 8 },
  { type: 'week', intervalCount: 10, endDayHour: 8 },
  { type: 'month' },
  { type: 'timelineDay', intervalCount: 7 },
  { type: 'timelineWeek', intervalCount: 3 },
  { type: 'timelineMonth' },
];

const horizontalViews = views.map((view) => ({ ...view, groupOrientation: 'horizontal' }));

const scrollConfig = [
  { firstDate: new Date(2021, 0, 7), lastDate: new Date(2021, 0, 1) },
  { firstDate: new Date(2021, 0, 15), lastDate: new Date(2020, 11, 27) },
  { firstDate: new Date(2021, 0, 1), lastDate: new Date(2020, 11, 27) },
  { firstDate: new Date(2021, 0, 7), lastDate: new Date(2021, 0, 1) },
  { firstDate: new Date(2021, 0, 15), lastDate: new Date(2020, 11, 27) },
  { firstDate: new Date(2021, 0, 30), lastDate: new Date(2021, 0, 1) },
];

async function scrollToDate(page, date: Date, groups?: Record<string, unknown>): Promise<void> {
  await page.evaluate(({ d, g }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.scrollTo(new Date(d), g);
  }, { d: date.toISOString(), g: groups });
}

async function setZoomLevel(page, zoomLevel: number): Promise<void> {
  await page.evaluate((z) => {
    $('body').css('zoom', `${z}%`);
  }, zoomLevel);
}

async function setOption(page, optionName: string, value: unknown): Promise<void> {
  await page.evaluate(({ opt, val }) => {
    ($('#container') as any).dxScheduler('instance').option(opt, val);
  }, { opt: optionName, val: value });
}

test.describe('Scheduler: Virtual Scrolling with Zooming', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled and zooming is used', async ({ page }) => {
    await setZoomLevel(page, 125);

    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 0, 1),
      height: 600,
      resources,
      views: horizontalViews,
      currentView: 'day',
      scrolling: { mode: 'virtual' },
      startDayHour: 0,
      endDayHour: 3,
      groups: ['resourceId'],
    });

    for (let i = 1; i < views.length; i += 1) {
      const view = views[i];
      await setOption(page, 'currentView', view.type);

      await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping-scaling.png`);

      await scrollToDate(page, scrollConfig[i].firstDate, { resourceId: 7 });

      await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll-horizontal-grouping-scaling.png`);
    }

    await setZoomLevel(page, 0);
  });
});
