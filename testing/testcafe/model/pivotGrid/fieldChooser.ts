import Widget from '../internal/widget';
import TreeView from '../treeView';

const CLASS = {
  treeview: 'dx-treeview',
  area: 'dx-area',
  fields: 'dx-area-fields',
  field: 'dx-area-field',
};

export default class FieldChooser extends Widget {
  name = 'dxPivotGridFieldChooser';

  getTreeView(): TreeView {
    return new TreeView(this.element.find(`.${CLASS.treeview}`));
  }

  getAreas(): Selector {
    return this.element.find(`.${CLASS.area}`);
  }

  getDataFields(): Selector {
    return this.getAreas().nth(4).find(`.${CLASS.fields} .${CLASS.field}`);
  }
}
