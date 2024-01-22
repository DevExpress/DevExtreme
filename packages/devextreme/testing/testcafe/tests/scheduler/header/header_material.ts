import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`Scheduler header: material theme`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
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
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    currentView: 'day',
    views: ['day'],
    height: 580,
  });
});

test('viewSwitcher dropdown button popup should have a specified class', async (t) => {
  const { toolbar } = new Scheduler('#container');
  const dropDownButton = toolbar.viewSwitcher.getDropDownButton();

  const viewSwitcherDropDownButtonContent = '.dx-scheduler-view-switcher-dropdown-button-content';

  await t
    .click(dropDownButton.element)

    .expect(Selector(viewSwitcherDropDownButtonContent).count)
    .eql(1);
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    currentView: 'day',
    views: ['day', 'week'],
    height: 580,
  });
});

test('The toolbar should not display if the config is empty', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await t
    .expect(await takeScreenshot('scheduler-with-empty-toolbar-config.png'))
    .ok();

  await scheduler.option('toolbar', [{ defaultElement: 'viewSwitcher' }]);

  await t
    .expect(await takeScreenshot('scheduler-with-non-empty-toolbar-config.png'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    currentDate: new Date(2020, 2, 2),
    currentView: 'day',
    views: ['day'],
    height: 580,
    toolbar: [],
  });
});

test('The viewSwitcher should not drop down if only one view', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const { toolbar } = new Scheduler('#container');
  const dropDownButton = toolbar.viewSwitcher.getDropDownButton();

  await t
    .click(dropDownButton.element)

    .expect(await takeScreenshot('drop-down-with-one-view.png', toolbar.element))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    currentDate: new Date(2020, 2, 2),
    currentView: 'day',
    views: ['day'],
    useDropDownViewSwitcher: true,
    height: 580,
  });
});
