import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Calendar from '../../../models/calendar';
import { expectClass } from '../../../models/internal/classMatcher';

const STATE_HOVER_CLASS = 'dx-state-hover';
const STATE_ACTIVE_CLASS = 'dx-state-active';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const GESTURE_COVER_CLASS = 'dx-gesture-cover';

const addCellClasses = async (cell: Locator, classes: string): Promise<void> => cell.evaluate(
  (element, value) => {
    element.setAttribute('class', `${element.getAttribute('class') ?? ''} ${value}`);
  },
  classes,
);

const addCellCaption = async (
  page: Page,
  cellNumber: number,
  cellClasses: string,
): Promise<void> => {
  const cellId = `cell-${cellNumber}`;

  await appendElementTo(page, '#container', 'div', cellId);
  await page.evaluate(({ id, text }) => {
    $(`#${id}`).text(text);
  }, { id: cellId, text: `${cellNumber} - ${cellClasses}` });
};

test.describe('Calendar', () => {
  test('Caption button text should be ellipsis when width is limit', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      width: 150,
      value: new Date(2021, 9, 17),
    });

    await testScreenshot(page, 'Calendar with limit width.png', { element: '#container' });
  });

  test('Grabbing cursor should be shown during swipe', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2021, 9, 17),
    });

    const calendar = new Calendar(page, '#container');

    await calendar.showGestureCover();

    const gestureCover = page.locator(`.${GESTURE_COVER_CLASS}`);

    await expect(gestureCover).toHaveCSS('cursor', 'auto');

    await calendar.swipeStart();

    await expect(gestureCover).toHaveCSS('cursor', 'grabbing');

    await calendar.swipe(0.4);

    await expect(gestureCover).toHaveCSS('cursor', 'grabbing');

    await calendar.swipeEnd();

    await expect(gestureCover).toHaveCSS('cursor', 'auto');
  });

  test('Cells on month view should have hover state class after hover when zoomLevel has been changed from "year" to "month" by click on cell', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      zoomLevel: 'year',
      value: new Date(2021, 9, 17),
    });

    const calendar = new Calendar(page, '#container');

    await calendar.getView().getMonthCellByDate(new Date(2021, 9, 17)).click();

    const targetCell = calendar.getView().getCellByDate(new Date(2021, 9, 19));

    await targetCell.hover();
    await expectClass(targetCell, STATE_HOVER_CLASS);
  });

  test('Calendar with showWeekNumbers rendered correct', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2022, 0, 1),
      showWeekNumbers: true,
    });

    await testScreenshot(page, 'Calendar with showWeekNumbers.png', { element: '#container' });
  });

  test('Calendar with showWeekNumbers rendered correct for last week of year value', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2021, 11, 31),
      showWeekNumbers: true,
      weekNumberRule: 'firstDay',
    });

    await testScreenshot(page, 'Calendar with showWeekNumbers last week.png', { element: '#container' });
  });

  test('Calendar with showWeekNumbers rendered correct with rtlEnabled', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2022, 0, 1),
      showWeekNumbers: true,
      rtlEnabled: true,
    });

    await testScreenshot(page, 'Calendar with showWeekNumbers rtl=true.png', { element: '#container' });
  });

  test('Calendar with showWeekNumbers rendered correct with cellTemplate', async ({ page }) => {
    await createWidget(page, 'dxCalendar', () => ({
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

    await testScreenshot(page, 'Calendar with showWeekNumbers and cell template.png', { element: '#container' });
  });

  ['multiple', 'range'].forEach((selectionMode) => {
    test(`Calendar with ${selectionMode} selectionMode rendered correct`, async ({ page }) => {
      await createWidget(page, 'dxCalendar', {
        value: [new Date(2023, 0, 5), new Date(2023, 0, 17), new Date(2023, 1, 2)],
        selectionMode,
      });

      await testScreenshot(page, `Calendar with ${selectionMode} selectionMode.png`, { element: '#container' });
    });

    test(`Week cell click selection (selectionMode=${selectionMode})`, async ({ page }) => {
      await createWidget(page, 'dxCalendar', (mode) => ({
        value: [new Date(2023, 0, 5), new Date(2023, 0, 17), new Date(2023, 1, 2)],
        selectionMode: mode,
        showWeekNumbers: true,
        firstDayOfWeek: 1,
        disabledDates: ({ date }) => {
          const day = date.getDay();

          return day === 1 || day === 4 || day === 0;
        },
      }), '#container', { arg: selectionMode });

      const calendar = new Calendar(page, '#container');

      await calendar.getView().getWeekNumberCellByIndex(3).click();

      await testScreenshot(page, `Week cell click selection (selectionMode=${selectionMode}).png`, { element: '#container' });
    });
  });

  test('Calendar with multiview rendered correct', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: [new Date(2023, 0, 5), new Date(2023, 1, 14)],
      selectionMode: 'range',
      viewsCount: 2,
    });

    await testScreenshot(page, 'Calendar with multiview.png', { element: '#container' });
  });

  ['month', 'year', 'decade', 'century'].forEach((zoomLevel) => {
    test(`Calendar ${zoomLevel} view rendered correct`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'width: 400px; height: 400px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', (level) => ({
        value: new Date(2021, 9, 17),
        zoomLevel: level,
        _todayDate: () => new Date(2023, 9, 17),
      }), '#calendar', { arg: zoomLevel });

      await testScreenshot(page, `Calendar ${zoomLevel} view.png`, { element: '#container' });
    });

    test(`Calendar ${zoomLevel} view rendered correct in RTL`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'width: 400px; height: 400px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', (level) => ({
        value: new Date(2021, 9, 17),
        zoomLevel: level,
        rtlEnabled: true,
        _todayDate: () => new Date(2023, 9, 17),
      }), '#calendar', { arg: zoomLevel });

      await testScreenshot(page, `Calendar ${zoomLevel} view in RTL mode.png`, { element: '#container' });
    });

    test(`Calendar ${zoomLevel} view with today button rendered correct`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', (level) => ({
        value: new Date(2021, 9, 17),
        width: 450,
        height: 450,
        zoomLevel: level,
        showTodayButton: true,
        _todayDate: () => new Date(2023, 9, 17),
      }), '#calendar', { arg: zoomLevel });

      await testScreenshot(page, `Calendar ${zoomLevel} view with today button.png`, { element: '#container' });
    });
  });

  test('Calendar with disabled dates rendered correct', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2021, 9, 17),
      showTodayButton: true,
      showWeekNumbers: true,
      min: new Date(2021, 9, 10),
      disabledDates: [new Date(2021, 9, 18)],
    });

    await testScreenshot(page, 'Calendar with disabled dates.png', { element: '#container' });
  });

  [CALENDAR_CELL_CLASS, CALENDAR_TODAY_CLASS].forEach((cellClass) => {
    const testName = `Calendar ${cellClass === CALENDAR_TODAY_CLASS ? 'today ' : ''}cell styles`;

    test(testName, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', {
        currentDate: new Date(2021, 9, 15),
      }, '#calendar');

      const calendar = new Calendar(page, '#calendar');

      const startCellDate = new Date(2021, 9, 3);
      const view = calendar.getView();

      let cellOffset = 0;

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
        for (const stateClass of [
          '',
          STATE_HOVER_CLASS,
          STATE_ACTIVE_CLASS,
        ]) {
          const cellClasses = `${cellTypeClass} ${stateClass}`;

          await addCellClasses(view.getCellByOffset(startCellDate, cellOffset), cellClasses);
          await addCellCaption(page, startCellDate.getDate() + cellOffset, cellClasses);

          cellOffset += 1;
        }
      }

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  ['year', 'decade', 'century'].forEach((zoomLevel) => {
    const testName = `Calendar ${zoomLevel} view cell styles`;

    test(testName, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', (level) => ({
        currentDate: new Date(2021, 9, 17),
        zoomLevel: level,
        _todayDate: () => new Date(2023, 9, 17),
      }), '#calendar', { arg: zoomLevel });

      const calendar = new Calendar(page, '#calendar');

      const startCellDate = new Date(2021, 9, 3);
      const view = calendar.getView();

      let cellOffset = 0;

      for (const cellClasses of [
        STATE_HOVER_CLASS,
        STATE_ACTIVE_CLASS,
        CALENDAR_TODAY_CLASS,
        CALENDAR_OTHER_VIEW_CLASS,
        CALENDAR_EMPTY_CELL_CLASS,
        CALENDAR_CONTOURED_DATE_CLASS,
        CALENDAR_SELECTED_DATE_CLASS,
        `${CALENDAR_CONTOURED_DATE_CLASS} ${CALENDAR_SELECTED_DATE_CLASS}`,
      ]) {
        await addCellClasses(view.getCellByIndex(cellOffset), cellClasses);
        await addCellCaption(page, startCellDate.getDate() + cellOffset, cellClasses);

        cellOffset += 1;
      }

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });

    test(`Calendar with range selectionMode rendered correct (maxZoomLevel=${zoomLevel})`, async ({ page }) => {
      await createWidget(page, 'dxCalendar', {
        value: [new Date(1023, 0, 5), new Date(1023, 0, 17), new Date(1099, 1, 2)],
        selectionMode: 'range',
        maxZoomLevel: zoomLevel,
      });

      await testScreenshot(page, `Calendar with range selection (maxZoomLevel=${zoomLevel}).png`, { element: '#container' });
    });
  });
});
