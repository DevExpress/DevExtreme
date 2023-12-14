import url from '../../../helpers/getPageUrl';
import { testAccessibility, Options } from '../../../helpers/testAccessibility';
import { employees } from './data';

fixture`TreeView`
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

testAccessibility({
  testName: 'Testing with axe',
  component: 'dxTreeView',
  options,
});
