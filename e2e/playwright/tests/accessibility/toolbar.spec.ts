import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/toolbar';
import Toolbar from '../../models/toolbar';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const generateItems = (count: number) => {
  const items: { text: string; locateInMenu: 'always' }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

const options: Options<Properties> = {
  items: [generateItems(10)],
  disabled: [true, false],
  width: [undefined, 50],
};

const created = async (page: Page, optionConfiguration: Properties): Promise<void> => {
  const { disabled } = optionConfiguration;

  if (disabled) {
    return;
  }

  const toolbar = new Toolbar(page, defaultSelector);
  const overflowMenu = toolbar.getOverflowMenu();

  await overflowMenu.element.click();
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxToolbar',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
