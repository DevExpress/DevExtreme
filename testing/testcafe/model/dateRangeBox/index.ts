import { Selector } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import DateBox from '../dateBox';
import Calendar from '../calendar';
import Popup from '../popup';

const CLASS = {
  popup: 'dx-popup',
  calendar: 'dx-calendar',
  calendarCellClass: 'dx-calendar-cell',
  startDateDateBox: 'dx-start-datebox',
  endDateDateBox: 'dx-end-datebox',
  dropDownButton: 'dx-dropdowneditor-button',
  clearButton: 'dx-clear-button-area',
  buttonsContainer: 'dx-texteditor-buttons-container',
  doneButton: 'dx-popup-done',
  separator: 'dx-daterangebox-separator',
};

export default class DateRangeBox extends Widget {
  dropDownButton: Selector;

  clearButton: Selector;

  separator: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.dropDownButton = this.element.find(`.${CLASS.dropDownButton}`);
    this.separator = this.element.find(`.${CLASS.separator}`);
    this.clearButton = this.element.find(`.${CLASS.buttonsContainer}`).find(`.${CLASS.clearButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDateRangeBox'; }

  getPopup(): Popup {
    return new Popup(this.getStartDateBox().element.find(`.${CLASS.popup}`));
  }

  // eslint-disable-next-line class-methods-use-this
  getCalendar(): Calendar {
    return new Calendar(this.getPopup().getContent().find(`.${CLASS.calendar}`));
  }

  getCalendarCell(index: number): Selector {
    return Selector(this.getCalendar().element.find(`.${CLASS.calendarCellClass}`)).nth(index);
  }

  getStartDateBox(): DateBox {
    return new DateBox(this.element.find(`.${CLASS.startDateDateBox}`));
  }

  getEndDateBox(): DateBox {
    return new DateBox(this.element.find(`.${CLASS.endDateDateBox}`));
  }
}
