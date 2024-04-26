import { Properties } from 'devextreme/ui/tree_view.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { employees } from '../navigation/treeView/data';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const configuration: Configuration = {
  component: 'dxTreeView',
  options,
};

testAccessibility(configuration);
