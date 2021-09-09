import { Selector } from 'testcafe';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Scheduler: Adaptive material theme layout`
  .page(url(__dirname, '../../containerMaterial.html'))
  .afterEach(async (t) => {
    await t.wait(200);
    await disposeWidgets();
  });

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
