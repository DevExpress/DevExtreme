import { ClientFunction } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler: Material theme layout`
  .page(url(__dirname, './material.html'));

const disableAnimation = ClientFunction(() => {
  (window as any).DevExpress.fx.off = true;
});

const createScheduler = async (options = {}) => {
  await disableAnimation();
  await createWidget('dxScheduler', options);
};

test('Scheduler should have correct height in month view (T927862)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect((await scheduler.dateTable.boundingClientRect).bottom)
    .eql((await scheduler.workspaceScrollable.boundingClientRect).bottom);
}).before(() => createScheduler({
  dataSource: [],
  views: ['month'],
  currentView: 'month',
  height: 800,
}));
