import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const createScheduler = (view: string) => ({
  timeZone: 'America/Los_Angeles',
  dataSource: [
    {
      text: 'Book 1',
      startDate: new Date('2021-02-02T18:00:00.000Z'),
      endDate: new Date('2021-02-02T19:00:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 2',
      startDate: new Date('2021-02-03T01:00:00.000Z'),
      endDate: new Date('2021-02-03T02:15:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 3',
      startDate: new Date('2021-02-09T01:00:00.000Z'),
      endDate: new Date('2021-02-09T02:15:00.000Z'),
      priority: 1,
    },
  ],
  views: [view],
  currentView: view,
  currentDate: new Date('2021-02-02T17:00:00.000Z'),
  firstDayOfWeek: 0,
  scrolling: { mode: 'virtual' },
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  groups: ['priority'],
  useDropDownViewSwitcher: false,
  resources: [{
    fieldExpr: 'priority',
    dataSource: [
      { id: 1, text: 'Low Priority', color: 'green' },
      { id: 2, text: 'High Priority', color: 'blue' },
    ],
    label: 'Priority',
  }],
  height: 580,
});

const scrollTo = async (page: any, x: number, y: number) => {
  await page.evaluate(({ scrollX, scrollY }: { scrollX: number; scrollY: number }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    const scrollable = instance.getWorkSpaceScrollable();
    scrollable.scrollTo({ y: scrollY, x: scrollX });
  }, { scrollX: x, scrollY: y });
};

const dragAppointmentByCircle = async (
  page: any,
  appointmentText: string,
  labels: string[],
  descriptions: string[],
) => {
  const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentText });

  const box0 = await appointment.boundingBox();
  await appointment.hover();
  await page.mouse.down();
  await page.mouse.move(box0!.x + box0!.width / 2 - 200, box0!.y + box0!.height / 2, { steps: 10 });
  await page.mouse.up();

  let ariaLabel = await appointment.getAttribute('aria-label');
  expect(ariaLabel).toContain(labels[0]);
  let ariaDesc = await appointment.getAttribute('aria-description');
  expect(ariaDesc).toContain(descriptions[0]);

  const box1 = await appointment.boundingBox();
  await appointment.hover();
  await page.mouse.down();
  await page.mouse.move(box1!.x + box1!.width / 2, box1!.y + box1!.height / 2 + 200, { steps: 10 });
  await page.mouse.up();

  ariaLabel = await appointment.getAttribute('aria-label');
  expect(ariaLabel).toContain(labels[1]);
  ariaDesc = await appointment.getAttribute('aria-description');
  expect(ariaDesc).toContain(descriptions[1]);

  const box2 = await appointment.boundingBox();
  await appointment.hover();
  await page.mouse.down();
  await page.mouse.move(box2!.x + box2!.width / 2 + 200, box2!.y + box2!.height / 2, { steps: 10 });
  await page.mouse.up();

  ariaLabel = await appointment.getAttribute('aria-label');
  expect(ariaLabel).toContain(labels[2]);
  ariaDesc = await appointment.getAttribute('aria-description');
  expect(ariaDesc).toContain(descriptions[2]);

  const box3 = await appointment.boundingBox();
  await appointment.hover();
  await page.mouse.down();
  await page.mouse.move(box3!.x + box3!.width / 2, box3!.y + box3!.height / 2 - 200, { steps: 10 });
  await page.mouse.up();

  ariaLabel = await appointment.getAttribute('aria-label');
  expect(ariaLabel).toContain(labels[3]);
  ariaDesc = await appointment.getAttribute('aria-description');
  expect(ariaDesc).toContain(descriptions[3]);
};

const appointmentDescriptions = ['Group: Low Priority', 'Group: High Priority', 'Group: High Priority', 'Group: Low Priority'];
const appointment1Times = ['9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'];
const appointment2Times = ['4:00 PM - 5:15 PM', '4:00 PM - 5:15 PM', '5:00 PM - 6:15 PM', '5:00 PM - 6:15 PM'];

test.describe('Scheduler Drag-and-Drop inside Group', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineDay)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', createScheduler('timelineDay'));

    await expect(page.locator('.dx-scheduler')).toBeVisible();

    await dragAppointmentByCircle(page, 'Book 1', appointment1Times, appointmentDescriptions);
    await scrollTo(page, 1400, 0);
    await dragAppointmentByCircle(page, 'Book 2', appointment2Times, appointmentDescriptions);
  });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineWorkWeek)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', createScheduler('timelineWorkWeek'));

    await expect(page.locator('.dx-scheduler')).toBeVisible();

    await scrollTo(page, 2400, 0);
    await dragAppointmentByCircle(page, 'Book 1', appointment1Times, appointmentDescriptions);
    await scrollTo(page, 3400, 0);
    await dragAppointmentByCircle(page, 'Book 2', appointment2Times, appointmentDescriptions);
  });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineMonth)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', createScheduler('timelineMonth'));

    await expect(page.locator('.dx-scheduler')).toBeVisible();

    await dragAppointmentByCircle(page, 'Book 1', [
      'February 1, 2021',
      'February 1, 2021',
      'February 2, 2021',
      'February 2, 2021',
    ], appointmentDescriptions);
    await scrollTo(page, 1000, 0);
    await dragAppointmentByCircle(page, 'Book 3', [
      'February 7, 2021',
      'February 7, 2021',
      'February 8, 2021',
      'February 8, 2021',
    ], appointmentDescriptions);
  });
});
