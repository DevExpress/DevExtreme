import Widget from '../internal/widget';
import FieldChooser from './fieldChooser';
import Popup from '../popup';

const CLASS = {
  fieldChooser: 'dx-pivotgridfieldchooser',
  fieldChooserButton: 'dx-pivotgrid-field-chooser-button',
  fieldChooserPopup: 'dx-fieldchooser-popup',
};

export default class PivotGrid extends Widget {
  name = 'dxPivotGrid';

  addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.name, className);
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
}
