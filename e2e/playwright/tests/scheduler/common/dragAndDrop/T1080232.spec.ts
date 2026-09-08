import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { appendElementTo } from '../../../../helpers/domUtils';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

test('it should correctly drag external item to the appointment after drag appointment', async ({ page }) => {
  await appendElementTo(page, '#container', 'div', 'list');

  await page.evaluate(() => {
    $('#list').append('<div>drag-item</div>').addClass('drag-item');
  });

  await appendElementTo(page, '#container', 'div', 'scheduler');

  await createWidget(page, 'dxSortable', {
    group: 'resourceGroup',
  }, '#list');

  await createWidget(page, 'dxScheduler', {
    resources: [
      {
        fieldExpr: 'resourceId',
        dataSource: [
          { id: 0, color: '#e01e38' },
          { id: 1, color: '#f98322' },
          { id: 2, color: '#1e65e8' },
        ],
        label: 'Color',
      },
    ],
    firstDayOfWeek: 1,
    maxAppointmentsPerCell: 5,
    currentView: 'day',
    dataSource: [{
      text: 'Appt-01',
      startDate: new Date(2021, 3, 26, 10),
      endDate: new Date(2021, 3, 26, 11),
    }, {
      text: 'Appt-02',
      startDate: new Date(2021, 3, 26, 12),
      endDate: new Date(2021, 3, 26, 13),
    }],
    views: ['day'],
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    width: 800,
    height: 600,
    appointmentTemplate(e, _, element) {
      const newData = e.appointmentData;

      return element
        .text(newData.text)
        .dxSortable({
          group: 'resourceGroup',
          data: [newData],
          onAdd: () => {
            element.attr('data-status', 'Added');
          },
        });
    },
  }, '#scheduler');

  const scheduler = new Scheduler(page, '#scheduler');
  const dragItem = page.locator('.drag-item');
  const cell01 = scheduler.getDateTableCell(1, 0);
  const appt01 = scheduler.getAppointment('Appt-01');
  const appt02 = scheduler.getAppointment('Appt-02');

  await dragToElement(page, appt01.element, cell01);

  // The TestCafe test asserted the appointment stayed at 183px, which is where it started: its
  // synthetic drag left the appointment in place. A real pointer drag takes hold of it at its
  // centre, so its top lands on the first row of the date table — that is what is checked here.
  const firstRowTop = (await scheduler.getDateTableCell(0, 0).boundingBox())?.y;

  await expect.poll(async () => (await appt01.element.boundingBox())?.y).toBe(firstRowTop);

  await dragToElement(page, dragItem, appt02.element);

  await expect(appt02.element.locator('.dx-item-content'))
    .toHaveAttribute('data-status', 'Added');
});
