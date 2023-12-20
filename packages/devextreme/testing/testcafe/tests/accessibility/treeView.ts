import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { employees } from '../navigation/treeView/data';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const options: Options = {
  height: [
    undefined,
    // 320, // NOTE: False positive axe report 'Scrollable region must have keyboard access'
  ],
  items: [[], employees],
  searchEnabled: [true, false],
  showCheckBoxesMode: ['none', 'normal', 'selectAll'],
  noDataText: [null, 'no data text'],
  displayExpr: ['fullName'],
};

const configuration: Configuration = {
  component: 'dxTreeView',
  options,
};

testAccessibility(configuration);
