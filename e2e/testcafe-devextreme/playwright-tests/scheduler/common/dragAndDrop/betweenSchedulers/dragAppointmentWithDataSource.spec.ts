import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, setStyleAttribute, appendElementTo } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '12:00 AM - 1:00 AM';

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getBaseSchedulerOptions = (currentDate: Date) => ({
  currentDate,
  currentView: 'workWeek',
  width: 600,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove: new Function('e', 'e.component.deleteAppointment(e.itemData);') as any,
    onAdd: new Function('e', 'e.component.addAppointment(e.itemData);') as any,
  },
});

test.describe('Drag-n-drop appointments between two schedulers with async DataSource (T1094033)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should set correct start and end dates in drag&dropped appointment', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex;');
    await appendElementTo(page, '#container', 'div', { id: FIRST_SCHEDULER_SELECTOR });
    await appendElementTo(page, '#container', 'div', { id: SECOND_SCHEDULER_SELECTOR });

    // TODO: Original test uses ClientFunction-based DataSourceMock for async data source
    await page.evaluate(({ options, selector, appointments }: any) => {
      class DataSourceMock {
        key = 'id';
        private data: any[];
        constructor(initialData: any[] = []) { this.data = initialData; }
        load = () => Promise.resolve(this.data);
        insert = (value: any) => { this.data = [...this.data, value]; return Promise.resolve(); };
        update = (key: any, value: any) => {
          this.data = this.data.map((item: any) => item.id === key ? value : item);
          return Promise.resolve();
        };
        remove = (id: any) => { this.data = this.data.filter((item: any) => item.id !== id); return Promise.resolve(); };
      }
      (window as any).DevExpress.fx.off = true;
      ($(selector) as any).dxScheduler({ ...options, dataSource: new DataSourceMock(appointments) });
    }, {
      options: getBaseSchedulerOptions(new Date(2021, 3, 26)),
      selector: `#${FIRST_SCHEDULER_SELECTOR}`,
      appointments: [TEST_APPOINTMENT],
    });

    await createWidget(page, 'dxScheduler', {
      ...getBaseSchedulerOptions(new Date(2021, 4, 26)),
      dataSource: [],
    }, `#${SECOND_SCHEDULER_SELECTOR}`);

    const appointmentToMove = page.locator(`#${FIRST_SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: TEST_APPOINTMENT.text });
    const cellToMove = page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-date-table-row`).nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

    await appointmentToMove.dragTo(cellToMove);
    await page.waitForTimeout(500);

    const movedAppointment = page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: TEST_APPOINTMENT.text });
    const timeText = await movedAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain(EXPECTED_APPOINTMENT_TIME);
  });
});
