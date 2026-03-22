import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup_toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const COMPONENT_SELECTOR = '#container';
  const CLOSE_BUTTON_SELECTOR = '.dx-closebutton';
  const ANIMATION_DELAY = 500;

  [
    { name: 'dxPopup', Class: Popup },
    { name: 'dxPopover', Class: Popover },
  ].forEach(({ name, Class }) => {
    ['bottom', 'top'].forEach((toolbar) => {
      [true, false].forEach((rtlEnabled) => {
        test(`Extended toolbar should be used in ${name},rtlEnabled=${rtlEnabled},toolbar=${toolbar}`, async ({ page }) => {

          if (isMaterial()) {
            await insertStylesheetRulesToPage(page, '.dx-overlay-content, .dx-overlay-content input { font-family: sans-serif !important; }');
          }
          await createWidget(page, name as 'dxPopup' | 'dxPopover', {
            showCloseButton: true,
                      contentTemplate: () => $('<div>').text('\
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.\
                Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,\
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.\
            '),
            width: '60%',
            height: 300,
            showTitle: true,
            rtlEnabled,
            visible: true,
            animation: undefined,
            target: COMPONENT_SELECTOR,
            hideOnOutsideClick: true,
            toolbarItems: [{
              location: 'before',
              widget: 'dxButton',
              options: {
                icon: 'back',
              },
              toolbar,
            }, {
              location: 'before',
              widget: 'dxButton',
              locateInMenu: 'auto',
              options: {
                icon: 'refresh',
              },
              toolbar,
            }, {
              location: 'center',
              locateInMenu: 'never',
              template() {
                return $('<div><b>Popup\'s</b> title</div>');
              },
              toolbar,
            }, {
              location: 'after',
              widget: 'dxSelectBox',
              locateInMenu: 'auto',
              options: {
                width: 140,
                items: [1, 2, 3, 4, 5],
                value: 3,
              },
              toolbar,
            }, {
              location: 'after',
              widget: 'dxButton',
              locateInMenu: 'auto',
              options: {
                icon: 'plus',
              },
              toolbar,
            }, {
              locateInMenu: 'always',
              widget: 'dxButton',
              options: {
                icon: 'save',
                text: 'Save',
              },
              toolbar,
            }, {
              widget: 'dxButton',
              toolbar: toolbar === 'top'
                ? 'bottom'
                : 'top',
              location: 'before',
              options: {
                icon: 'email',
              },
            }, {
              widget: 'dxButton',
              toolbar: toolbar === 'top'
                ? 'bottom'
                : 'top',
              location: 'after',
              options: {
                text: 'Close',
              },
            }],
          });


          const instance = new Class(COMPONENT_SELECTOR);

          if (toolbar === 'top') {
            const topToolbar = new Toolbar(instance.getToolbar());
            await topToolbar.option('overflowMenuVisible', true);
          } else {
            const bottomToolbar = new Toolbar(instance.getBottomToolbar());
            await bottomToolbar.option('overflowMenuVisible', true);
          }

          await hover(Selector(CLOSE_BUTTON_SELECTOR));

          await testScreenshot(page, `${name.replace('dx', '')}_${toolbar}_toolbar_menu,rtlEnabled=${rtlEnabled}.png`);

    });
      });
    });
  });

  function getItemConfig(
    text: string,
    toolbar: 'top' | 'bottom' = 'top',
    location: 'before' | 'center' | 'after' = 'after',
    locateInMenu: 'auto' | 'none' = 'none',
  ) {
    return {
      text,
      toolbar,
      locateInMenu,
      location,
    };
  }

  const toolbarItems = [
    getItemConfig('First Item'),
    getItemConfig('Second Item', 'top', 'after', 'auto'),
    getItemConfig('Third Item', 'top', 'after', 'auto'),
    getItemConfig('!@#$%^&*()-+=[]{}<>|:;.,!?~^*_(){}<>[]:-=+', 'bottom', 'before'),
    getItemConfig('First Item', 'bottom'),
    getItemConfig('Second Item', 'bottom', 'after', 'auto'),
    getItemConfig('Third Item', 'bottom', 'after', 'auto'),
  ];

  const baseConfiguration = {
    title: '!@#$%^&*()-+=[]{}<>|:;.,!?~^*_(){}<>[]:-=+',
    width: 'auto',
    height: 'auto',
    showCloseButton: false,
    contentTemplate: () => $('<div>')
      .width(300)
      .height(300),
  };

  test('Popup toolbars with wide elements and overflow menu if hidden on init with toolbar items', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    ...baseConfiguration,
    toolbarItems,
    visible: false,
  });

    const instance = new Popup(COMPONENT_SELECTOR);
    await instance.option({ visible: true });

    await page.wait(ANIMATION_DELAY)
      .click(instance.getOverflowButton().element);

    await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu before items rebinding.png');

    const items = await instance.option('toolbarItems');
    items[2].visible = false;
    await instance.option('toolbarItems', [...items]);

    await instance.getOverflowButton().element.click();

    await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu after items rebinding.png');

    });

  test('Popup toolbars with wide elements and overflow menu if hidden on init with no toolbar items', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    ...baseConfiguration,
    toolbarItems: [],
    visible: false,
  });

    const instance = new Popup(COMPONENT_SELECTOR);
    await instance.option({ visible: true, toolbarItems });

    await page.wait(ANIMATION_DELAY)
      .click(instance.getOverflowButton().element);

    await testScreenshot(page, 'Toolbar before items rebinding if it was hidden without items on init.png');

    const items = await instance.option('toolbarItems');
    items[2].visible = false;
    await instance.option('toolbarItems', [...items]);

    await instance.getOverflowButton().element.click();

    await testScreenshot(page, 'Toolbar after items rebinding if it was hidden without items on init.png');

    });

  test('Popup toolbars with wide elements and overflow menu if shown on init with toolbar items', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    ...baseConfiguration,
    toolbarItems,
    visible: true,
  });

    const instance = new Popup(COMPONENT_SELECTOR);

    await instance.getOverflowButton().element.click();

    await testScreenshot(page, 'Toolbar before items rebinding if it was visible with items on init.png');

    const items = await instance.option('toolbarItems');
    items[2].visible = false;
    await instance.option('toolbarItems', [...items]);

    await instance.getOverflowButton().element.click();

    await testScreenshot(page, 'Toolbar after items rebinding if it was visible with items on init.png');

    });
});
