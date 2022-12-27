import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// TODO resolve material theme container
fixture.skip('Scheduler: Adaptive material theme layout');

test('dateNavigator buttons should have "text" styling mode with material theme', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-button-mode-text'))
    .ok()

    .expect(toolbar.navigator.caption.hasClass('dx-button-mode-text'))
    .ok()

    .expect(toolbar.navigator.nextButton.hasClass('dx-button-mode-text'))
    .ok();
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    currentView: 'day',
    views: ['day'],
    height: 580,
  },
));

test('viewSwitcher dropdown button popup should have a specified class', async (t) => {
  const { toolbar } = new Scheduler('#container');
  const dropDownButton = toolbar.viewSwitcher.getDropDownButton();

  const viewSwitcherDropDownButtonContent = '.dx-scheduler-view-switcher-dropdown-button-content';

  await t
    .click(dropDownButton.element)

    .expect(Selector(viewSwitcherDropDownButtonContent).count)
    .eql(1);
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    currentView: 'day',
    views: ['day'],
    height: 580,
  },
));

test('The toolbar should not display if the config is empty', async (t, { platform, screenshotComparerOptions }) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('scheduler-with-empty-toolbar-config.png', undefined, screenshotComparerOptions))
    .ok();

  await updateComponentOptions(platform, { toolbar: [{ defaultElement: 'viewSwitcher' }] });

  await t
    .expect(await takeScreenshot('scheduler-with-non-empty-toolbar-config.png', undefined, screenshotComparerOptions))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    currentDate: new Date(2020, 2, 2),
    currentView: 'day',
    views: ['day'],
    height: 580,
    toolbar: [],
  },
  true,
));
