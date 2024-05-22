import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Scheduler: Layout Customization: Cell Sizes CSS classes`
  .page(url(__dirname, '../../../container.html'));

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
].forEach(({ views, expect, crossScrollingEnabled }) => {
  views.forEach((view) => {
    test.skip(
      `Cells should have correct sizes and css classes (view:${view}, crossScrolling:${crossScrollingEnabled})`,
      async (t) => {
        const scheduler = new Scheduler(SELECTOR);

        const cell = scheduler.getDateTableCell(0, 0);
        const { width, height } = await cell.boundingClientRect;
        const hasHorizontalClass = cell.hasClass(HORIZONTAL_SIZE_CLASSNAME);
        const hasVerticalClass = cell.hasClass(VERTICAL_SIZE_CLASSNAME);

        if (typeof expect.width === 'number') {
          await t.expect(width).eql(expect.width, 'Date table cell has incorrect width');
        }

        await t.expect(height).eql(expect.height, 'Date table cell has incorrect height');
        await t.expect(hasHorizontalClass).eql(expect.hasHorizontalClass, 'Cell should has horizontal css class');
        await t.expect(hasVerticalClass).eql(expect.hasVerticalClass, 'Cell should has vertical css class');
      },
    ).before(async () => {
      await insertStylesheetRulesToPage(CELL_SIZE_CSS);
      await createWidget('dxScheduler', {
        dataSource: [],
        currentView: view,
        currentDate: '2024-01-01',
        crossScrollingEnabled,
      });
    }).after(async () => {
      await removeStylesheetRulesFromPage();
    });
  });
});
