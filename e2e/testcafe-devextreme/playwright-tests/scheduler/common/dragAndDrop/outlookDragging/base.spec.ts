import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Outlook dragging base tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Basic drag-n-drop movements in groups', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date(2021, 1, 2),
      endDate: new Date(2021, 1, 2, 1),
    }],
    views: ['timelineWeek'],
    currentView: 'timelineWeek',
    currentDate: new Date(2021, 1, 2),
    cellDuration: 1440,
    height: 300,
    with: 500,
  // --- test ---
// Scheduler on '#container'

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(330, 70) */;

  await testScreenshot(page, 'drag-n-drop-to-orange-group.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-330, 70) */;
  await testScreenshot(page, 'drag-n-drop-blue-group.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 26, 8, 30),
    endDate: new Date(2021, 2, 26, 11, 0),
    priorityId: 1,
  }],
  groups: ['priorityId'],
  resources: [{
    fieldExpr: 'priorityId',
    allowMultiple: false,
    dataSource: [{
      text: 'Low Priority',
      id: 1,
      color: '#1e90ff',
    }, {
      text: 'High Priority',
      id: 2,
      color: '#ff9747',
    }],
    label: 'Priority',
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 26),
  startDayHour: 8,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements from tooltip in week view', async ({ page }) => {
  // Scheduler on '#container'

    await (scheduler.collectors.find('2').click().element)
    .expect(scheduler.appointmentTooltip.isVisible()).toBeTruthy()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 3').element, 200, 50);

  await testScreenshot(page, 'drag-n-drop-\'Appointment 3\'-from-tooltip-in-week.png', {
    element: page.locator('.dx-scheduler-work-space'),
  });

  await (scheduler.collectors.find('1').click().element)
    .expect(scheduler.appointmentTooltip.isVisible()).toBeTruthy()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 2').element, 350, 150);

  await testScreenshot(page, 'drag-n-drop-\'Appointment 2\'-from-tooltip-in-week.png', {
    element: page.locator('.dx-scheduler-work-space'),
  });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Appointment 1',
    startDate: new Date(2021, 2, 21, 9, 30),
    endDate: new Date(2021, 2, 21, 12, 0),
  }, {
    text: 'Appointment 2',
    startDate: new Date(2021, 2, 21, 9, 30),
    endDate: new Date(2021, 2, 21, 12, 0),
  }, {
    text: 'Appointment 3',
    startDate: new Date(2021, 2, 21, 9, 30),
    endDate: new Date(2021, 2, 21, 11, 0),
  }, {
    text: 'Appointment 4',
    startDate: new Date(2021, 2, 21, 9, 30),
    endDate: new Date(2021, 2, 21, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 21),
  startDayHour: 8,
  height: 600,
  width: 1000,
}));

test.meta({ runInTheme: Themes.genericLight })('Basic drag-n-drop movements from tooltip in month view', async (t) => {
  // Scheduler on '#container'

    await (scheduler.collectors.find('2').click().element)
    .expect(scheduler.appointmentTooltip.isVisible()).toBeTruthy()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 3').element, -180, -30);

  await testScreenshot(page, 'drag-n-drop-\'Appointment 3\'-from-tooltip-in-month.png', {
    element: page.locator('.dx-scheduler-work-space'),
  });

  await (scheduler.collectors.find('1', 1).click().element)
    .expect(scheduler.appointmentTooltip.isVisible()).toBeTruthy()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 2').element, 320, 150);

  await testScreenshot(page, 'drag-n-drop-\'Appointment 2\'-from-tooltip-in-month.png', {
    element: page.locator('.dx-scheduler-work-space'),
  });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Appointment 1',
    startDate: new Date(2021, 2, 31, 9, 30),
    endDate: new Date(2021, 3, 1, 12, 0),
  }, {
    text: 'Appointment 2',
    startDate: new Date(2021, 2, 31, 9, 30),
    endDate: new Date(2021, 3, 1, 12, 0),
  }, {
    text: 'Appointment 3',
    startDate: new Date(2021, 2, 31, 9, 30),
    endDate: new Date(2021, 3, 1, 11, 0),
  }, {
    text: 'Appointment 4',
    startDate: new Date(2021, 2, 31, 9, 30),
    endDate: new Date(2021, 3, 1, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 2, 27),
  startDayHour: 8,
  height: 600,
  width: 1000,
}));

