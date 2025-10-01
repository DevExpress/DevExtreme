import { Selector } from 'testcafe';
import Form from 'testcafe-models/form/form';
import Popup from 'testcafe-models/popup';
import TextBox from 'testcafe-models/textBox';
import TextArea from 'testcafe-models/textArea';
import SelectBox from 'testcafe-models/selectBox';
import DateBox from 'testcafe-models/dateBox';
import Button from 'testcafe-models/button';

export const CLASS = {
  popup: 'dx-popup.dx-widget',
  overlayContent: 'dx-overlay-content',
  toolbar: 'dx-toolbar.dx-widget',
  doneButton: 'dx-popup-done.dx-button.dx-widget',
  cancelButton: 'dx-popup-cancel.dx-button.dx-widget',

  textBox: 'dx-textbox.dx-widget',
  switch: 'dx-switch.dx-widget',
  dateEditor: 'dx-datebox.dx-datebox-date.dx-widget',
  timeEditor: 'dx-datebox.dx-datebox-time.dx-widget',
  selectBox: 'dx-selectbox.dx-widget',
  textArea: 'dx-textarea.dx-widget',

  appointmentPopup: 'dx-scheduler-appointment-popup',
  form: 'dx-scheduler-form',

  textEditor: 'dx-scheduler-form-text-editor',
  allDaySwitch: 'dx-scheduler-form-all-day-switch',
  startDateEditor: 'dx-scheduler-form-start-date-editor',
  startTimeEditor: 'dx-scheduler-form-start-time-editor',
  startDateTimeZoneEditor: 'dx-scheduler-form-start-date-timezone-editor',
  endDateEditor: 'dx-scheduler-form-end-date-editor',
  endTimeEditor: 'dx-scheduler-form-end-time-editor',
  endDateTimeZoneEditor: 'dx-scheduler-form-end-date-timezone-editor',
  repeatEditor: 'dx-scheduler-form-repeat-editor',
  descriptionEditor: 'dx-scheduler-form-description-editor',
};

export const SELECTORS = {
  appointmentPopup: `.${CLASS.appointmentPopup}.${CLASS.popup}`,
  form: `.${CLASS.appointmentPopup} .${CLASS.form}`,
  textEditor: `.${CLASS.appointmentPopup} .${CLASS.textEditor} .${CLASS.textBox}`,
  allDaySwitch: `.${CLASS.appointmentPopup} .${CLASS.allDaySwitch} .${CLASS.switch}`,
  startDateEditor: `.${CLASS.appointmentPopup} .${CLASS.startDateEditor} .${CLASS.dateEditor}`,
  startTimeEditor: `.${CLASS.appointmentPopup} .${CLASS.startTimeEditor} .${CLASS.timeEditor}`,
  startTimeZoneEditor: `.${CLASS.appointmentPopup} .${CLASS.startDateTimeZoneEditor} .${CLASS.selectBox}`,
  endDateEditor: `.${CLASS.appointmentPopup} .${CLASS.endDateEditor} .${CLASS.dateEditor}`,
  endTimeEditor: `.${CLASS.appointmentPopup} .${CLASS.endTimeEditor} .${CLASS.timeEditor}`,
  endTimeZoneEditor: `.${CLASS.appointmentPopup} .${CLASS.endDateTimeZoneEditor} .${CLASS.selectBox}`,
  repeatEditor: `.${CLASS.appointmentPopup} .${CLASS.repeatEditor} .${CLASS.selectBox}`,
  descriptionEditor: `.${CLASS.appointmentPopup} .${CLASS.descriptionEditor} .${CLASS.textArea}`,
};

export default class AppointmentPopup {
  popup: Popup = new Popup(this.scheduler.find(SELECTORS.appointmentPopup));

  saveButton: Button = new Button(this.popup.topToolbar.find(`.${CLASS.doneButton}`));
  cancelButton: Button = new Button(this.popup.topToolbar.find(`.${CLASS.cancelButton}`));

  form: Form = new Form(this.scheduler.find(SELECTORS.form));

  textEditor: TextBox = new TextBox(this.scheduler.find(SELECTORS.textEditor));
  
  allDaySwitch: Selector = Selector(this.scheduler.find(SELECTORS.allDaySwitch));
  
  startDateEditor: DateBox = new DateBox(this.scheduler.find(SELECTORS.startDateEditor));
  startTimeEditor: DateBox = new DateBox(this.scheduler.find(SELECTORS.startTimeEditor));
  startTimeZoneEditor: SelectBox = new SelectBox(this.scheduler.find(SELECTORS.startTimeZoneEditor));
  
  endDateEditor: DateBox = new DateBox(this.scheduler.find(SELECTORS.endDateEditor));
  endTimeEditor: DateBox = new DateBox(this.scheduler.find(SELECTORS.endTimeEditor));
  endTimeZoneEditor: SelectBox = new SelectBox(this.scheduler.find(SELECTORS.endTimeZoneEditor));

  repeatEditor: SelectBox = new SelectBox(this.scheduler.find(SELECTORS.repeatEditor));

  descriptionEditor: TextArea = new TextArea(this.scheduler.find(SELECTORS.descriptionEditor));

  constructor(private readonly scheduler: Selector) { }
}
