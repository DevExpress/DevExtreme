import { Properties } from 'devextreme/ui/accordion.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [items],
  disabled: [true, false],
  deferRendering: [true, false],
  hint: [undefined, 'hint'],
  multiple: [true, false],
  focusStateEnabled: [true],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxAccordion',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
