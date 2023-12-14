import { Options, Configuration } from '../../../helpers/testAccessibility';
import { employees } from './data';

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

export const configuration: Configuration = {
  component: 'dxTreeView',
  options,
};
