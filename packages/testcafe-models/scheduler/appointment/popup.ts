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
  repeatEditorButton: '.dx-scheduler-form-repeat-editor .dx-button-has-icon',
  recurrenceSettingsButton: '.dx-scheduler-form-recurrence-settings-button',
  repeatEveryInput: '.dx-scheduler-form-recurrence-settings-group [type="text"]',
  weekDayButtons: '.dx-scheduler-days-of-week-buttons .dx-button',
  monthDayInput: '.dx-scheduler-form-day-of-month-group [type="text"]',
  yearlyMonthInput: '.dx-scheduler-form-recurrence-by-month-editor .dx-selectbox.dx-widget',
  recurrenceEndRadioGroup: '.dx-scheduler-form-recurrence-end-editors',
  recurrenceEndInputGroup: '.dx-scheduler-form-recurrence-end-group',
  dayOfMonthInput: '.dx-scheduler-form-day-of-month-editor input[type="text"]',
  listOption: '.dx-list-item',
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

  descriptionEditor: TextArea = new TextArea(this.contentElement.find(SELECTORS.descriptionEditor));

  // Recurrence form elements
  recurrence = {
    group: Selector(SELECTORS.recurrenceGroup),
    settingsButton: Selector(SELECTORS.recurrenceSettingsButton),
    repeatEditorButton: Selector(SELECTORS.repeatEditorButton),
    repeatEveryInput: Selector(SELECTORS.repeatEveryInput),
    weekDayButtons: Selector(SELECTORS.weekDayButtons),
    monthDayInput: Selector(SELECTORS.monthDayInput),
    yearlyMonthInput: Selector(SELECTORS.yearlyMonthInput),
    endRadioGroup: Selector(SELECTORS.recurrenceEndRadioGroup),
    endInputGroup: Selector(SELECTORS.recurrenceEndInputGroup),
  };

  constructor(private readonly scheduler: Selector) { }

  async openRecurrenceForm(t: TestController, freq = 'Daily'): Promise<void> {
    await t.click(this.repeatEditor.element);

    const option = Selector(SELECTORS.listOption).withText(freq);
    await t.click(option);

    await t.wait(500);
  }

  async openRecurrenceSettings(t: TestController): Promise<void> {
    await t.click(this.recurrence.settingsButton);
    await t.wait(500);
  }

  async setRecurrenceInterval(t: TestController, interval: number): Promise<void> {
    await t
      .selectText(this.recurrence.repeatEveryInput)
      .typeText(this.recurrence.repeatEveryInput, interval.toString(), { replace: true });
  }

  async selectRecurrenceWeekDays(t: TestController, daysIndex: number[]): Promise<void> {
    daysIndex.forEach(async (dayIndex) => {
      const dayButton = this.recurrence.weekDayButtons.nth(dayIndex);
      await t.click(dayButton);
    });
  }

  async setRecurrenceMonthDay(t: TestController, day: number): Promise<void> {
    await t
      .selectText(this.recurrence.monthDayInput)
      .typeText(this.recurrence.monthDayInput, day.toString(), { replace: true });
  }

  async setRecurrenceYearlyMonth(t: TestController, month: string): Promise<void> {
    await t.click(this.recurrence.yearlyMonthInput);

    const option = Selector(SELECTORS.listOption).withText(month);
    await t.click(option);
  }

  async setRecurrenceYearlyDate(t: TestController, month: string, day: number): Promise<void> {
   await this.setRecurrenceYearlyMonth(t, month);
    await t
      .selectText(SELECTORS.dayOfMonthInput)
      .typeText(SELECTORS.dayOfMonthInput, day.toString(), { replace: true });
  }

  async setRecurrenceEnd(
    t: TestController,
    type: 'never' | 'count' | 'until',
    value?: number | string,
  ): Promise<void> {
    if (type === 'never') {
      const neverRadio = this.recurrence.endRadioGroup.find('.dx-radiobutton').nth(0);
      await t.click(neverRadio);
    } else if (type === 'until') {
      const untilRadio = this.recurrence.endRadioGroup.find('.dx-radiobutton').nth(1);
      await t.click(untilRadio);

      if (value !== undefined) {
        const untilEditor = this.recurrence.endInputGroup.find('[type="text"]').nth(0);
        await t
          .selectText(untilEditor)
          .typeText(untilEditor, value.toString(), { replace: true });
      }
    } else if (type === 'count') {
      const countRadio = this.recurrence.endRadioGroup.find('.dx-radiobutton').nth(2);
      await t.click(countRadio);

      if (value !== undefined) {
        const countEditor = this.recurrence.endInputGroup.find('[type="text"]').nth(1);
        await t
          .selectText(countEditor)
          .typeText(countEditor, value.toString(), { replace: true });
      }
    }
  }
}
