import SelectBox from 'devextreme-testcafe-models/selectBox';
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
    .click(viewSwitcher.getButton('Day').element)
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .click(viewSwitcher.getButton('Some week').element)
    .expect(scheduler.checkViewType('week'))
    .ok()
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
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

  await t
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter');

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
