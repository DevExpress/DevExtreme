import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture`Calendar`
  .page(url(__dirname, '../../container.html'));

test('Calendar with showWeekNumbers rendered correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with showWeekNumbers.png', { element: '#container', shouldTestInCompact: true });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2022, 0, 1),
  showWeekNumbers: true,
}));

test('Calendar with showWeekNumbers rendered correct for last week of year value', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with showWeekNumbers last week.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2021, 11, 31),
  showWeekNumbers: true,
  weekNumberRule: 'firstDay',
}));

test('Calendar with showWeekNumbers rendered correct with rtlEnabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with showWeekNumbers rtl=true.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2022, 0, 1),
  showWeekNumbers: true,
  rtlEnabled: true,
}));

test('Calendar with showWeekNumbers rendered correct with cellTemplate', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with showWeekNumbers and cell template.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2022, 0, 1),
  showWeekNumbers: true,
  cellTemplate(cellData, cellIndex) {
    const italic = $('<span>').css('font-style', 'italic')
      .text(cellData.text);
    const bold = $('<span>').css('font-weight', '900')
      .text(cellData.text);
    return cellIndex === -1 ? bold : italic;
  },
}));

['multi', 'range'].forEach((selectionMode) => {
  test(`Calendar with ${selectionMode} selectionMode rendered correct`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Calendar with ${selectionMode} selectionMode.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxCalendar', {
    values: [new Date(2023, 0, 5), new Date(2023, 0, 17), new Date(2023, 1, 2)],
    selectionMode,
  }));
});
