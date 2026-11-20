import type { Item, Properties } from 'devextreme/ui/tabs';
import type { Page } from '@playwright/test';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items: Item[] = [
  { text: 'John Heart' },
  { text: 'Marina Thomas', disabled: true },
  { text: 'Robert Reagan' },
  { text: 'Greta Sims' },
  { text: 'Olivia Peyton' },
  { text: 'Ed Holmes' },
  { text: 'Wally Hobbs' },
  { text: 'Brad Jameson', icon: 'user' },
  { icon: 'chart' },
  { icon: 'find', badge: '3' },
];

const options: Options<Properties> = {
  dataSource: [items],
  // @ts-expect-error private option
  selectOnFocus: [true, false],
  showNavButtons: [true, false],
  width: [450],
  height: [250],
  itemHoldTimeout: [5000],
  useInkRipple: [false],
};

const created = async (page: Page): Promise<void> => {
  await page.keyboard.press('Tab');
};

const configuration: Configuration<Properties> = {
  component: 'dxTabs',
  options,
  created,
};

testAccessibility(configuration);
