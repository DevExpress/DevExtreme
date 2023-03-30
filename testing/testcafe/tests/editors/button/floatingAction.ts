/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';

fixture.disablePageReloads`FloatingAction`
  .page(url(__dirname, '../../container.html'));

for (const label of ['Add Row', undefined]) {
  for (const icon of ['home', undefined]) {
    safeSizeTest(`FAB with dne speed dial action button, label: ${label}, icon: ${icon}`, async (t) => {
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
    }, [300, 300]).before(async () => {
      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        visible: true,
      });
    });

    safeSizeTest(`FAB with two speed dial action buttons, label: ${label}, icon: ${icon}`, async (t) => {
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
    }, [300, 300]).before(async () => {
      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        index: 1,
        visible: true,
      });

      await createWidget('dxSpeedDialAction', {
        label: 'Remove Row',
        icon: 'trash',
        index: 2,
        visible: true,
      }, '#otherContainer');
    });

    safeSizeTest(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async (t) => {
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
    }, [300, 300]).before(async () => {
      await createWidget('dxSpeedDialAction', {
        label,
        icon,
        index: 1,
        visible: true,
      });

      await createWidget('dxSpeedDialAction', {
        label: 'Remove Row',
        icon: 'trash',
        index: 2,
        visible: true,
      }, '#otherContainer');
    });
  }
}
