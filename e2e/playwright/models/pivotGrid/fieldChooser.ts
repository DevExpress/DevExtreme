import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
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
  public getName(): WidgetName { return 'dxPivotGridFieldChooser'; }

  public getTreeView(): TreeView {
    return new TreeView(this.page, this.element.locator(`.${CLASS.treeview}`));
  }

  public getAreas(): Locator {
    return this.element.locator(`.${CLASS.area}`);
  }

  public getRowAreaItem(idx = 0): Locator {
    return this.getAreas().nth(1).locator(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  public getColumnAreaItem(idx = 0): Locator {
    return this.getAreas().nth(2).locator(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  public getFilterAreaItem(idx = 0): Locator {
    return this.getAreas().nth(3).locator(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  public getDataAreaItem(idx = 0): Locator {
    return this.getAreas().nth(4).locator(`.${CLASS.field}.${CLASS.box}`).nth(idx);
  }

  public getDataFields(): Locator {
    return this.getAreas().nth(4).locator(`.${CLASS.fields} .${CLASS.field}`);
  }
}
