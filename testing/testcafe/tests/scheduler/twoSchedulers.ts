import { ClientFunction } from 'testcafe';
import createWidget from '../../helpers/createWidget';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import Scheduler from '../../model/scheduler';
import url from '../../helpers/getPageUrl';

fixture`Interaction of two schedulers`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (container): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentDate: new Date(2022, 3, 5),
    height: 600,
    views: ['day'],
    currentView: 'day',
  }, true, container);
};

const dispose = ClientFunction((container) => {
  ($(container) as any).dxScheduler('dispose');
});

safeSizeTest('First scheduler should work after removing second (T1063130)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { navigator } = scheduler.toolbar;

  await dispose('#otherContainer');

  await t
    .click(navigator.nextButton)
    .expect(navigator.caption.textContent).eql('6 April 2022');
}).before(async () => {
  await createScheduler('#container');
  await createScheduler('#otherContainer');
});
