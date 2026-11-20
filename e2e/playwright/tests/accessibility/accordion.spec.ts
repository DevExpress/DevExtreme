import type { Properties } from 'devextreme/ui/accordion';
import type { Page } from '@playwright/test';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [items],
  disabled: [true, false],
  deferRendering: [true, false],
  multiple: [true, false],
  focusStateEnabled: [true],
};

const created = async (page: Page, { disabled, multiple }: Properties): Promise<void> => {
  if (disabled || !multiple) {
    return;
  }

  const itemTitle = page.locator('.dx-accordion-item-title');

  await itemTitle.nth(0).click();
  await itemTitle.nth(1).click();
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxAccordion',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
