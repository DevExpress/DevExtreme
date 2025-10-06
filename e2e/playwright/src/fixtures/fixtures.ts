import { type Locator, type Page, test as base } from '@playwright/test';
import path from 'path';

const htmlPath = process.env.DOCKER
  ? path.resolve(__dirname, '../../artifacts/container.html')
  : path.resolve(__dirname, '../../container.html');

const SELECTORS = {
  appointment: '.dx-scheduler-appointment',
  dragSource: '.dx-scheduler-appointment-drag-source',
  dateTableRow: '.dx-scheduler-date-table-row',
  dateTableCell: '.dx-scheduler-date-table-cell',
  appointmentContentDate: '.dx-scheduler-appointment-content-date',
};
class Scheduler {
  constructor(public page: Page) {}

  dragSource(): Locator {
    return this.page.locator(SELECTORS.dragSource);
  }

  getAppointment(text: string): Locator {
    return this.page.locator(SELECTORS.appointment, { hasText: text });
  }

  getDateTableCell(rowIndex = 0, cellIndex = 0): Locator {
    return this.page
      .locator(SELECTORS.dateTableRow)
      .nth(rowIndex)
      .locator(SELECTORS.dateTableCell)
      .nth(cellIndex);
  }

  getAppointmentDate(text: string): Locator {
    return this.getAppointment(text)
      .locator(SELECTORS.appointmentContentDate)
      .nth(0);
  }
}

interface Fixtures {
  forEachTest: any;
  dxScheduler: (config: object) => Promise<Scheduler>;
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

      return new Scheduler(page);
    });
  },
});

export { expect } from '@playwright/test';
