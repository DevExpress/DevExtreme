import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import FieldChooser from './fieldChooser';
import Popup from '../popup';

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
}
