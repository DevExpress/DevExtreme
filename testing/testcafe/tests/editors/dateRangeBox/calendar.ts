import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  appendElementTo,
  setAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { clearTestPage } from '../../../helpers/clearPage';
import DateRangeBox from '../../../model/dateRangeBox';

fixture.disablePageReloads`DateRangeBox range selection`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('Cells classes after hover cells, value: [null, null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  const calendar = dateRangeBox.getCalendar();

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/12'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/25'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px;');

  return createWidget('dxDateRangeBox', {
    value: [null, null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
  }, '#dateRangeBox');
});

test('Cells classes after hover date < startDate & date > startDate, currentSelection: startDate, value: [new Date(2021, 9, 17), null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  const calendar = dateRangeBox.getCalendar();

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/12'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/25'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px;');

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
  }, '#dateRangeBox');
});

test('Cells classes after hover date < startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  const calendar = dateRangeBox.getCalendar();

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/12'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px;');

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
  }, '#dateRangeBox');
});

test('Cells classes after hover and select date > startDate, currentSelection: endDate, value: [new Date(2021, 9, 17), null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  const calendar = dateRangeBox.getCalendar();

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .hover(calendar.getCellByDate('2021/10/24'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
  }, '#dateRangeBox');
});

test('Selected range if endDate = startDate, currentSelection: startDate', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  const calendar = dateRangeBox.getCalendar();

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await testScreenshot(t, takeScreenshot, 'DRB range, endDate = startDate.png', { element: '#container' });

  await t
    .hover(calendar.getCellByDate('2021/10/18'));

  await t
    .expect(calendar.getSelectedRangeCells().count)
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

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 18), new Date(2021, 9, 18)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
  }, '#dateRangeBox');
});

[false, true].forEach((rtlEnabled) => {
  const screenshotPostfix = rtlEnabled ? ', rtl=true' : '';

  test('Start date cell in selected range', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateRangeBox = new DateRangeBox('#dateRangeBox');

    await t
      .click(dateRangeBox.getStartDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await t
      .hover(calendar.getCellByDate('2021/10/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is start cell in row, hover start cell is first of month${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/10/31'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/10/16'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is last cell in view & start cell in row, hover start cell is end in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/10/23'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/10/03'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is end cell in row, hover start cell is start in row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await t
      .click(calendar.getCellByDate('2021/10/01'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/09/30'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is start cell in view, hover start cell is end of month${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 8, 1));

    await t
      .click(calendar.getCellByDate('2021/09/30'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/09/15'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is end cell in view, hover start cell inside row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 7, 1));

    await t
      .click(calendar.getCellByDate('2021/09/15'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/08/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is cell inside row, hover start cell is start in view & start in row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

    await t
      .click(calendar.getCellByDate('2021/08/01'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/07/31'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is start cell in view & start cell in row, hover start cell is end in view & end in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/07/31'))
      .click(dateRangeBox.getStartDateBox().input)
      .hover(calendar.getCellByDate('2021/06/02'));

    await testScreenshot(t, takeScreenshot, `DRB range, startDate is end cell in view & end cell in row, hover start cell inside row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 4, 1));

    await t
      .hover(calendar.getCellByDate('2021/05/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, hover start cell is start cell in view & end cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/05/01'))
      .click(dateRangeBox.getStartDateBox().input);

    await testScreenshot(t, takeScreenshot, `DRB range, startDate cell is start cell in view & end cell in row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 1, 1));

    await t
      .hover(calendar.getCellByDate('2021/02/28'));

    await testScreenshot(t, takeScreenshot, `DRB range, hover start cell is end cell in view & start cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'dateRangeBox');
    await setAttribute('#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    return createWidget('dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 10, 6)],
      openOnFieldClick: true,
      width: 500,
      rtlEnabled,
    }, '#dateRangeBox');
  });

  test('End date cell in selected range', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateRangeBox = new DateRangeBox('#dateRangeBox');

    await t
      .click(dateRangeBox.getEndDateBox().input);

    const calendar = dateRangeBox.getCalendar();

    await t
      .click(calendar.getCellByDate('2021/10/24'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/10/31'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is start cell in row, hover start cell is end cell in view & start cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/10/25'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is cell inside row, hover start cell is start in view${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/10/30'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/30'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is end cell in row, hover start cell is end in view${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/10/31'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/21'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is end cell in view & start cell in row, hover start cell is start in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2021/11/01'))
      .click(dateRangeBox.getEndDateBox().input)
      .hover(calendar.getCellByDate('2021/11/21'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is start cell in view, hover start cell is end in row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 11, 1));

    await t
      .click(calendar.getCellByDate('2021/12/31'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 1));

    await t
      .hover(calendar.getCellByDate('2022/01/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is end cell in view, hover start cell is start in view & last in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2022/01/01'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 1));

    await t
      .hover(calendar.getCellByDate('2022/01/25'));

    await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 12, 1));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is start cell in view & end cell in row, hover start cell inside row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 2, 1));

    await t
      .hover(calendar.getCellByDate('2022/04/30'));

    await testScreenshot(t, takeScreenshot, `DRB range, hover start cell is end cell in view & end cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2022/04/30'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 2, 1));
    await testScreenshot(t, takeScreenshot, `DRB range, endDate is end cell in view & end cell in row${screenshotPostfix}.png`, { element: '#container' });

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 1));

    await t
      .hover(calendar.getCellByDate('2022/05/01'));

    await testScreenshot(t, takeScreenshot, `DRB range, hover start cell is start cell in view & start cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .click(calendar.getCellByDate('2022/05/01'))
      .click(dateRangeBox.getEndDateBox().input);

    await dateRangeBox.getCalendar().option('currentDate', new Date(2022, 3, 1));

    await testScreenshot(t, takeScreenshot, `DRB range, endDate is start cell in view & start cell in row${screenshotPostfix}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'dateRangeBox');
    await setAttribute('#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

    return createWidget('dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 23)],
      openOnFieldClick: true,
      rtlEnabled,
      width: 500,
    }, '#dateRangeBox');
  });
});

test('Cell in range', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await dateRangeBox.getCalendar().option('currentDate', new Date(2023, 2, 1));

  await testScreenshot(t, takeScreenshot, 'DRB range cells, start in view and end in row & vise versa.png', { element: '#container' });

  await dateRangeBox.getCalendar().option('currentDate', new Date(2021, 6, 1));

  await testScreenshot(t, takeScreenshot, 'DRB range cells, start in view and in row & end in view and in row.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await setAttribute('#container', 'style', 'width: 800px; height: 500px; padding-top: 10px;');

  return createWidget('dxDateRangeBox', {
    value: [new Date(2020, 2, 2), new Date(2024, 2, 2)],
    openOnFieldClick: true,
    opened: true,
    width: 500,
  }, '#dateRangeBox');
});
