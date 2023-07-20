/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { getThemePostfix, testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { changeTheme } from '../../../helpers/changeTheme';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';

const setGlobalConfig = ClientFunction(() => {
  (window as any).DevExpress.config({
    floatingActionButtonConfig: {
      icon: 'edit',
      shading: false,
      position: {
        of: '#container',
        my: 'right bottom',
        at: 'right bottom',
        offset: '-16 -16',
      },
    },
  });
});

fixture.disablePageReloads`FloatingAction - default theme`
  .page(url(__dirname, '../../container.html'));

for (const label of ['Add Row', '']) {
  for (const icon of ['home', '']) {
    test(`FAB with one speed dial action button, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `FAB with one speed dial action button,label='${label}',icon='${icon}'.png`, {
        element: '#container',
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');

      await setGlobalConfig();

      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        visible: true,
      }, '#speed-dial-action');
    });

    test(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .click(Selector('body'))
        .click(Selector(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`));

      await testScreenshot(t, takeScreenshot, `FAB is opened with two speed dial actions,label='${label}',icon='${icon}'.png`, {
        element: '#container',
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');
      await appendElementTo('#container', 'div', 'speed-dial-action-trash');

      await setGlobalConfig();

      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        index: 1,
        visible: true,
      }, '#speed-dial-action');

      await createWidget('dxSpeedDialAction', {
        label: 'Remove Row',
        icon: 'trash',
        index: 2,
        visible: true,
      }, '#speed-dial-action-trash');
    });
  }
}

test('FAB with two speed dial action buttons', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'FAB with two speed dial action buttons.png', {
    element: '#container',
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
  await appendElementTo('#container', 'div', 'speed-dial-action');
  await appendElementTo('#container', 'div', 'speed-dial-action-trash');

  await setGlobalConfig();

  await createWidget('dxSpeedDialAction', {
    label: 'Add row',
    icon: 'plus',
    index: 1,
    visible: true,
  }, '#speed-dial-action');

  await createWidget('dxSpeedDialAction', {
    label: 'Remove Row',
    icon: 'trash',
    index: 2,
    visible: true,
  }, '#speed-dial-action-trash');
});

fixture.disablePageReloads`FloatingAction - compact theme`
  .page(url(__dirname, '../../container.html'));

for (const label of ['Add Row', '']) {
  for (const icon of ['home', '']) {
    test(`FAB with one speed dial action button in compact, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`FAB with one speed dial action button,label='${label}',icon='${icon}'${getThemePostfix(`${process.env.theme}-compact`)}.png`, '#container'))
        .ok();

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(`${process.env.theme}.compact`);

      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');

      await setGlobalConfig();

      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        visible: true,
      }, '#speed-dial-action');
    }).after(async () => {
      await changeTheme(`${process.env.theme}`);
    });

    test(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .click(Selector('body'))
        .click(Selector(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`));

      await t
        .expect(await takeScreenshot(`FAB is opened with two speed dial actions,label='${label}',icon='${icon}'${getThemePostfix(`${process.env.theme}-compact`)}.png`, '#container'))
        .ok();

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(`${process.env.theme}.compact`);

      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');
      await appendElementTo('#container', 'div', 'speed-dial-action-trash');

      await setGlobalConfig();

      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        index: 1,
        visible: true,
      }, '#speed-dial-action');

      await createWidget('dxSpeedDialAction', {
        label: 'Remove Row',
        icon: 'trash',
        index: 2,
        visible: true,
      }, '#speed-dial-action-trash');
    }).after(async () => {
      await changeTheme(`${process.env.theme}`);
    });
  }
}

test('FAB with two speed dial action buttons', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`FAB with two speed dial action buttons${getThemePostfix(`${process.env.theme}-compact`)}.png`, '#container'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme(`${process.env.theme}.compact`);

  await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
  await appendElementTo('#container', 'div', 'speed-dial-action');
  await appendElementTo('#container', 'div', 'speed-dial-action-trash');

  await setGlobalConfig();

  await createWidget('dxSpeedDialAction', {
    label: 'Add row',
    icon: 'plus',
    index: 1,
    visible: true,
  }, '#speed-dial-action');

  await createWidget('dxSpeedDialAction', {
    label: 'Remove Row',
    icon: 'trash',
    index: 2,
    visible: true,
  }, '#speed-dial-action-trash');
}).after(async () => {
  await changeTheme(`${process.env.theme}`);
});
