import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/html_editor';
import HtmlEditor from '../../models/htmlEditor';
import {
  test, defaultSelector, testAccessibility, type Configuration,
} from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

// NOTE: HtmlEditor needs Quill, which only the extended container page references
test.use({ containerUrl: '/e2e/playwright/tests/container-extended.html' });

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

const markup = '<p>He<em>llo</em></p>';

const options: Options<Properties> = {
  value: [markup],
  readOnly: [true, false],
  name: ['', 'name'],
  height: [undefined, 300],
  width: [undefined, 300],
  placeholder: ['', 'placeholder'],
  focusStateEnabled: [true],
  toolbar: [
    {
      items: ['bold', 'color'],
    },
  ],
};

const created = async (page: Page): Promise<void> => {
  await page.locator(defaultSelector).click();
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxHtmlEditor',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);

const aiOptions: Options<Properties> = {
  value: [markup],
  focusStateEnabled: [true],
  toolbar: [{ items: ['ai'] }],
  aiIntegration: [
    ({} as any),
    { changeStyle() {} },
    { changeStyle(_, { onComplete }) { onComplete?.('Result'); } },
    { changeStyle(_, { onError }) { onError?.('Error' as any); } },
  ],
};

const aiCreated = async (page: Page): Promise<void> => {
  const htmlEditor = new HtmlEditor(page, '#container');
  const menuItems = page.locator(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`);

  await page.locator(defaultSelector).click();

  await htmlEditor.getToolbarItem('ai').element.click();
  await menuItems.nth(4).click();

  await menuItems.nth(4)
    .locator(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(0)
    .click();
};

const aiConfiguration: Configuration<Properties> = {
  component: 'dxHtmlEditor',
  name: 'AI',
  a11yCheckConfig,
  options: aiOptions,
  created: aiCreated,
};

testAccessibility(aiConfiguration);
