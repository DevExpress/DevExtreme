import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import type Calendar from '../../../models/calendar';
import DateRangeBox from '../../../models/dateRangeBox';
import { expectClass } from '../../../models/internal/classMatcher';

const STATE_HOVER_CLASS = 'dx-state-hover';

type CellCounts = [cells: number, startCells: number, endCells: number];

const expectRangeCells = async (
  calendar: Calendar,
  [selectedCells, selectedStartCells, selectedEndCells]: CellCounts,
  [hoveredCells, hoveredStartCells, hoveredEndCells]: CellCounts,
): Promise<void> => {
  await expect(calendar.getSelectedRangeCells()).toHaveCount(selectedCells);
  await expect(calendar.getSelectedRangeStartCell()).toHaveCount(selectedStartCells);
  await expect(calendar.getSelectedRangeEndCell()).toHaveCount(selectedEndCells);
  await expect(calendar.getHoveredRangeCells()).toHaveCount(hoveredCells);
  await expect(calendar.getHoveredRangeStartCell()).toHaveCount(hoveredStartCells);
  await expect(calendar.getHoveredRangeEndCell()).toHaveCount(hoveredEndCells);
};

const createDateRangeBox = async (
  page: Page,
  containerStyle: string,
  options: object,
): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'dateRangeBox');
  await setAttribute(page, '#container', 'style', containerStyle);

  await createWidget(page, 'dxDateRangeBox', options, '#dateRangeBox');
};

