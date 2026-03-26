import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, setClassAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const STATE_HOVER_CLASS = 'dx-state-hover';
  const STATE_ACTIVE_CLASS = 'dx-state-active';
  const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
  const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
  const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
  const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
  const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
  const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

  const GESTURE_COVER_CLASS = 'dx-gesture-cover';

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

    await page.evaluate(() => {
      const $el = $('#container');
      const offset = $el.offset()!;
      $el.trigger($.Event('dxpointerdown', { pageX: offset.left, pointers: [{ pointerId: 1 }] }));
      $el.trigger($.Event('dxpointermove', { pageX: offset.left + 20, pointers: [{ pointerId: 1 }] }));
      $el.trigger($.Event('mouseup', { pointers: [{ pointerId: 1 }] }));
    });

    const gestureCover = page.locator(`.${GESTURE_COVER_CLASS}`);

    expect(await gestureCover.evaluate((el) => window.getComputedStyle(el).cursor)).toBe('auto');

    await page.evaluate(() => {
      const $el = $('#container');
      $el.trigger($.Event('dxswipestart', { pointers: [{ pointerId: 1 }] }));
    });

    expect(await gestureCover.evaluate((el) => window.getComputedStyle(el).cursor)).toBe('grabbing');

    await page.evaluate(() => {
      const $el = $('#container');
      $el.trigger($.Event('dxswipe', { offset: 0.4, pointers: [{ pointerId: 1 }] }));
    });

    expect(await gestureCover.evaluate((el) => window.getComputedStyle(el).cursor)).toBe('grabbing');

    await page.evaluate(() => {
      const $el = $('#container');
      $el.trigger($.Event('dxswipeend', { pointers: [{ pointerId: 1 }] }));
    });

    expect(await gestureCover.evaluate((el) => window.getComputedStyle(el).cursor)).toBe('auto');

    });

  test('Cells on month view should have hover state class after hover when zoomLevel has been changed from "year" to "month" by click on cell', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
    zoomLevel: 'year',
    value: new Date(2021, 9, 17),
  });

    await page.locator('#container .dx-calendar-views-wrapper .dx-widget').first()
      .locator("td[data-value='2021/10/01']").click();

    const targetCell = page.locator('#container .dx-calendar-views-wrapper .dx-widget').first()
      .locator("td[data-value='2021/10/19']");
    await targetCell.hover();
    await expect(targetCell).toHaveClass(new RegExp(STATE_HOVER_CLASS));

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
    await createWidget(page, 'dxCalendar', {
    value: new Date(2022, 0, 1),
    showWeekNumbers: true,
    cellTemplate(cellData, cellIndex) {
      const italic = $('<span>').css('font-style', 'italic')
        .text(cellData.text);
      const bold = $('<span>').css('font-weight', '900')
        .text(cellData.text);
      return cellIndex === -1 ? bold : italic;
    },
  });

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
    await createWidget(page, 'dxCalendar', {
      value: [new Date(2023, 0, 5), new Date(2023, 0, 17), new Date(2023, 1, 2)],
      selectionMode,
      showWeekNumbers: true,
      firstDayOfWeek: 1,
      disabledDates: ({ date }) => {
        const day = date.getDay();
        return day === 1 || day === 4 || day === 0;
      },
    });

      await page.locator('#container .dx-calendar-views-wrapper .dx-widget').first()
        .locator('.dx-calendar-week-number-cell').nth(3).click();

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

      await createWidget(page, 'dxCalendar', {
        value: new Date(2021, 9, 17),
        zoomLevel,
        _todayDate: () => new Date(2023, 9, 17),
      }, '#calendar');


      await testScreenshot(page, `Calendar ${zoomLevel} view.png`, { element: '#container' });

    });

    test(`Calendar ${zoomLevel} view rendered correct in RTL`, async ({ page }) => {

      await setStyleAttribute(page, '#container', 'width: 400px; height: 400px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', {
        value: new Date(2021, 9, 17),
        zoomLevel,
        rtlEnabled: true,
        _todayDate: () => new Date(2023, 9, 17),
      }, '#calendar');


      await testScreenshot(page, `Calendar ${zoomLevel} view in RTL mode.png`, { element: '#container' });

    });

    test(`Calendar ${zoomLevel} view with today button rendered correct`, async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1000 });

      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', {
        value: new Date(2021, 9, 17),
        width: 450,
        height: 450,
        zoomLevel,
        showTodayButton: true,
        _todayDate: () => new Date(2023, 9, 17),
      }, '#calendar');


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
      await page.setViewportSize({ width: 1200, height: 1000 });

      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', {
        currentDate: new Date(2021, 9, 15),
      }, '#calendar');


      const startCellDate = new Date(2021, 9, 3);

      const getDateSelector = (offset: number): string => {
        const d = new Date(startCellDate);
        d.setDate(d.getDate() + offset);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `#calendar .dx-calendar-views-wrapper .dx-widget td[data-value='${y}/${m}/${day}']`;
      };

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
          const cellSelector = getDateSelector(cellOffset);

          await setClassAttribute(page, cellSelector, cellClasses);

          const cellNumber = startCellDate.getDate() + cellOffset;
          const cellId = `cell-${cellNumber}`;
          await appendElementTo(page, '#container', 'div', cellId);

          await page.evaluate(({ id, num, classes }) => {
            $(`#${id}`).text(`${num} - ${classes}`);
          }, { id: cellId, num: cellNumber, classes: cellClasses });

          cellOffset += 1;
        }
      }

      await testScreenshot(page, `${testName}.png`, { element: '#container', maxDiffPixelRatio: 0.15 });

    });
  });

  ['year', 'decade', 'century'].forEach((zoomLevel) => {
    const testName = `Calendar ${zoomLevel} view cell styles`;

    test(testName, async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1000 });

      await setStyleAttribute(page, '#container', 'width: 600px; height: 800px;');
      await appendElementTo(page, '#container', 'div', 'calendar');

      await createWidget(page, 'dxCalendar', {
        currentDate: new Date(2021, 9, 17),
        zoomLevel,
        _todayDate: () => new Date(2023, 9, 17),
      }, '#calendar');


      const startCellDate = new Date(2021, 9, 3);

      let cellOffset = 0;

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
        const cellIndex = cellOffset;

        await page.evaluate(({ idx, classes }) => {
          const cell = $('#calendar .dx-calendar-views-wrapper .dx-widget .dx-calendar-cell').eq(idx);
          cell.attr('class', classes);
        }, { idx: cellIndex, classes: cellClasses });

        const cellNumber = startCellDate.getDate() + cellOffset;
        const cellId = `cell-${cellNumber}`;
        await appendElementTo(page, '#container', 'div', cellId);

        await page.evaluate(({ id, num, classes }) => {
          $(`#${id}`).text(`${num} - ${classes}`);
        }, { id: cellId, num: cellNumber, classes: cellClasses });

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
