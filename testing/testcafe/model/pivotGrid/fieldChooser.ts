import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import TreeView from '../treeView';

const CLASS = {
  treeview: 'dx-treeview',
  area: 'dx-area',
  fields: 'dx-area-fields',
  field: 'dx-area-field',
  box: 'dx-area-box',
};

export default class FieldChooser extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxPivotGridFieldChooser'; }

  getTreeView(): TreeView {
    return new TreeView(this.element.find(`.${CLASS.treeview}`));
  }

  getAreas(): Selector {
    return this.element.find(`.${CLASS.area}`);
  }

  getRowAreaItem(idx = 0): Selector {
    return this.getAreas().nth(1).find(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  getColumnAreaItem(idx = 0): Selector {
    return this.getAreas().nth(2).find(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  getFilterAreaItem(idx = 0): Selector {
    return this.getAreas().nth(3).find(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  getDataFields(): Selector {
    return this.getAreas().nth(4).find(`.${CLASS.fields} .${CLASS.field}`);
  }
}
