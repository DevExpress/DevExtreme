import { Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Hotkeys for appointments update and navigation`
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

fixture`Scheduler: Adaptive material theme layout`
  .page(url(__dirname, '../../containerMaterial.html'));

test('dateNavigator buttons should have "text" styling mode with material theme', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-button-mode-text'))
    .ok()

    .expect(toolbar.navigator.caption.hasClass('dx-button-mode-text'))
    .ok()

    .expect(toolbar.navigator.nextButton.hasClass('dx-button-mode-text'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

test('viewSwitcher dropdown button popup should have a specified class', async (t) => {
  const { toolbar } = new Scheduler('#container');
  const dropDownButton = toolbar.viewSwitcher.getDropDownButton();

  const viewSwitcherDropDownButtonContent = '.dx-scheduler-view-switcher-dropdown-button-content';

  await t
    .click(dropDownButton.element)

    .expect(Selector(viewSwitcherDropDownButtonContent).count)
    .eql(1);
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));
