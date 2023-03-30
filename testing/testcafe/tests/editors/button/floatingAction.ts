/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';

fixture.disablePageReloads`FloatingAction`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async () => {
    await ClientFunction(() => {
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
    })();
  });

for (const label of ['Add Row', undefined]) {
  for (const icon of ['home', undefined]) {
    test(`FAB with dne speed dial action button, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `FAB with one speed dial action button,label=${label},icon=${icon}.png`, {
        shouldTestInCompact: true,
        compactCallBack: async () => {
          await ClientFunction(() => {
            (window as any).DevExpress.ui.repaintFloatingActionButton();
          })();
        },
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');

      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        visible: true,
      }, '#speed-dial-action');
    });

    test(`FAB with two speed dial action buttons, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `FAB with speed dial action buttons,label=${label},icon=${icon}.png`, {
        shouldTestInCompact: true,
        compactCallBack: async () => {
          await ClientFunction(() => {
            (window as any).DevExpress.ui.repaintFloatingActionButton();
          })();
        },
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');
      await appendElementTo('#container', 'div', 'speed-dial-action-trash');

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

    test(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .click(Selector(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`));

      await testScreenshot(t, takeScreenshot, `FAB with two speed dial actions after opening,label=${label},icon=${icon}.png`, {
        shouldTestInCompact: true,
        compactCallBack: async () => {
          await ClientFunction(() => {
            (window as any).DevExpress.ui.repaintFloatingActionButton();
          })();

          await t
            .click(Selector(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`));
        },
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'width: 300px; height: 300px;');
      await appendElementTo('#container', 'div', 'speed-dial-action');
      await appendElementTo('#container', 'div', 'speed-dial-action-trash');

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
