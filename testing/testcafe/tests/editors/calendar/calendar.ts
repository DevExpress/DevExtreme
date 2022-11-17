import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { getThemePostfix } from '../../../helpers/getPostfix';
import createWidget from '../../../helpers/createWidget';

fixture`Calendar`
  .page(url(__dirname, '../../container.html'));

test('Calendar with showWeekNumbers rendered correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`calendar-with-showWeekNumbers${getThemePostfix()}.png`, '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date('01.01.2022'),
  showWeekNumbers: true,
}));

// const themes = ['generic.light.compact', 'material.blue.light.compact'];
// themes.forEach((theme) => {
//   test(`Calendar with showWeekNumbers rendered correct (${theme})`, async (t) => {
//     const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//     await t
// eslint-disable-next-line max-len
//       .expect(await takeScreenshot(`calendar-with-showWeekNumbers${getThemePostfix(theme)}.png`, '#container'))
//       .ok()
//       .expect(compareResults.isValid())
//       .ok(compareResults.errorMessages());
//   }).before(async () => {
//     await changeTheme(theme);

//     await createWidget('dxCalendar', {
//       value: new Date('01.01.2022'),
//       showWeekNumbers: true,
//     });
//   });
// });

test('Calendar with showWeekNumbers rendered correct for last week of year value', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`calendar-with-showWeekNumbers-last-week${getThemePostfix()}.png`, '#container'))
    .ok()
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

  await t
    .expect(await takeScreenshot(`calendar-with-showWeekNumbers-rtl-enabled${getThemePostfix()}.png`, '#container'))
    .ok()
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

  await t
    .expect(await takeScreenshot(`calendar-with-showWeekNumbers-and-cell-template${getThemePostfix()}.png`, '#container'))
    .ok()
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
