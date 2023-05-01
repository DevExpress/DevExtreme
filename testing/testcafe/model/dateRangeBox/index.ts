import { Selector } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import DateBox from '../dateBox';
import Calendar from '../calendar/calendar';
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
};

export default class DateRangeBox extends Widget {
  dropDownButton: Selector;

  clearButton: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.dropDownButton = this.element.find(`.${CLASS.dropDownButton}`);
    this.clearButton = this.element.find(`.${CLASS.buttonsContainer}`).find(`.${CLASS.clearButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDateRangeBox'; }

  getPopup(): Popup {
    return new Popup(this.element.find(`.${CLASS.popup}`));
  }

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
