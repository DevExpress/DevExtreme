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
  appointmentPopupContent: '.dx-scheduler-appointment-popup .dx-overlay-content',
  appointmentPopupToolbar: '.dx-scheduler-appointment-popup .dx-popup-title',
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
  recurrenceGroup: '.dx-scheduler-form-recurrence-group',
  backButton: `.dx-button.dx-widget[aria-label="Back"]`,
  recurrenceStartDateInput: '.dx-scheduler-form-recurrence-start-date-editor input[type="text"]',
  recurrenceFrequencyEditor: '.dx-scheduler-form-recurrence-frequency-editor .dx-selectbox.dx-widget',
  recurrenceSettingsButton: '.dx-scheduler-form-recurrence-settings-button',
  weekDayButtons: '.dx-scheduler-days-of-week-buttons .dx-button',
  monthDayInput: '.dx-scheduler-form-day-of-month-group [type="text"]',
  yearlyMonthInput: '.dx-scheduler-form-recurrence-by-month-editor .dx-selectbox.dx-widget',
  recurrenceEndRadioGroup: '.dx-scheduler-form-recurrence-end-editors',
  recurrenceEndInputGroup: '.dx-scheduler-form-recurrence-end-group',
  dayOfMonthInput: '.dx-scheduler-form-day-of-month-editor input[type="text"]',
  listItem: '.dx-list-item',
};

export default class AppointmentPopup {
  popup: Popup = new Popup(SELECTORS.appointmentPopup);
  contentElement: Selector = Selector(SELECTORS.appointmentPopupContent);
  toolbarElement: Selector = Selector(SELECTORS.appointmentPopupToolbar);

  saveButton: Button = new Button(this.toolbarElement.find(SELECTORS.doneButton));
  cancelButton: Button = new Button(this.toolbarElement.find(SELECTORS.cancelButton));

  form: Form = new Form(this.contentElement.find(SELECTORS.form));

  textEditor: TextBox = new TextBox(this.contentElement.find(SELECTORS.textEditor));

  allDaySwitch: Selector = Selector(this.contentElement.find(SELECTORS.allDaySwitch));

  startDateEditor: DateBox = new DateBox(this.contentElement.find(SELECTORS.startDateEditor));
  startTimeEditor: DateBox = new DateBox(this.contentElement.find(SELECTORS.startTimeEditor));
  startTimeZoneEditor: SelectBox = new SelectBox(this.contentElement.find(SELECTORS.startTimeZoneEditor));

  endDateEditor: DateBox = new DateBox(this.contentElement.find(SELECTORS.endDateEditor));
  endTimeEditor: DateBox = new DateBox(this.contentElement.find(SELECTORS.endTimeEditor));
  endTimeZoneEditor: SelectBox = new SelectBox(this.contentElement.find(SELECTORS.endTimeZoneEditor));

  repeatEditor: SelectBox = new SelectBox(this.contentElement.find(SELECTORS.repeatEditor));
  recurrenceSettingsButton: Button = new Button(this.repeatEditor.element.find(SELECTORS.recurrenceSettingsButton));

  descriptionEditor: TextArea = new TextArea(this.contentElement.find(SELECTORS.descriptionEditor));

  recurrence = {
    backButton: Selector(SELECTORS.backButton),
    group: Selector(SELECTORS.recurrenceGroup),
    startDateInput: Selector(SELECTORS.recurrenceStartDateInput),
    frequencyEditor: Selector(SELECTORS.recurrenceFrequencyEditor),
    weekDayButtons: Selector(SELECTORS.weekDayButtons),
    monthDayInput: Selector(SELECTORS.monthDayInput),
    yearlyMonthInput: Selector(SELECTORS.yearlyMonthInput),
    endRadioGroup: Selector(SELECTORS.recurrenceEndRadioGroup),
    endInputGroup: Selector(SELECTORS.recurrenceEndInputGroup),
  };

  constructor(private readonly scheduler: Selector) { }

  async selectRepeatValue(t: TestController, freq = 'Daily'): Promise<void> {
    await t.click(this.repeatEditor.element);

    const listItem = Selector(SELECTORS.listItem).withText(freq);
    await t.click(listItem);

    await t.wait(500);
  }

  async clickRecurrenceSettingsButton(t: TestController): Promise<void> {
    await t.click(this.recurrenceSettingsButton.element);
    await t.wait(500);
  }
}
