import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getDocumentScrollTop } from '../../../../helpers/domUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test.describe('KeyboardNavigation.DocumentScrollPrevented', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      document.body.style.height = '2000px';
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 9, 10),
          endDate: new Date(2015, 1, 9, 11),
        },
        {
          text: 'Appointment 3',
          startDate: new Date(2015, 1, 9, 12),
          endDate: new Date(2015, 1, 9, 13),
        },
      ],
      height: 300,
      currentView: 'day',
      currentDate: new Date(2015, 1, 9),
    });
  });

  test('Document should not scroll on \'End\' press when appointment is focused', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('Appointment 1').element.click();

    const expectedScrollTop = await getDocumentScrollTop(page);

    await page.keyboard.press('End');
    await expect.poll(() => getDocumentScrollTop(page)).toBe(expectedScrollTop);
  });

  test('Document should not scroll on \'Home\' press when appointment is focused', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await page.evaluate(([x, y]) => window.scrollTo(x, y), [0, 100]);
    await scheduler.getAppointment('Appointment 1').element.click();

    const expectedScrollTop = await getDocumentScrollTop(page);

    await page.keyboard.press('Home');
    await expect.poll(() => getDocumentScrollTop(page)).toBe(expectedScrollTop);
  });
});
