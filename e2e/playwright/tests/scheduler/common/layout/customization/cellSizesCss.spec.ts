import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { hasClass } from '../../../../../models/internal/hasClass';
import Scheduler from '../../../../../models/scheduler';

const SELECTOR = '#container';

const HORIZONTAL_SIZE_CLASSNAME = 'dx-scheduler-cell-sizes-horizontal';
const VERTICAL_SIZE_CLASSNAME = 'dx-scheduler-cell-sizes-vertical';
const CELL_SIZE_CSS = `
#container .${HORIZONTAL_SIZE_CLASSNAME} {
  width: 300px;
}

#container .${VERTICAL_SIZE_CLASSNAME} {
  height: 300px;
}
`;

const DAY_VIEW_CASE = {
  views: ['day'],
  crossScrollingEnabled: false,
  expect: {
    width: 'skipCheck',
    height: 300,
    hasHorizontalClass: false,
    hasVerticalClass: true,
  },
};

const DAY_VIEW_CROSS_SCROLLING_CASE = {
  views: ['day'],
  crossScrollingEnabled: true,
  expect: {
    width: 'skipCheck',
    height: 300,
    hasHorizontalClass: true,
    hasVerticalClass: true,
  },
};

const VERTICAL_VIEW_CASES = {
  views: ['week', 'workWeek', 'month'],
  crossScrollingEnabled: false,
  expect: {
    width: 'skipCheck',
    height: 300,
    hasHorizontalClass: false,
    hasVerticalClass: true,
  },
};

const VERTICAL_VIEW_CROSS_SCROLLING_CASES = {
  views: ['week', 'workWeek', 'month'],
  crossScrollingEnabled: true,
  expect: {
    width: 300,
    height: 300,
    hasHorizontalClass: true,
    hasVerticalClass: true,
  },
};

const HORIZONTAL_VIEW_CASES = {
  views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
  crossScrollingEnabled: false,
  expect: {
    width: 300,
    height: 300,
    hasHorizontalClass: true,
    hasVerticalClass: true,
  },
};

const HORIZONTAL_VIEW_CROSS_SCROLLING_CASES = {
  views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
  crossScrollingEnabled: true,
  expect: {
    width: 300,
    height: 300,
    hasHorizontalClass: true,
    hasVerticalClass: true,
  },
};

[
  DAY_VIEW_CASE,
  DAY_VIEW_CROSS_SCROLLING_CASE,
  VERTICAL_VIEW_CASES,
  VERTICAL_VIEW_CROSS_SCROLLING_CASES,
  HORIZONTAL_VIEW_CASES,
  HORIZONTAL_VIEW_CROSS_SCROLLING_CASES,
].forEach(({ views, expect: expected, crossScrollingEnabled }) => {
  views.forEach((view) => {
    test(`Cells should have correct sizes and css classes (view:${view}, crossScrolling:${crossScrollingEnabled})`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
      await createWidget(page, 'dxScheduler', {
        dataSource: [],
        currentView: view,
        currentDate: '2024-01-01',
        crossScrollingEnabled,
      });

      const scheduler = new Scheduler(page, SELECTOR);

      const cell = scheduler.getDateTableCell(0, 0);
      const box = await cell.boundingBox();

      if (typeof expected.width === 'number') {
        expect(box?.width, 'Date table cell has incorrect width').toBe(expected.width);
      }

      expect(box?.height, 'Date table cell has incorrect height').toBe(expected.height);
      expect(
        await hasClass(cell, HORIZONTAL_SIZE_CLASSNAME),
        'Cell should has horizontal css class',
      ).toBe(expected.hasHorizontalClass);
      expect(
        await hasClass(cell, VERTICAL_SIZE_CLASSNAME),
        'Cell should has vertical css class',
      ).toBe(expected.hasVerticalClass);
    });
  });
});
