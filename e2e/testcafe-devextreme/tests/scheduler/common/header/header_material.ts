import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler header: material theme`
  .page(url(__dirname, '../../../container.html'));

// visual: material.blue.light
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
  views: ['day', 'week'],
  height: 580,
}));

// visual: material.blue.light
test.skip('The toolbar should not display if the config is empty', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await testScreenshot(t, takeScreenshot, 'scheduler-with-empty-toolbar-config.png');

  await scheduler.option('toolbar', { items: ['viewSwitcher'] });

  await testScreenshot(t, takeScreenshot, 'scheduler-with-non-empty-toolbar-config.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2020, 2, 2),
  currentView: 'day',
  views: ['day', 'week'],
  height: 580,
  toolbar: { items: [] },
}));
