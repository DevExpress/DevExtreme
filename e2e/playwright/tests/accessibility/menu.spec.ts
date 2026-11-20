import type { Page } from '@playwright/test';
import type { Item, Properties } from 'devextreme/ui/menu';
import Menu from '../../models/menu';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items: Item[] = [
  {
    text: 'remove',
    icon: 'remove',
    items: [
      {
        text: 'user',
        icon: 'user',
        disabled: true,
        items: [{
          text: 'user_1',
        }],
      },
      {
        text: 'save',
        icon: 'save',
        items: [
          { text: 'export', icon: 'export' },
          { text: 'edit', icon: 'edit' },
        ],
      },
    ],
  },
  { text: 'user', icon: 'user' },
  {
    text: 'coffee',
    icon: 'coffee',
    disabled: true,
  },
];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  width: [400, 1024],
  orientation: ['horizontal', 'vertical'],
  adaptivityEnabled: [true, false],
};

const created = async (page: Page, optionConfiguration: Properties): Promise<void> => {
  const { disabled } = optionConfiguration;

  if (disabled) {
    return;
  }

  const menu = new Menu(page);

  await menu.getItem(0).click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxMenu',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
