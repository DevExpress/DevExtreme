import type { WidgetName } from '../types';
import GridBase from './gridBase';
import GroupPanel from './groupPanel';

const CLASS = {
  groupPanel: 'group-panel',
};

export default class DataGrid extends GridBase {
  name: WidgetName = 'dxDataGrid';

  compatibilityName: WidgetName = 'dxDataGrid';

  public getGroupPanel(): GroupPanel {
    return new GroupPanel(this.element.locator(`.${this.addWidgetPrefix(CLASS.groupPanel)}`));
  }
}
