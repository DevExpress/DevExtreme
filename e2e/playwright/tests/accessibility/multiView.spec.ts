import type { Properties } from 'devextreme/ui/multi_view';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [[], items],
  height: [300],
  loop: [true, false],
  noDataText: [undefined, 'no data text'],
  focusStateEnabled: [true],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxMultiView',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
