import { expect, test } from '../../../../../fixtures';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { createWidget } from '../../../../../helpers/createWidget';
import { classMatcher } from '../../../../../models/internal/classMatcher';
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

test.describe('Scheduler: Layout Customization: Cell Sizes CSS classes', () => {
  [
    DAY_VIEW_CASE,
    DAY_VIEW_CROSS_SCROLLING_CASE,
    VERTICAL_VIEW_CASES,
    VERTICAL_VIEW_CROSS_SCROLLING_CASES,
    HORIZONTAL_VIEW_CASES,
    HORIZONTAL_VIEW_CROSS_SCROLLING_CASES,
  ].forEach(({ views, expect: expected, crossScrollingEnabled }) => {
    views.forEach((view) => {
      test(
        `Cells should have correct sizes and css classes (view:${view}, crossScrolling:${crossScrollingEnabled})`,
        async ({ page }) => {
          await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
          await createWidget(page, 'dxScheduler', {
            dataSource: [],
            currentView: view,
            currentDate: '2024-01-01',
            crossScrollingEnabled,
          });

          const scheduler = new Scheduler(page, SELECTOR);

          const cell = scheduler.getDateTableCell(0, 0);
          const getCellSize = () => cell.evaluate((element) => {
            const { width, height } = element.getBoundingClientRect();

            return { width, height };
          });

          if (typeof expected.width === 'number') {
            await expect.poll(async () => (await getCellSize()).width, { message: 'Date table cell has incorrect width' }).toBe(expected.width);
          }

          await expect.poll(async () => (await getCellSize()).height, { message: 'Date table cell has incorrect height' }).toBe(expected.height);

          const horizontalAssertion = expect(cell, 'Cell should has horizontal css class');
          const verticalAssertion = expect(cell, 'Cell should has vertical css class');

          await (expected.hasHorizontalClass ? horizontalAssertion : horizontalAssertion.not)
            .toHaveClass(classMatcher(HORIZONTAL_SIZE_CLASSNAME));
          await (expected.hasVerticalClass ? verticalAssertion : verticalAssertion.not)
            .toHaveClass(classMatcher(VERTICAL_SIZE_CLASSNAME));
        },
      );
    });
  });
});
