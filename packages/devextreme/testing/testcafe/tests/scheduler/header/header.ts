import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Scheduler header`
  .page(url(__dirname, '../../container.html'));

test('dateNavigator buttons should not be selected after clicking', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .click(toolbar.navigator.nextButton)

    .expect(toolbar.navigator.prevButton.hasClass('dx-item-selected'))
    .notOk()

    .expect(toolbar.navigator.caption.hasClass('dx-item-selected'))
    .notOk()

    .expect(toolbar.navigator.nextButton.hasClass('dx-item-selected'))
    .notOk();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

test('dateNavigator buttons should have "contained" styling mode with generic theme', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(toolbar.navigator.caption.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(toolbar.navigator.nextButton.hasClass('dx-button-mode-contained'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));
