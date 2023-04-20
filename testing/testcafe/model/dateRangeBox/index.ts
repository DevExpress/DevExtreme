import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import DateBox from '../dateBox';

const CLASS = {
  startDateDateBox: 'dx-start-datebox',
  endDateDateBox: 'dx-end-datebox',
  dropDownButton: 'dx-dropdowneditor-button',
  doneButton: 'dx-popup-done',
};

export default class DateRangeBox extends Widget {
  dropDownButton: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.dropDownButton = this.element.find(`.${CLASS.dropDownButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDateRangeBox'; }

  getStartDateBox(): DateBox {
    return new DateBox(this.element.find(`.${CLASS.startDateDateBox}`));
  }

  getEndDateBox(): DateBox {
    return new DateBox(this.element.find(`.${CLASS.endDateDateBox}`));
  }
}
