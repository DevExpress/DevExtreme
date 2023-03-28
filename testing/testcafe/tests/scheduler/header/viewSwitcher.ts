import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler header - View switcher`
  .page(url(__dirname, '../../container.html'));

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