test.describe('DateRangeBox range selection', () => {
  test('DateRangeBox calendar appearance after change rtl mode in runtime', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2021, 9, 17), new Date(2021, 10, 30)],
      openOnFieldClick: true,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.option('rtlEnabled', true);

    await testScreenshot(page, 'DRB appearance after change rtl mode in runtime.png', { element: '#container' });
  });

  test('Cells classes after hover cells, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px;', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await expectRangeCells(calendar, [0, 0, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/12').hover();

    await expectRangeCells(calendar, [0, 0, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/25').hover();

    await expectRangeCells(calendar, [0, 0, 0], [0, 0, 0]);
  });

  test('Cells classes after hover date < startDate & date > startDate, currentSelection: startDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px;', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/12').hover();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/25').hover();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);
  });

  test('Cells classes after hover date < startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px;', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/12').hover();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);
  });

  test('Cells classes after hover and select date > startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await expectRangeCells(calendar, [0, 1, 0], [0, 0, 0]);

    await calendar.getCellByDate('2021/10/24').hover();

    await expectRangeCells(calendar, [0, 1, 0], [8, 1, 1]);
  });

  test('Selected range if endDate = startDate, currentSelection: startDate', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2021, 9, 18), new Date(2021, 9, 18)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await expectRangeCells(calendar, [1, 1, 1], [0, 0, 0]);

    await testScreenshot(page, 'DRB range, endDate = startDate.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/18').hover();

    await expectRangeCells(calendar, [1, 1, 1], [0, 0, 0]);
  });

  test('Start date cell in selected range', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2021, 9, 17), new Date(2021, 10, 6)],
      openOnFieldClick: true,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await calendar.getCellByDate('2021/10/01').hover();

    await testScreenshot(page, 'DRB range, startDate is start in row, hover is start in view.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/31').click();
    await dateRangeBox.getStartDateBox().input.click();
    await calendar.getCellByDate('2021/10/16').hover();

    await testScreenshot(page, 'DRB range, startDate is end in view & start row, hover is end row.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/23').click();
    await dateRangeBox.getStartDateBox().input.click();
    await calendar.getCellByDate('2021/10/03').hover();

    await testScreenshot(page, 'DRB range, startDate is end cell row, hover is start in row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await calendar.getCellByDate('2021/10/01').click();
    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await calendar.getCellByDate('2021/09/30').hover();

    await testScreenshot(page, 'DRB range, startDate is start in view, hover is end in view.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await calendar.getCellByDate('2021/09/30').click();
    await dateRangeBox.getStartDateBox().input.click();
    await calendar.getCellByDate('2021/09/15').hover();

    await testScreenshot(page, 'DRB range, startDate is end in view, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 7, 1));

    await calendar.getCellByDate('2021/09/15').click();
    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 7, 1));

    await calendar.getCellByDate('2021/08/01').hover();

    await testScreenshot(page, 'DRB range, startDate inside row, hover is start in view & row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await calendar.getCellByDate('2021/08/01').click();
    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await calendar.getCellByDate('2021/07/31').hover();

    await testScreenshot(page, 'DRB range, startDate is start view & row, hover is end view & row.png', { element: '#container' });

    await calendar.getCellByDate('2021/07/31').click();
    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await calendar.getCellByDate('2021/07/02').hover();

    await testScreenshot(page, 'DRB range, startDate is end in view & row, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 4, 1));

    await calendar.getCellByDate('2021/05/01').hover();

    await testScreenshot(page, 'DRB range, hover is start in view & end cell row.png', { element: '#container' });

    await calendar.getCellByDate('2021/05/01').click();
    await dateRangeBox.getStartDateBox().input.click();

    await testScreenshot(page, 'DRB range, startDate cell is start in view & end cell row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 1, 1));

    await calendar.getCellByDate('2021/02/28').hover();

    await testScreenshot(page, 'DRB range, hover is end in view & start in row.png', { element: '#container' });
  });

  test('End date cell in selected range', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 23)],
      openOnFieldClick: true,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await calendar.getCellByDate('2021/10/24').click();
    await dateRangeBox.getEndDateBox().input.click();
    await calendar.getCellByDate('2021/10/31').hover();

    await testScreenshot(page, 'DRB range, endDate is start in row, hover is end view & start row.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/25').click();
    await dateRangeBox.getEndDateBox().input.click();
    await calendar.getCellByDate('2021/11/01').hover();

    await testScreenshot(page, 'DRB range, endDate is cell inside row, hover is start in view.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/30').click();
    await dateRangeBox.getEndDateBox().input.click();
    await calendar.getCellByDate('2021/11/30').hover();

    await testScreenshot(page, 'DRB range, endDate is end cell row, hover is end in view.png', { element: '#container' });

    await calendar.getCellByDate('2021/10/31').click();
    await dateRangeBox.getEndDateBox().input.click();
    await calendar.getCellByDate('2021/11/21').hover();

    await testScreenshot(page, 'DRB range, endDate is end in view & start row, hover is start row.png', { element: '#container' });

    await calendar.getCellByDate('2021/11/01').click();
    await dateRangeBox.getEndDateBox().input.click();
    await calendar.getCellByDate('2021/11/21').hover();

    await testScreenshot(page, 'DRB range, endDate is start in view, hover is end in row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 11, 15));

    await calendar.getCellByDate('2021/12/31').click();
    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await calendar.getCellByDate('2022/01/01').hover();

    await testScreenshot(page, 'DRB range, endDate is end in view, hover is start view & end row.png', { element: '#container' });

    await calendar.getCellByDate('2022/01/01').click();
    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await calendar.getCellByDate('2022/01/25').hover();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await testScreenshot(page, 'DRB range, endDate is start view & end cell row, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await calendar.getCellByDate('2022/04/30').hover();

    await testScreenshot(page, 'DRB range, hover is end in view & end cell row.png', { element: '#container' });

    await calendar.getCellByDate('2022/04/30').click();
    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 2, 15));
    await testScreenshot(page, 'DRB range, endDate is end in view & end cell row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await calendar.getCellByDate('2022/05/01').hover();

    await testScreenshot(page, 'DRB range, hover is start in view & start in row.png', { element: '#container' });

    await calendar.getCellByDate('2022/05/01').click();
    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await testScreenshot(page, 'DRB range, endDate is start in view & start in row.png', { element: '#container' });
  });

  test('Cell in range', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date(2020, 2, 2), new Date(2024, 2, 2)],
      openOnFieldClick: true,
      opened: true,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getCalendar().option('currentDate', new Date(2023, 2, 1));

    await testScreenshot(page, 'DRB range cells, start in view and end in row & vise versa.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await testScreenshot(page, 'DRB range cells, start in view and in row & end in view and in row.png', { element: '#container' });
  });

  test('Disabled dates on start date select (disableOutOfRangeSelection: true)', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      width: 500,
      disableOutOfRangeSelection: true,
      calendarOptions: {
        currentDate: new Date('2020/02/20'),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await calendar.getCellByDate('2020/02/20').click();

    await testScreenshot(page, 'DRB disabled dates before start date select.png', { element: '#container' });
  });

  test('Disabled dates on end date select (disableOutOfRangeSelection: true)', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      width: 500,
      disableOutOfRangeSelection: true,
      calendarOptions: {
        currentDate: new Date('2020/02/20'),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await calendar.getCellByDate('2020/02/22').click();

    await testScreenshot(page, 'DRB disabled dates after end date select.png', { element: '#container' });
  });

  test('Disabled dates on inputs focus (disableOutOfRangeSelection: true)', async ({ page }) => {
    await createDateRangeBox(page, 'width: 800px; height: 500px; padding-top: 10px;', {
      value: [new Date('2020/02/20'), new Date('2020/02/22')],
      width: 500,
      disableOutOfRangeSelection: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();
    await dateRangeBox.getStartDateBox().input.hover();

    await testScreenshot(page, 'DRB disabled dates on popup opening.png', { element: '#container' });

    await dateRangeBox.getEndDateBox().input.click();
    await dateRangeBox.getEndDateBox().input.hover();

    await testScreenshot(page, 'DRB disabled dates on end date input focus.png', { element: '#container' });

    await dateRangeBox.getStartDateBox().input.click();
    await dateRangeBox.getStartDateBox().input.hover();

    await testScreenshot(page, 'DRB disabled dates on start date input focus.png', { element: '#container' });
  });

  test(`Hovered cell should have "${STATE_HOVER_CLASS}" class after one date selected (disableOutOfRangeSelection=true)`, async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      disableOutOfRangeSelection: true,
      calendarOptions: {
        currentDate: new Date('2020/02/20'),
      },
    }, '#container');

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    const calendar = dateRangeBox.getCalendar();

    await calendar.getCellByDate('2020/02/20').click();

    const targetCell = calendar.getView().getCellByDate(new Date('2020/02/22'));

    await targetCell.hover();
    await expectClass(targetCell, STATE_HOVER_CLASS);
  });

  test('Dates selection with focusStateEnabled=false', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2020/02/20'), new Date('2020/02/22')],
      width: 500,
      focusStateEnabled: false,
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');
    const calendar = dateRangeBox.getCalendar();

    await dateRangeBox.getStartDateBox().input.click();

    await calendar.getCellByDate('2020/02/10').click();

    await calendar.getCellByDate('2020/02/25').click();

    const expectedStartDate = new Date('2020/02/10');
    const expectedEndDate = new Date('2020/02/25');

    await expect.poll(() => dateRangeBox.option('opened')).toBe(false);
    await expect.poll(() => dateRangeBox.option('value')).toEqual([expectedStartDate, expectedEndDate]);
  });
});
