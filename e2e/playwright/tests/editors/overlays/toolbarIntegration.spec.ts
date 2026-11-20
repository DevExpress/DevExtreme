import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { isMaterial } from '../../../helpers/themeUtils';
import Popover from '../../../models/popover';
import Popup from '../../../models/popup';
import Toolbar from '../../../models/toolbar';

const COMPONENT_SELECTOR = '#container';
const CLOSE_BUTTON_SELECTOR = '.dx-closebutton';

test.describe('Popup_toolbar', () => {
  test.describe(() => {
    test.use({ browserSize: [600, 400] });

    [
      { name: 'dxPopup' as const, Model: Popup },
      { name: 'dxPopover' as const, Model: Popover },
    ].forEach(({ name, Model }) => {
      ['bottom', 'top'].forEach((toolbar) => {
        [true, false].forEach((rtlEnabled) => {
          test(`Extended toolbar should be used in ${name},rtlEnabled=${rtlEnabled},toolbar=${toolbar}`, async ({ page, theme }) => {
            if (isMaterial(theme)) {
              await insertStylesheetRulesToPage(page, '.dx-overlay-content, .dx-overlay-content input { font-family: sans-serif !important; }');
            }

            await createWidget(page, name, ({ target, toolbarName, rtl }) => ({
              showCloseButton: true,
              // eslint-disable-next-line no-multi-str
              contentTemplate: () => $('<div>').text('\
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.\
                  Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,\
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book.\
              '),
              width: '60%',
              height: 300,
              showTitle: true,
              rtlEnabled: rtl,
              visible: true,
              animation: undefined,
              target,
              hideOnOutsideClick: true,
              toolbarItems: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                  icon: 'back',
                },
                toolbar: toolbarName,
              }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                  icon: 'refresh',
                },
                toolbar: toolbarName,
              }, {
                location: 'center',
                locateInMenu: 'never',
                template() {
                  return $('<div><b>Popup\'s</b> title</div>');
                },
                toolbar: toolbarName,
              }, {
                location: 'after',
                widget: 'dxSelectBox',
                locateInMenu: 'auto',
                options: {
                  width: 140,
                  items: [1, 2, 3, 4, 5],
                  value: 3,
                },
                toolbar: toolbarName,
              }, {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                  icon: 'plus',
                },
                toolbar: toolbarName,
              }, {
                locateInMenu: 'always',
                widget: 'dxButton',
                options: {
                  icon: 'save',
                  text: 'Save',
                },
                toolbar: toolbarName,
              }, {
                widget: 'dxButton',
                toolbar: toolbarName === 'top'
                  ? 'bottom'
                  : 'top',
                location: 'before',
                options: {
                  icon: 'email',
                },
              }, {
                widget: 'dxButton',
                toolbar: toolbarName === 'top'
                  ? 'bottom'
                  : 'top',
                location: 'after',
                options: {
                  text: 'Close',
                },
              }],
            }), COMPONENT_SELECTOR, {
              arg: { target: COMPONENT_SELECTOR, toolbarName: toolbar, rtl: rtlEnabled },
            });

            const instance = new Model(page, COMPONENT_SELECTOR);
            const menuToolbar = new Toolbar(
              page,
              toolbar === 'top' ? instance.getToolbar() : instance.getBottomToolbar(),
            );

            await menuToolbar.option('overflowMenuVisible', true);

            await page.locator(CLOSE_BUTTON_SELECTOR).hover();

            await testScreenshot(page, `${name.replace('dx', '')}_${toolbar}_toolbar_menu,rtlEnabled=${rtlEnabled}.png`);
          });
        });
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [600, 600] });

    const getItemConfig = (
      text: string,
      toolbar: 'top' | 'bottom' = 'top',
      location: 'before' | 'center' | 'after' = 'after',
      locateInMenu: 'auto' | 'none' = 'none',
    ): Record<string, string> => ({
      text,
      toolbar,
      locateInMenu,
      location,
    });

    const toolbarItems = [
      getItemConfig('First Item'),
      getItemConfig('Second Item', 'top', 'after', 'auto'),
      getItemConfig('Third Item', 'top', 'after', 'auto'),
      getItemConfig('!@#$%^&*()-+=[]{}<>|:;.,!?~^*_(){}<>[]:-=+', 'bottom', 'before'),
      getItemConfig('First Item', 'bottom'),
      getItemConfig('Second Item', 'bottom', 'after', 'auto'),
      getItemConfig('Third Item', 'bottom', 'after', 'auto'),
    ];

    const createPopup = (
      page: Parameters<typeof createWidget>[0],
      items: Record<string, string>[],
      visible: boolean,
    ): Promise<void> => createWidget(page, 'dxPopup', (options) => ({
      title: '!@#$%^&*()-+=[]{}<>|:;.,!?~^*_(){}<>[]:-=+',
      width: 'auto',
      height: 'auto',
      showCloseButton: false,
      contentTemplate: () => $('<div>')
        .width(300)
        .height(300),
      ...options,
    }), COMPONENT_SELECTOR, { arg: { toolbarItems: items, visible } });

    const hideThirdItem = async (instance: Popup): Promise<void> => {
      const items = await instance.option('toolbarItems');

      items[2].visible = false;
      await instance.option('toolbarItems', [...items]);
    };

    test('Popup toolbars with wide elements and overflow menu if hidden on init with toolbar items', async ({ page }) => {
      await createPopup(page, toolbarItems, false);

      const instance = new Popup(page, COMPONENT_SELECTOR);

      await instance.option({ visible: true });

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu before items rebinding.png');

      await hideThirdItem(instance);

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu after items rebinding.png');
    });

    test('Popup toolbars with wide elements and overflow menu if hidden on init with no toolbar items', async ({ page }) => {
      await createPopup(page, [], false);

      const instance = new Popup(page, COMPONENT_SELECTOR);

      await instance.option({ visible: true, toolbarItems });

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Toolbar before items rebinding if it was hidden without items on init.png');

      await hideThirdItem(instance);

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Toolbar after items rebinding if it was hidden without items on init.png');
    });

    test('Popup toolbars with wide elements and overflow menu if shown on init with toolbar items', async ({ page }) => {
      await createPopup(page, toolbarItems, true);

      const instance = new Popup(page, COMPONENT_SELECTOR);

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Toolbar before items rebinding if it was visible with items on init.png');

      await hideThirdItem(instance);

      await instance.getOverflowButton().element.click();

      await testScreenshot(page, 'Toolbar after items rebinding if it was visible with items on init.png');
    });
  });
});
