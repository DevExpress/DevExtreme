import url from '../../../helpers/getPageUrl';
import { testAccessibility, Options } from '../../../helpers/testAccessibility';
import { isMaterialBased } from '../../../helpers/themeUtils';
import { employees } from './data';

fixture`TreeView: Common tests with axe`
  .page(url(__dirname, '../../container.html'));

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

const a11yCheckConfig = isMaterialBased() ? {
  runOnly: 'color-contrast',
} : {};

testAccessibility({
  testName: 'TreeView a11y:',
  component: 'dxTreeView',
  options,
  a11yCheckConfig,
  selector: '#container',
});
