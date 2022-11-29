import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { takeScreenshotInTheme } from '../../../helpers/getPostfix';

fixture`Calendar`
  .page(url(__dirname, '../../container.html'));

test('Calendar with showWeekNumbers rendered correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Calendar with showWeekNumbers.png', '#container', true);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('01.01.2022'),
    showWeekNumbers: true,
  });
});

test('Calendar with showWeekNumbers rendered correct for last week of year value', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Calendar with showWeekNumbers last week.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('12.31.2021'),
    showWeekNumbers: true,
    weekNumberRule: 'firstDay',
  });
});

test('Calendar with showWeekNumbers rendered correct with rtlEnabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Calendar with showWeekNumbers rtl=true.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('01.01.2022'),
    showWeekNumbers: true,
    rtlEnabled: true,
  });
});

test('Calendar with showWeekNumbers rendered correct with cellTemplate', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Calendar with showWeekNumbers and cell template.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCalendar', {
    value: new Date('01.01.2022'),
    showWeekNumbers: true,
    cellTemplate(cellData, cellIndex) {
      const italic = $('<span>').css('font-style', 'italic')
        .text(cellData.text);
      const bold = $('<span>').css('font-weight', '900')
        .text(cellData.text);
      return cellIndex === -1 ? bold : italic;
    },
  });
});
