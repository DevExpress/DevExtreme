import { Properties } from 'devextreme/ui/tile_view.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  items: [[{ text: 'test 1' }]],
  focusStateEnabled: [true],
};

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = {
  rules: {
    'color-contrast': {
      enabled: false,
    },
  },
};

const configuration: Configuration = {
  component: 'dxTileView',
  a11yCheckConfig,
  options,
  created,
};

// testAccessibility(configuration);
