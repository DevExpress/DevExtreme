import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getElementStyle, setElementStyle } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test('Appointment should not repaint after scrolling if present on viewport', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    scrolling: {
      mode: 'virtual',
    },
    currentView: 'week',
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
  });

  const scheduler = new Scheduler(page, '#container');
  const { element } = scheduler.getAppointment('', 0);

  await setElementStyle(element, 'background-color: red;');

  const initialStyle = await getElementStyle(element);

  await scheduler.scrollTo(new Date(2020, 8, 17, 4));

  // The appointment must survive the scroll: if it were repainted, the inline style would be gone.
  await expect.poll(() => getElementStyle(element)).toBe(initialStyle);
});

test('The appointment should render correctly when scrolling vertically (T1263428)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    height: 500,
    width: 900,
    timeZone: 'Europe/Vienna',
    dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssxx',
    currentDate: new Date(2024, 10, 11, 20, 54, 23, 361),
    cellDuration: 20,
    firstDayOfWeek: 1,
    startDayHour: 12.0,
    endDayHour: 18.0,
    allDayPanelMode: 'hidden',
    scrolling: {
      mode: 'virtual',
    },
    crossScrollingEnabled: true,
    currentView: 'week',
    textExpr: 'Subject',
    startDateExpr: 'StartDate',
    endDateExpr: 'EndDate',
    views: [{
      type: 'week',
      groupByDate: true,
      startDayHour: 6.0,
      endDayHour: 22.0,
    }],
    dataSource: [{
      Subject: 'Website Re-Design Plan',
      StartDate: new Date('2024-11-11T12:10:00+0100'),
      EndDate: new Date('2024-11-12T21:00:00+0100'),
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollTo(new Date('2024-11-12T09:00:00+0100'));

  await testScreenshot(page, 'T1263428-virtual-scrolling-render-appointment.png', {
    element: scheduler.element,
  });
});
