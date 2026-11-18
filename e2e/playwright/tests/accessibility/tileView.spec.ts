import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/tile_view';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  items: [[{ text: 'test 1' }]],
  focusStateEnabled: [true],
};

const created = async (page: Page): Promise<void> => {
  await page.keyboard.press('Tab');
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxTileView',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
