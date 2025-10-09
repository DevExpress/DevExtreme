import { Selector } from 'testcafe';
import Form from '../../form/form';
import Popup from '../../popup';
import TextBox from '../../textBox';
import TextArea from '../../textArea';
import SelectBox from '../../selectBox';
import DateBox from '../../dateBox';
import Button from '../../button';

export const SELECTORS = {
  appointmentPopup: `.dx-scheduler-appointment-popup.dx-popup.dx-widget`,
  form: `.dx-scheduler-form`,
  doneButton: `.dx-popup-done.dx-button.dx-widget`,
  cancelButton: `.dx-popup-cancel.dx-button.dx-widget`,
  textEditor: `.dx-textbox.dx-widget`,
  allDaySwitch: `.dx-scheduler-form-all-day-switch .dx-switch.dx-widget`,
  startDateEditor: `.dx-scheduler-form-start-date-editor .dx-datebox.dx-datebox-date.dx-widget`,
  startTimeEditor: `.dx-scheduler-form-start-time-editor .dx-datebox.dx-datebox-time.dx-widget`,
  startTimeZoneEditor: `.dx-scheduler-form-start-date-timezone-editor .dx-selectbox.dx-widget`,
  endDateEditor: `.dx-scheduler-form-end-date-editor .dx-datebox.dx-datebox-date.dx-widget`,
  endTimeEditor: `.dx-scheduler-form-end-time-editor .dx-datebox.dx-datebox-time.dx-widget`,
  endTimeZoneEditor: `.dx-scheduler-form-end-date-timezone-editor .dx-selectbox.dx-widget`,
  repeatEditor: `.dx-scheduler-form-repeat-editor .dx-selectbox.dx-widget`,
  descriptionEditor: `.dx-scheduler-form-description-editor .dx-textarea.dx-widget`,
};

export default class AppointmentPopup {
  popup: Popup = new Popup(SELECTORS.appointmentPopup);

  saveButton: Button = new Button(this.popup.getToolbar().find(SELECTORS.doneButton));
  cancelButton: Button = new Button(this.popup.getToolbar().find(SELECTORS.cancelButton));

  form: Form = new Form(this.popup.content.find(SELECTORS.form));

  textEditor: TextBox = new TextBox(this.popup.content.find(SELECTORS.textEditor));

  allDaySwitch: Selector = Selector(this.popup.content.find(SELECTORS.allDaySwitch));

  startDateEditor: DateBox = new DateBox(this.popup.content.find(SELECTORS.startDateEditor));
  startTimeEditor: DateBox = new DateBox(this.popup.content.find(SELECTORS.startTimeEditor));
  startTimeZoneEditor: SelectBox = new SelectBox(this.popup.content.find(SELECTORS.startTimeZoneEditor));

  endDateEditor: DateBox = new DateBox(this.popup.content.find(SELECTORS.endDateEditor));
  endTimeEditor: DateBox = new DateBox(this.popup.content.find(SELECTORS.endTimeEditor));
  endTimeZoneEditor: SelectBox = new SelectBox(this.popup.content.find(SELECTORS.endTimeZoneEditor));

  repeatEditor: SelectBox = new SelectBox(this.popup.content.find(SELECTORS.repeatEditor));

  descriptionEditor: TextArea = new TextArea(this.popup.content.find(SELECTORS.descriptionEditor));

  constructor(private readonly scheduler: Selector) { }
}
