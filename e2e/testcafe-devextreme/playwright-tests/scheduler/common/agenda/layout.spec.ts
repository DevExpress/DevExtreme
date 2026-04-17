import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const data = [
  { text: 'Website Re-Design Plan', ownerId: [4, 1, 2], roomId: [1, 2, 3], priorityId: 2, startDate: new Date('2021-05-24T16:30:00.000Z'), endDate: new Date('2021-05-24T18:30:00.000Z'), recurrenceRule: 'FREQ=WEEKLY', allDay: true },
  { text: 'Book Flights to San Fran for Sales Trip', ownerId: 2, roomId: 2, priorityId: 1, startDate: new Date('2021-05-24T19:00:00.000Z'), endDate: new Date('2021-05-24T20:00:00.000Z'), allDay: true },
  { text: 'Final Budget Review', ownerId: 1, roomId: 1, priorityId: 1, startDate: new Date('2021-05-25T19:00:00.000Z'), endDate: new Date('2021-05-25T20:35:00.000Z') },
  { text: 'New Brochures', ownerId: 4, roomId: 3, priorityId: 2, startDate: new Date('2021-05-25T21:30:00.000Z'), endDate: new Date('2021-05-25T22:45:00.000Z') },
  { text: 'Install New Database', ownerId: 2, roomId: 3, priorityId: 1, startDate: new Date('2021-05-26T16:45:00.000Z'), endDate: new Date('2021-05-26T18:15:00.000Z') },
  { text: 'Approve New Online Marketing Strategy', ownerId: 4, roomId: 2, priorityId: 1, startDate: new Date('2021-05-26T19:00:00.000Z'), endDate: new Date('2021-05-26T21:00:00.000Z') },
  { text: 'Upgrade Personal Computers', ownerId: 2, roomId: 2, priorityId: 2, startDate: new Date('2021-05-26T22:15:00.000Z'), endDate: new Date('2021-05-26T23:30:00.000Z') },
];

const resourcesData = [
  { fieldExpr: 'roomId', allowMultiple: true, dataSource: [{ text: 'Room 1', id: 1, color: '#00af2c' }, { text: 'Room 2', id: 2, color: '#56ca85' }, { text: 'Room 3', id: 3, color: '#8ecd3c' }], label: 'Room' },
  { fieldExpr: 'priorityId', allowMultiple: true, dataSource: [{ text: 'High priority', id: 1, color: '#cc5c53' }, { text: 'Low priority', id: 2, color: '#ff9747' }], label: 'Priority' },
  { fieldExpr: 'ownerId', allowMultiple: true, dataSource: [{ text: 'Samantha Bright', id: 1, color: '#727bd2' }, { text: 'John Heart', id: 2, color: '#32c9ed' }, { text: 'Todd Hoffman', id: 3, color: '#2a7ee4' }, { text: 'Sandra Johnson', id: 4, color: '#7b49d3' }], label: 'Owner' },
];

const createScheduler = async (page, rtlEnabled: boolean, resources: any[] | undefined, groups: string[] | undefined): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: data,
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 25),
    resources,
    rtlEnabled,
    groups,
    height: 600,
  });
};

test.describe('Agenda:layout', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [false, true].forEach((rtlEnabled) => {
    [undefined, resourcesData].forEach((resources) => {
      test(`Agenda test layout(rtl=${rtlEnabled}, resources=${!!resources}`, async ({ page }) => {
        await createScheduler(page, rtlEnabled, resources, undefined);
        await testScreenshot(page, `agenda-layout-rtl=${rtlEnabled}-resources=${!!resources}.png`);
      });
    });
  });

  [false, true].forEach((rtlEnabled) => {
    test(`Agenda test layout with groups(rtl=${rtlEnabled}`, async ({ page }) => {
      await createScheduler(page, rtlEnabled, resourcesData, ['roomId']);
      await testScreenshot(page, `agenda-layout-groups-rtl=${rtlEnabled}.png`);
    });
  });

  test('Agenda test appointment state', async ({ page }) => {
    await createScheduler(page, false, resourcesData, undefined);

    const finalBudget = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Final Budget Review' }).first();
    await finalBudget.hover();
    await testScreenshot(page, 'agenda-layout-appointment-state-hover.png');

    const newBrochures = page.locator('.dx-scheduler-appointment').filter({ hasText: 'New Brochures' }).first();
    await newBrochures.click();
    await testScreenshot(page, 'agenda-layout-appointment-state-click.png');
  });
});
