import { WidgetName } from '../helpers/widgetName';
import DataGrid from './dataGrid';

export default class TreeList extends DataGrid {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTreeList'; }
}
