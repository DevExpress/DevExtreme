import createWidget from '../../helpers/createWidget';
import Scheduler from '../../model/scheduler';
import { extend } from '../../../../js/core/utils/extend';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: Navigator`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (options = {}): Promise<void> => {
  await createWidget('dxScheduler', extend(options, {
    dataSource: [],
    currentDate: new Date(2017, 4, 18),
    firstDayOfWeek: 1,
    height: 600,
    views: ['week', 'month'],
  }));
};

test('Navigator can change week when current date interval is more than diff between current date and `max` (T830754)', async (t) => {
  const { toolbar } = new Scheduler('#container');

  // Navigation `next` must be enabled at default

  await t
    .expect(toolbar.navigator.nextButton.hasClass('dx-state-disabled')).notOk();

  // Navigation `next` must be disabled after change 1 week earlier

  await t
    .click(toolbar.navigator.nextButton)
    .expect(toolbar.navigator.nextButton.hasClass('dx-state-disabled')).ok();
}).before(async () => createScheduler({
  max: new Date(2017, 4, 24),
  currentView: 'week',
}));

test('Navigator can change week when current date interval is more than diff between current date and `min` (T830754)', async (t) => {
  const { toolbar } = new Scheduler('#container');

  // Navigation `prev` must be enabled at default

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-state-disabled')).notOk();

  // Navigation `prev` must be disabled after change 1 week later

  await t
    .click(toolbar.navigator.prevButton)
    .expect(toolbar.navigator.prevButton.hasClass('dx-state-disabled')).ok();
}).before(async () => createScheduler({
  min: new Date(2017, 4, 13),
  currentView: 'week',
}));

test('Navigator can change month when current date interval is more than diff between current date and `max` (T830754)', async (t) => {
  const { toolbar } = new Scheduler('#container');

  // Navigation `next` must be enabled at default

  await t
    .expect(toolbar.navigator.nextButton.hasClass('dx-state-disabled')).notOk();

  // Navigation `next` must be disabled after change 1 week earlier

  await t
    .click(toolbar.navigator.nextButton)
    .expect(toolbar.navigator.nextButton.hasClass('dx-state-disabled')).ok();
}).before(async () => createScheduler({
  max: new Date(2017, 5, 15),
  currentView: 'month',
}));

test('Navigator can change month when current date interval is more than diff between current date and `min` (T830754)', async (t) => {
  const { toolbar } = new Scheduler('#container');

  // Navigation `prev` must be enabled at default

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-state-disabled')).notOk();

  // Navigation `prev` must be disabled after change 1 week later

  await t
    .click(toolbar.navigator.prevButton)
    .expect(toolbar.navigator.prevButton.hasClass('dx-state-disabled')).ok();
}).before(async () => createScheduler({
  min: new Date(2017, 3, 28),
  currentView: 'month',
}));
