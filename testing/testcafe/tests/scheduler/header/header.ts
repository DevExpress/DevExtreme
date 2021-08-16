import { Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Hotkeys for appointments update and navigation`
  .page(url(__dirname, '../../container.html'));

test('dateNavigator buttons should not be selected after clicking', async (t) => {
  const scheduler = new Scheduler('#container');
  const toolbar = scheduler.getToolbar();
  const navigator = toolbar.getNavigator();

  await t
    .click(navigator.nextDuration)

    .expect(navigator.prevDuration.hasClass('dx-item-selected'))
    .notOk()

    .expect(navigator.prevDuration.hasClass('dx-item-selected'))
    .notOk()

    .expect(navigator.prevDuration.hasClass('dx-item-selected'))
    .notOk();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

test('dateNavigator buttons should have "contained" styling mode with generic theme', async (t) => {
  const scheduler = new Scheduler('#container');
  const toolbar = scheduler.getToolbar();
  const navigator = toolbar.getNavigator();

  await t
    .expect(navigator.prevDuration.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(navigator.prevDuration.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(navigator.prevDuration.hasClass('dx-button-mode-contained'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

fixture`Scheduler: Adaptive material theme layout`
  .page(url(__dirname, '../../containerMaterial.html'));

test('dateNavigator buttons should have "text" styling mode with material theme', async (t) => {
  const scheduler = new Scheduler('#container');
  const toolbar = scheduler.getToolbar();
  const navigator = toolbar.getNavigator();

  await t
    .expect(navigator.prevDuration.hasClass('dx-button-mode-text'))
    .ok()

    .expect(navigator.prevDuration.hasClass('dx-button-mode-text'))
    .ok()

    .expect(navigator.prevDuration.hasClass('dx-button-mode-text'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

test('viewSwitcher dropdown button popup should have a specified class', async (t) => {
  const scheduler = new Scheduler('#container');
  const toolbar = scheduler.getToolbar();
  const viewSwitcher = toolbar.getViewSwitcher();
  const dropDownButton = viewSwitcher.getDropDownButton();

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
