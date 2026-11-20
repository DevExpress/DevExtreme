import type { Properties } from 'devextreme/ui/tree_view';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';
import { employees } from '../navigation/treeView/data';

const options: Options<Properties> = {
  height: [
    undefined,
    // 320, // NOTE: False positive axe report 'Scrollable region must have keyboard access'
  ],
  items: [[], employees],
  searchEnabled: [true, false],
  showCheckBoxesMode: ['none', 'normal', 'selectAll'],
  noDataText: [undefined, 'no data text'],
  displayExpr: ['fullName'],
};

const configuration: Configuration<Properties> = {
  component: 'dxTreeView',
  options,
};

testAccessibility(configuration);
