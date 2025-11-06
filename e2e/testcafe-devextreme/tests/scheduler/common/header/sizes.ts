import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { changeTheme } from '../../../../helpers/changeTheme';

fixture`Scheduler header sizes`
  .page(url(__dirname, '../../../container.html'));

const buttons = Array.from({ length: 4 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test('items inside toolbar menu should stretch', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t.click(scheduler.toolbar.menuButton);

  await takeScreenshot('scheduler-toolbar-menu.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('fluent.blue.light');

  return createWidget('dxScheduler', {
    width: 320,
    currentDate: new Date('2025-05-02T07:59:01.167Z'),
    toolbar: {
      items: ['today', 'dateNavigator', ...buttons, {
        location: 'after',
        locateInMenu: 'auto',
        name: 'viewSwitcher',
      }],
    },
  });
}).after(async () => {
  await changeTheme('generic.light');
});

test('Scheduler header should have correct sizes', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date('2025-05-02T07:59:01.167Z'),
  toolbar: { items: ['today', 'dateNavigator', ...buttons, 'viewSwitcher'] },
}));
