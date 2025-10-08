import { Properties } from 'devextreme/ui/multi_view.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [[], items],
  height: [300],
  loop: [true, false],
  hint: [undefined, 'hint'],
  noDataText: [undefined, 'no data text'],
  focusStateEnabled: [true],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxMultiView',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
