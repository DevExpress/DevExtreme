import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import Calendar from '../../../model/calendar';
import { appendElementTo, setClassAttribute, setStyleAttribute } from '../../../helpers/domUtils';

const STATE_HOVER_CLASS = 'dx-state-hover';
const STATE_ACTIVE_CLASS = 'dx-state-active';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

fixture.disablePageReloads`Calendar`
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

test('Calendar with multiview rendered correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with multiview.png', { element: '#container', shouldTestInCompact: true });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  values: [new Date(2023, 0, 5), new Date(2023, 1, 14)],
  selectionMode: 'range',
  viewsCount: 2,
}));

['month', 'year', 'decade', 'century'].forEach((zoomLevel) => {
  test(`Calendar ${zoomLevel} view rendered correct`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Calendar ${zoomLevel} view.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 800px;');
    await appendElementTo('#container', 'div', 'calendar');

    return createWidget('dxCalendar', {
      value: new Date(2021, 9, 17),
    }, '#calendar');
  });

  test(`Calendar ${zoomLevel} view with today button rendered correct`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Calendar ${zoomLevel} view with today button.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 800px;');
    await appendElementTo('#container', 'div', 'calendar');

    return createWidget('dxCalendar', {
      value: new Date(2021, 9, 17),
      width: 450,
      height: 450,
      showTodayButton: true,
    }, '#calendar');
  });
});

test('Calendar with disabled dates rendered correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Calendar with disabled dates.png', { element: '#container', shouldTestInCompact: true });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2021, 9, 17),
  showTodayButton: true,
  showWeekNumbers: true,
  min: new Date(2021, 9, 10),
  disabledDates: [new Date(2021, 9, 18)],
}));

[CALENDAR_CELL_CLASS, CALENDAR_TODAY_CLASS].forEach((cellClass) => {
  const testName = `Calendar ${cellClass === CALENDAR_TODAY_CLASS ? 'today ' : ''}cell styles`;

  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const calendar = new Calendar('#calendar');

    const startCellDate = new Date(2021, 9, 3);
    const view = calendar.getView();

    let cellOffset = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const cellTypeClass of [
      cellClass,
      `${cellClass} ${CALENDAR_OTHER_VIEW_CLASS}`,
      `${cellClass} ${CALENDAR_OTHER_VIEW_CLASS} ${CALENDAR_SELECTED_DATE_CLASS}`,
      `${cellClass} ${CALENDAR_OTHER_VIEW_CLASS} ${CALENDAR_EMPTY_CELL_CLASS}`,
      `${cellClass} ${CALENDAR_EMPTY_CELL_CLASS}`,
      `${cellClass} ${CALENDAR_EMPTY_CELL_CLASS} ${CALENDAR_SELECTED_DATE_CLASS}`,
      `${cellClass} ${CALENDAR_CONTOURED_DATE_CLASS}`,
      `${cellClass} ${CALENDAR_CONTOURED_DATE_CLASS} ${CALENDAR_SELECTED_DATE_CLASS}`,
      `${cellClass} ${CALENDAR_SELECTED_DATE_CLASS}`,
    ]) {
      // eslint-disable-next-line no-restricted-syntax
      for (const stateClass of [
        '',
        STATE_HOVER_CLASS,
        STATE_ACTIVE_CLASS,
      ]) {
        const cellClasses = `${cellTypeClass} ${stateClass}`;

        await setClassAttribute(view.getCellByOffset(startCellDate, cellOffset), cellClasses);

        const cellNumber = startCellDate.getDate() + cellOffset;
        const cellId = `cell-${cellNumber}`;
        await appendElementTo('#container', 'div', cellId);

        await ClientFunction(() => {
          $(`#${cellId}`).text(`${cellNumber} - ${cellClasses}`);
        }, {
          dependencies: {
            cellNumber, cellId, cellClasses,
          },
        })();

        cellOffset += 1;
      }
    }

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 800px;');
    await appendElementTo('#container', 'div', 'calendar');

    return createWidget('dxCalendar', {
      currentDate: new Date(2021, 9, 15),
    }, '#calendar');
  });
});

['year', 'decade', 'century'].forEach((zoomLevel) => {
  const testName = `Calendar ${zoomLevel} view cell styles`;

  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const calendar = new Calendar('#calendar');

    const startCellDate = new Date(2021, 9, 3);
    const view = calendar.getView();

    let cellOffset = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const cellTypeClass of [
      STATE_HOVER_CLASS,
      STATE_ACTIVE_CLASS,
      CALENDAR_TODAY_CLASS,
      CALENDAR_OTHER_VIEW_CLASS,
      CALENDAR_EMPTY_CELL_CLASS,
      CALENDAR_CONTOURED_DATE_CLASS,
      CALENDAR_SELECTED_DATE_CLASS,
      `${CALENDAR_CONTOURED_DATE_CLASS} ${CALENDAR_SELECTED_DATE_CLASS}`,
    ]) {
      const cellClasses = `${cellTypeClass}`;

      await setClassAttribute(view.getCellByIndex(cellOffset), cellClasses);

      const cellNumber = startCellDate.getDate() + cellOffset;
      const cellId = `cell-${cellNumber}`;
      await appendElementTo('#container', 'div', cellId);

      await ClientFunction(() => {
        $(`#${cellId}`).text(`${cellNumber} - ${cellClasses}`);
      }, {
        dependencies: {
          cellNumber, cellId, cellClasses,
        },
      })();

      cellOffset += 1;
    }

    await t.debug();
    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 800px;');
    await appendElementTo('#container', 'div', 'calendar');

    return createWidget('dxCalendar', {
      currentDate: new Date(2021, 9, 17),
      zoomLevel,
    }, '#calendar');
  });
});
