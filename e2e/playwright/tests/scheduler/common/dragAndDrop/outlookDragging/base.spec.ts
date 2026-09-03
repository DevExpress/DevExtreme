import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { blurActiveElement } from '../../../../../helpers/domUtils';
import { dragToOffset } from '../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import { getFullThemeName } from '../../../../../helpers/themeUtils';
import Scheduler from '../../../../../models/scheduler';

test('Basic drag-n-drop movements in groups', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 330, 70);

  await testScreenshot(page, 'drag-n-drop-to-orange-group.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -330, 70);

  await testScreenshot(page, 'drag-n-drop-blue-group.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop movements from tooltip in week view', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.collectors.find('2').element.click();
  await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

  await dragToOffset(
    page,
    scheduler.appointmentTooltip.getListItem('Appointment 3').element,
    200,
    50,
  );

  await testScreenshot(page, 'drag-n-drop-\'Appointment 3\'-from-tooltip-in-week.png', {
    element: scheduler.workSpace,
  });

  await scheduler.collectors.find('1').element.click();
  await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

  await dragToOffset(
    page,
    scheduler.appointmentTooltip.getListItem('Appointment 2').element,
    350,
    150,
  );

  await testScreenshot(page, 'drag-n-drop-\'Appointment 2\'-from-tooltip-in-week.png', {
    element: scheduler.workSpace,
  });
});

test('Basic drag-n-drop movements from tooltip in month view', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  // The TestCafe test named a theme to run in, and the runner dropped it everywhere else; the
  // etalons exist for the generic theme only.
  test.skip(getFullThemeName() !== 'generic.light', 'the etalons are recorded in the generic theme');

  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.collectors.find('2').element.click();
  await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

  await dragToOffset(
    page,
    scheduler.appointmentTooltip.getListItem('Appointment 3').element,
    -180,
    -30,
  );

  await testScreenshot(page, 'drag-n-drop-\'Appointment 3\'-from-tooltip-in-month.png', {
    element: scheduler.workSpace,
  });

  await scheduler.collectors.find('1', 1).element.click();
  await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

  await dragToOffset(
    page,
    scheduler.appointmentTooltip.getListItem('Appointment 2').element,
    320,
    150,
  );

  await testScreenshot(page, 'drag-n-drop-\'Appointment 2\'-from-tooltip-in-month.png', {
    element: scheduler.workSpace,
  });
});

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
    await createWidget(page, 'dxScheduler', {
      dataSource,
      views: ['timelineWeek', 'timelineMonth'],
      currentView,
      currentDate: new Date(2021, 2, 21),
      startDayHour: 9,
      height: 600,
      width: 1000,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

    await dragToOffset(page, draggableAppointment.element, 250, 0);

    await testScreenshot(page, `drag-n-drop-${currentView}-to-right.png`, { element: scheduler.workSpace });

    await dragToOffset(page, draggableAppointment.element, -250, 0);

    await testScreenshot(page, `drag-n-drop-${currentView}-to-left.png`, { element: scheduler.workSpace });
  });
});

test('Basic drag-n-drop movements', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 100, 0);

  await testScreenshot(page, 'drag-n-drop-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -100, 0);

  await testScreenshot(page, 'drag-n-drop-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 100);

  await testScreenshot(page, 'drag-n-drop-to-bottom.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -100);

  await testScreenshot(page, 'drag-n-drop-to-top.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop movements with mouse offset', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');
  const grab = { offsetX: 10, offsetY: 200 };

  await dragToOffset(page, draggableAppointment.element, 100, 0, grab);
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -100, 0, grab);
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 100, grab);
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-bottom.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -100, grab);
  await testScreenshot(page, 'drag-n-drop-mouse-offset-to-top.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop all day appointment movements', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 200, 0);
  await testScreenshot(page, 'drag-n-drop-all-day-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -200, 0);
  await testScreenshot(page, 'drag-n-drop-all-day-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 260, 270);
  await testScreenshot(page, 'drag-n-drop-all-day-to-bottom.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -260);
  await testScreenshot(page, 'drag-n-drop-all-day-to-top.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop movements within the cell', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 55, 0);
  await blurActiveElement(page);
  await testScreenshot(page, 'drag-n-drop-within-cell-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -50, 0);
  await blurActiveElement(page);
  await testScreenshot(page, 'drag-n-drop-within-cell-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 30);
  await blurActiveElement(page);
  await testScreenshot(page, 'drag-n-drop-within-cell-to-bottom.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop small appointments', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 250, 0);
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -250, 0);
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 170);
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-bottom.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -170);
  await testScreenshot(page, 'drag-n-drop-small-appoint-to-top.png', { element: scheduler.workSpace });
});

test('Basic drag-n-drop long appointments', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 150, 0);
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -30, 0);
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 70);
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-bottom.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -70);
  await testScreenshot(page, 'drag-n-drop-long-appoint-to-top.png', { element: scheduler.workSpace });
});

test('Narrow appointment dragging on minimal distance should be expected(1171520)', async ({ page }) => {
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
  });

  const scheduler = new Scheduler(page, '#container');

  await dragToOffset(page, scheduler.getAppointment('Test').element, -10, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-min-dist-to-left.png', { element: scheduler.workSpace });

  await dragToOffset(page, scheduler.getAppointment('Test').element, 195, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-to-right.png', { element: scheduler.workSpace });

  await dragToOffset(page, scheduler.getAppointment('Test').element, 200, 0, { offsetX: 10 });

  await testScreenshot(page, 'drag-short-app-to-right-on-next-cell.png', { element: scheduler.workSpace });
});