[{
  currentView: 'timelineWeek',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 21, 9, 30),
    endDate: new Date(2021, 2, 21, 10, 45),
  }],
}, {
  currentView: 'timelineMonth',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 2, 9, 30),
    endDate: new Date(2021, 2, 3, 11, 0),
  }],
}].forEach(({ currentView, dataSource }) => {
  test(`Basic drag-n-drop movements in ${currentView} view`, async ({ page }) => {
    // Scheduler on '#container'
    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

        await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(250, 0) */;

    await testScreenshot(page, `drag-n-drop-${currentView}-to-right.png`, { element: page.locator('.dx-scheduler-work-space') });

    await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-250, 0) */;

    await testScreenshot(page, `drag-n-drop-${currentView}-to-left.png`, { element: page.locator('.dx-scheduler-work-space') });

    expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget(page, 'dxScheduler', {
    dataSource,
    views: ['timelineWeek', 'timelineMonth'],
    currentView,
    currentDate: new Date(2021, 2, 21),
    startDayHour: 9,
    height: 600,
    width: 1000,
  }));
});

test('Basic drag-n-drop movements', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await t.drag(draggableAppointment.element, 100, 0, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, -100, 0, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, 100, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, -100, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-top.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 22, 10),
    endDate: new Date(2021, 2, 22, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 22),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements with mouse offset', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await t.drag(draggableAppointment.element, 100, 0, { offsetX: 10, offsetY: 200, speed: 0.5 });
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, -100, 0, { offsetX: 10, offsetY: 200, speed: 0.5 });
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, 100, { offsetX: 10, offsetY: 200, speed: 0.5 });
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, -100, { offsetX: 10, offsetY: 200, speed: 0.5 });
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-top.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 22, 10),
    endDate: new Date(2021, 2, 22, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 22),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop all day appointment movements', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await t.drag(draggableAppointment.element, 200, 0, { speed: 0.1 });
  await testScreenshot(page, 'drag-n-drop-all-day-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, -200, 0, { speed: 0.1 });
  await testScreenshot(page, 'drag-n-drop-all-day-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 260, 270, { speed: 0.1 });
  await testScreenshot(page, 'drag-n-drop-all-day-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, -260, { speed: 0.1 });
  await testScreenshot(page, 'drag-n-drop-all-day-to-top.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 23, 10),
    endDate: new Date(2021, 2, 25, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 23),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements within the cell', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    async function blurActiveElement(page: Page) {
  await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  }, );
}

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(55, 0) */;
  await blurActiveElement();
  await testScreenshot(page, 'drag-n-drop-within-cell-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-50, 0) */;
  await blurActiveElement();
  await testScreenshot(page, 'drag-n-drop-within-cell-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, 30) */;
  await blurActiveElement();
  await testScreenshot(page, 'drag-n-drop-within-cell-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 22, 10),
    endDate: new Date(2021, 2, 22, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 22),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop small appointments', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(250, 0) */;
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-250, 0) */;
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, 170) */;
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, -170) */;
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-top.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 17, 10),
    endDate: new Date(2021, 2, 17, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 2, 17),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop long appointments', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(150, 0) */;
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-30, 0) */;
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, 70) */;
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-bottom.png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, -70) */;
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-top.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 16, 10),
    endDate: new Date(2021, 2, 18, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 2, 16),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Narrow appointment dragging on minimal distance should be expected(1171520)', async ({ page }) => {
  // Scheduler on '#container'
    await t.drag(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' }).element, -10, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-min-dist-to-left.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' }).element, 195, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-to-right.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' }).element, 200, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-to-right-on-next-cell.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
