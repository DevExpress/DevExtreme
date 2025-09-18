import SelectBox from 'devextreme-testcafe-models/selectBox';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler header - View switcher`
  .page(url(__dirname, '../../../container.html'));

test('it should correctly switch a differently typed views (T1080992)', async (t) => {
  const scheduler = new Scheduler('#container');
  const {
    toolbar: {
      viewSwitcher,
    },
  } = scheduler;

  await t
    .click(viewSwitcher.getButton('Some week').element)
    .expect(scheduler.checkViewType('week'))
    .ok()
    .click(viewSwitcher.getButton('Day').element)
    .expect(scheduler.checkViewType('day'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  width: 800,
  height: 600,
  views: [
    'day',
    {
      type: 'week',
      name: 'Some week',
    },
  ],
}));

const defaultSelectBoxValue = 'Samantha Bright';

test('Changing view does not reset toolbar items state', async (t) => {
  const scheduler = new Scheduler('#container');
  const selectBox = new SelectBox('.dx-selectbox');

  await selectBox.open();
  const list = await selectBox.getList();
  await t
    .click(list.getItem(0).element)
    .expect(selectBox.value)
    .eql(defaultSelectBoxValue);

  await t.click(scheduler.toolbar.viewSwitcher.getButton('Month').element)
    .expect(scheduler.checkViewType('month'))
    .ok();

  await t.expect(selectBox.value).eql(defaultSelectBoxValue);
}).before(async () => createWidget('dxScheduler', {
  views: ['week', 'month'],
  currentView: 'week',
  currentDate: new Date(2021, 3, 27),
  toolbar: {
    items: [
      {
        location: 'before',
        widget: 'dxSelectBox',
        options: { items: [defaultSelectBoxValue] },
      },
      'viewSwitcher',
    ],
  },
}));

[true, false].forEach((useDropDownViewSwitcher) => {
  test(`view switcher should not be displayed if views has only one element when useDropDownViewSwitcher: ${useDropDownViewSwitcher}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const { toolbar } = new Scheduler('#container');

    await t
      .expect(await takeScreenshot(`toolbar-without-view-switcher-(useDropDownViewSwitcher=${useDropDownViewSwitcher}).png`, toolbar.element))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    currentDate: new Date(2020, 2, 2),
    currentView: 'day',
    views: ['day'],
    useDropDownViewSwitcher,
    height: 580,
  }));
});
