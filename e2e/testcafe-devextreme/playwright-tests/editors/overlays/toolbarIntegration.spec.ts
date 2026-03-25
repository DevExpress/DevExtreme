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

  ['dxPopup', 'dxPopover'].forEach((name) => {
    ['bottom', 'top'].forEach((toolbar) => {
      [true, false].forEach((rtlEnabled) => {
        test(`Extended toolbar should be used in ${name},rtlEnabled=${rtlEnabled},toolbar=${toolbar}`, async ({ page }) => {
          await page.setViewportSize({ width: 600, height: 400 });

          if (isMaterial()) {
            await insertStylesheetRulesToPage(page, '.dx-overlay-content, .dx-overlay-content input { font-family: sans-serif !important; }');
          }

          await createWidget(page, name, {
            showCloseButton: true,
            contentTemplate: () => $('<div>').text(
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '
              + 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, '
              + 'when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            ),
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
              options: { icon: 'back' },
              toolbar,
            }, {
              location: 'before',
              widget: 'dxButton',
              locateInMenu: 'auto',
              options: { icon: 'refresh' },
              toolbar,
            }, {
              location: 'center',
              locateInMenu: 'never',
              template() { return $('<div><b>Popup\'s</b> title</div>'); },
              toolbar,
            }, {
              location: 'after',
              widget: 'dxSelectBox',
              locateInMenu: 'auto',
              options: { width: 140, items: [1, 2, 3, 4, 5], value: 3 },
              toolbar,
            }, {
              location: 'after',
              widget: 'dxButton',
              locateInMenu: 'auto',
              options: { icon: 'plus' },
              toolbar,
            }, {
              locateInMenu: 'always',
              widget: 'dxButton',
              options: { icon: 'save', text: 'Save' },
              toolbar,
            }, {
              widget: 'dxButton',
              toolbar: toolbar === 'top' ? 'bottom' : 'top',
              location: 'before',
              options: { icon: 'email' },
            }, {
              widget: 'dxButton',
              toolbar: toolbar === 'top' ? 'bottom' : 'top',
              location: 'after',
              options: { text: 'Close' },
            }],
          });

          const toolbarSelector = toolbar === 'top'
            ? '.dx-popup-title .dx-toolbar'
            : '.dx-popup-bottom .dx-toolbar';

          await page.evaluate(({ sel, tb }) => {
            const toolbarEl = document.querySelector(`${sel} ${tb}`);
            if (toolbarEl) {
              const instance = (window as any).DevExpress.ui.dxToolbar.getInstance(toolbarEl);
              if (instance) instance.option('overflowMenuVisible', true);
            }
          }, { sel: '.dx-overlay-content', tb: toolbarSelector });

          await page.hover(CLOSE_BUTTON_SELECTOR);

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
    return { text, toolbar, locateInMenu, location };
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
    contentTemplate: () => $('<div>').width(300).height(300),
  };

  test('Popup toolbars with wide elements and overflow menu if hidden on init with toolbar items', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 });

    await createWidget(page, 'dxPopup', {
      ...baseConfiguration,
      toolbarItems,
      visible: false,
    });

    await page.evaluate(() => {
      ($('#container') as any).dxPopup('instance').option({ visible: true });
    });

    await page.waitForTimeout(ANIMATION_DELAY);

    const overflowButton = page.locator('#container .dx-popup-title .dx-dropdownmenu-button, #container .dx-popup-title .dx-toolbar-menu-container .dx-button');
    await overflowButton.first().click();

    await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu before items rebinding.png');

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxPopup('instance');
      const items = instance.option('toolbarItems');
      items[2].visible = false;
      instance.option('toolbarItems', [...items]);
    });

    await overflowButton.first().click();

    await testScreenshot(page, 'Popup toolbars with wide elements and overflow menu after items rebinding.png');
  });

  test('Popup toolbars with wide elements and overflow menu if hidden on init with no toolbar items', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 });

    await createWidget(page, 'dxPopup', {
      ...baseConfiguration,
      toolbarItems: [],
      visible: false,
    });

    await page.evaluate((items) => {
      ($('#container') as any).dxPopup('instance').option({ visible: true, toolbarItems: items });
    }, toolbarItems);

    await page.waitForTimeout(ANIMATION_DELAY);

    const overflowButton = page.locator('#container .dx-popup-title .dx-dropdownmenu-button, #container .dx-popup-title .dx-toolbar-menu-container .dx-button');
    await overflowButton.first().click();

    await testScreenshot(page, 'Toolbar before items rebinding if it was hidden without items on init.png');

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxPopup('instance');
      const items = instance.option('toolbarItems');
      items[2].visible = false;
      instance.option('toolbarItems', [...items]);
    });

    await overflowButton.first().click();

    await testScreenshot(page, 'Toolbar after items rebinding if it was hidden without items on init.png');
  });

  test('Popup toolbars with wide elements and overflow menu if shown on init with toolbar items', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 });

    await createWidget(page, 'dxPopup', {
      ...baseConfiguration,
      toolbarItems,
      visible: true,
    });

    const overflowButton = page.locator('#container .dx-popup-title .dx-dropdownmenu-button, #container .dx-popup-title .dx-toolbar-menu-container .dx-button');
    await overflowButton.first().click();

    await testScreenshot(page, 'Toolbar before items rebinding if it was visible with items on init.png');

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxPopup('instance');
      const items = instance.option('toolbarItems');
      items[2].visible = false;
      instance.option('toolbarItems', [...items]);
    });

    await overflowButton.first().click();

    await testScreenshot(page, 'Toolbar after items rebinding if it was visible with items on init.png');
  });
});
