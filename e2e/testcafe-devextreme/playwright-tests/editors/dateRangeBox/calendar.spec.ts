import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox range selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const STATE_HOVER_CLASS = 'dx-state-hover';

  test('DateRangeBox calendar appearance after change rtl mode in runtime', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 10, 30)],
      openOnFieldClick: true,
      opened: true,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await dateRangeBox.option('rtlEnabled', true);

    await testScreenshot(page, 'DRB appearance after change rtl mode in runtime.png', { element: '#container' });

    });

  test('Cells classes after hover cells, value: [null, null]', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(0)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/12'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(0)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/25'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(0)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    });

  test('Cells classes after hover date < startDate & date > startDate, currentSelection: startDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/12'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/25'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    });

  test('Cells classes after hover date < startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/12'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    });

  test('Cells classes after hover and select date > startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await page.hover(calendar.getCellByDate('2021/10/24'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(0)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(8)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(1)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(1);

    });

  test('Selected range if endDate = startDate, currentSelection: startDate', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 18), new Date(2021, 9, 18)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(1)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(1)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    await testScreenshot(page, 'DRB range, endDate = startDate.png', { element: '#container' });

    await page.hover(calendar.getCellByDate('2021/10/18'));

    await page.expect(calendar.getSelectedRangeCells().count)
      .eql(1)
      .expect(calendar.getSelectedRangeStartCell().count)
      .eql(1)
      .expect(calendar.getSelectedRangeEndCell().count)
      .eql(1)
      .expect(calendar.getHoveredRangeCells().count)
      .eql(0)
      .expect(calendar.getHoveredRangeStartCell().count)
      .eql(0)
      .expect(calendar.getHoveredRangeEndCell().count)
      .eql(0);

    });

  test('Start date cell in selected range', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 10, 6)],
      openOnFieldClick: true,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.hover(calendar.getCellByDate('2021/10/01'));

    await testScreenshot(page, 'DRB range, startDate is start in row, hover is start in view.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/10/31'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/10/16'));

    await testScreenshot(page, 'DRB range, startDate is end in view & start row, hover is end row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/10/23'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/10/03'));

    await testScreenshot(page, 'DRB range, startDate is end cell row, hover is start in row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await page.click(calendar.getCellByDate('2021/10/01'))
      .click(dateRangeBox.getStartDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await page.hover(calendar.getCellByDate('2021/09/30'));

    await testScreenshot(page, 'DRB range, startDate is start in view, hover is end in view.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await page.click(calendar.getCellByDate('2021/09/30'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/09/15'));

    await testScreenshot(page, 'DRB range, startDate is end in view, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 7, 1));

    await page.click(calendar.getCellByDate('2021/09/15'))
      .click(dateRangeBox.getStartDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 7, 1));

    await page.hover(calendar.getCellByDate('2021/08/01'));

    await testScreenshot(page, 'DRB range, startDate inside row, hover is start in view & row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await page.click(calendar.getCellByDate('2021/08/01'))
      .click(dateRangeBox.getStartDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await page.hover(calendar.getCellByDate('2021/07/31'));

    await testScreenshot(page, 'DRB range, startDate is start view & row, hover is end view & row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/07/31'))
      .click(dateRangeBox.getStartDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await page.hover(calendar.getCellByDate('2021/07/02'));

    await testScreenshot(page, 'DRB range, startDate is end in view & row, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 4, 1));

    await page.hover(calendar.getCellByDate('2021/05/01'));

    await testScreenshot(page, 'DRB range, hover is start in view & end cell row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/05/01'))
      .click(dateRangeBox.getStartDateBox().input);

    await testScreenshot(page, 'DRB range, startDate cell is start in view & end cell row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 1, 1));

    await page.hover(calendar.getCellByDate('2021/02/28'));

    await testScreenshot(page, 'DRB range, hover is end in view & start in row.png', { element: '#container' });

    });

  test('End date cell in selected range', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 23)],
      openOnFieldClick: true,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.click(calendar.getCellByDate('2021/10/24'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/10/31'));

    await testScreenshot(page, 'DRB range, endDate is start in row, hover is end view & start row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/10/25'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/01'));

    await testScreenshot(page, 'DRB range, endDate is cell inside row, hover is start in view.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/10/30'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/30'));

    await testScreenshot(page, 'DRB range, endDate is end cell row, hover is end in view.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/10/31'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/21'));

    await testScreenshot(page, 'DRB range, endDate is end in view & start row, hover is start row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2021/11/01'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/21'));

    await testScreenshot(page, 'DRB range, endDate is start in view, hover is end in row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 11, 15));

    await page.click(calendar.getCellByDate('2021/12/31'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await page.hover(calendar.getCellByDate('2022/01/01'));

    await testScreenshot(page, 'DRB range, endDate is end in view, hover is start view & end row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2022/01/01'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await page.hover(calendar.getCellByDate('2022/01/25'));

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 15));

    await testScreenshot(page, 'DRB range, endDate is start view & end cell row, hover inside row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await page.hover(calendar.getCellByDate('2022/04/30'));

    await testScreenshot(page, 'DRB range, hover is end in view & end cell row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2022/04/30'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 2, 15));
    await testScreenshot(page, 'DRB range, endDate is end in view & end cell row.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await page.hover(calendar.getCellByDate('2022/05/01'));

    await testScreenshot(page, 'DRB range, hover is start in view & start in row.png', { element: '#container' });

    await page.click(calendar.getCellByDate('2022/05/01'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 15));

    await testScreenshot(page, 'DRB range, endDate is start in view & start in row.png', { element: '#container' });

    });

  test('Cell in range', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2020, 2, 2), new Date(2024, 2, 2)],
      openOnFieldClick: true,
      opened: true,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await dateRangeBox.getCalendar().option('currentDate', new Date(2023, 2, 1));

    await testScreenshot(page, 'DRB range cells, start in view and end in row & vise versa.png', { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await testScreenshot(page, 'DRB range cells, start in view and in row & end in view and in row.png', { element: '#container' });

    });

  test('Disabled dates on start date select (disableOutOfRangeSelection: true)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      width: 500,
      disableOutOfRangeSelection: true,
      calendarOptions: {
        currentDate: new Date('2020/02/20'),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.click(calendar.getCellByDate('2020/02/20'));

    await testScreenshot(page, 'DRB disabled dates before start date select.png', { element: '#container' });

    });

  test('Disabled dates on end date select (disableOutOfRangeSelection: true)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      width: 500,
      disableOutOfRangeSelection: true,
      calendarOptions: {
        currentDate: new Date('2020/02/20'),
      },
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.click(calendar.getCellByDate('2020/02/22'));

    await testScreenshot(page, 'DRB disabled dates after end date select.png', { element: '#container' });

    });

  test('Disabled dates on inputs focus (disableOutOfRangeSelection: true)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2020/02/20'), new Date('2020/02/22')],
      width: 500,
      disableOutOfRangeSelection: true,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getStartDateBox().input)
      .hover(dateRangeBox.getStartDateBox().input);

    await testScreenshot(page, 'DRB disabled dates on popup opening.png', { element: '#container' });

    await page.click(dateRangeBox.getEndDateBox().input)
      .hover(dateRangeBox.getEndDateBox().input);

    await testScreenshot(page, 'DRB disabled dates on end date input focus.png', { element: '#container' });

    await page.click(dateRangeBox.getStartDateBox().input)
      .hover(dateRangeBox.getStartDateBox().input);

    await testScreenshot(page, 'DRB disabled dates on start date input focus.png', { element: '#container' });

    });

  test(`Hovered cell should have "${STATE_HOVER_CLASS}" class after one date selected (disableOutOfRangeSelection=true)`, async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    disableOutOfRangeSelection: true,
    calendarOptions: {
      currentDate: new Date('2020/02/20'),
    },
  }, '#container');

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await page.click(calendar.getCellByDate('2020/02/20'));

    const targetCell = calendar.getView().getCellByDate(new Date('2020/02/22'));
    await targetCell.hover()
      .expect(targetCell.hasClass(STATE_HOVER_CLASS))
      .eql(true);

    });

  test('Dates selection with focusStateEnabled=false', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateRangeBox');

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2020/02/20'), new Date('2020/02/22')],
      width: 500,
      focusStateEnabled: false,
    }, '#dateRangeBox');

    const dateRangeBox = page.locator('#dateRangeBox');
    const calendar = dateRangeBox.getCalendar();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(calendar.getCellByDate('2020/02/10'));

    await page.click(calendar.getCellByDate('2020/02/25'));

    const expectedStartDate = new Date('2020/02/10');
    const expectedEndDate = new Date('2020/02/25');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([expectedStartDate, expectedEndDate]);

    });
});
