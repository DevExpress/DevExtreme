import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import ColumnHeaderArea from './columnHeaderArea';
import DataHeaderArea from './dataHeaderArea';
import FieldChooser from './fieldChooser';
import Popup from '../popup';
import RowHeaderArea from './rowHeaderArea';

const CLASS = {
  fieldChooser: 'dx-pivotgridfieldchooser',
  fieldChooserButton: 'dx-pivotgrid-field-chooser-button',
  fieldChooserPopup: 'dx-fieldchooser-popup',
  exportBtn: 'dx-pivotgrid-export-button',
};

export default class PivotGrid extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxPivotGrid'; }

  addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.getName(), className);
  }

  scrollTo(options: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getInstance() as any)._dataArea._getScrollable().scrollTo(options),
      { dependencies: { getInstance, options } },
    )();
  }

  scrollBy(options: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getInstance() as any)._dataArea._getScrollable().scrollBy(options),
      { dependencies: { getInstance, options } },
    )();
  }

  getFieldChooserButton(): Selector {
    return this.element.find(`.${CLASS.fieldChooserButton}`);
  }

  getFieldChooserPopup(): Popup {
    return new Popup(this.element.find(`.${CLASS.fieldChooserPopup}`));
  }

  getFieldChooser(): FieldChooser {
    return new FieldChooser(this.getFieldChooserPopup().getWrapper().find(`.${CLASS.fieldChooser}`));
  }

  getExportButton(): Selector {
    return this.element.find(`.${CLASS.exportBtn}`);
  }

  getColumnHeaderArea(): ColumnHeaderArea {
    return new ColumnHeaderArea(this.element);
  }

  getRowHeaderArea(): RowHeaderArea {
    return new RowHeaderArea(this.element);
  }

  getDataHeaderArea(): DataHeaderArea {
    return new DataHeaderArea(this.element);
  }
}
