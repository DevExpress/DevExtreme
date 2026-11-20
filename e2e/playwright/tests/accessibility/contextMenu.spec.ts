import type { Page } from '@playwright/test';
import type { Item, Properties } from 'devextreme/ui/context_menu';
import ContextMenu from '../../models/contextMenu';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items: Item[] = [
  { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
  { text: 'user', icon: 'user' },
  { text: 'coffee', icon: 'coffee' },
];

const options: Options<Properties> = {
  target: [defaultSelector],
  position: [{ offset: '10 10' }],
  items: [items],
  disabled: [true, false],
  selectionMode: ['single', 'none'],
};

const created = async (page: Page, { disabled }: Properties): Promise<void> => {
  const contextMenu = new ContextMenu(page, defaultSelector);

  await contextMenu.show();

  // TestCafe clicks an item of a disabled menu as well; Playwright needs "force" for it.
  await contextMenu.items.nth(0).click({ force: disabled });
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxContextMenu',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
