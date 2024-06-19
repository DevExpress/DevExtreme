import { Properties } from 'devextreme/ui/radio_group.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  readOnly: [true, false],
  layout: ['horizontal', 'vertical'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxRadioGroup',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
