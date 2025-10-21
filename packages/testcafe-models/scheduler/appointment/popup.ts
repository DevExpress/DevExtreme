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
  repeatEveryInput: '.dx-scheduler-form-recurrence-repeat-every-group [type="text"]',
  weekDayButtons: '.dx-scheduler-recurrence-byday-buttons .dx-button',
  monthDayInput: '.dx-scheduler-form-recurrence-repeat-on-monthly-group [type="text"]',
  yearlyMonthInput: '.dx-scheduler-form-recurrence-repeat-on-yearly-group [type="text"]',
  recurrenceEndRadioGroup: '.dx-scheduler-form-recurrence-end-radio',
  recurrenceEndInputGroup: '.dx-scheduler-form-recurrence-end-inputs',
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

  /**
   * Opens the recurrence form by selecting a frequency
   * @param t - TestController instance
   * @param freq - Frequency to select (e.g., 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Hourly')
   */
  async openRecurrenceForm(t: TestController, freq = 'Daily'): Promise<void> {
    await t.click(this.repeatEditor.element);

    const option = Selector(SELECTORS.listOption).withText(freq);
    await t.click(option);

    await t.wait(500);
  }

  /**
   * Opens the recurrence settings (for editing existing recurrence rules)
   * @param t - TestController instance
   */
  async openRecurrenceSettings(t: TestController): Promise<void> {
    await t.click(this.recurrence.settingsButton);
    await t.wait(500);
  }

  /**
   * Sets the repeat every interval
   * @param t - TestController instance
   * @param interval - The interval value to set
   */
  async setRecurrenceInterval(t: TestController, interval: number): Promise<void> {
    await t
      .selectText(this.recurrence.repeatEveryInput)
      .typeText(this.recurrence.repeatEveryInput, interval.toString(), { replace: true });
  }

  /**
   * Selects specific days of the week for weekly recurrence
   * @param t - TestController instance
   * @param days - Array of day names (e.g., ['Monday', 'Wednesday', 'Friday'])
   */
  async selectRecurrenceWeekDays(t: TestController, days: string[]): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const day of days) {
      const dayButton = this.recurrence.weekDayButtons.withAttribute('data-day-key', day.slice(0, 2).toUpperCase());
      await t.click(dayButton);
    }
  }

  /**
   * Sets the day of the month for monthly recurrence
   * @param t - TestController instance
   * @param day - The day of the month (1-31)
   */
  async setRecurrenceMonthDay(t: TestController, day: number): Promise<void> {
    await t
      .selectText(this.recurrence.monthDayInput)
      .typeText(this.recurrence.monthDayInput, day.toString(), { replace: true });
  }

  /**
   * Sets the month and day for yearly recurrence
   * @param t - TestController instance
   * @param month - The month (1-12)
   * @param day - The day of the month (1-31)
   */
  async setRecurrenceYearlyDate(t: TestController, month: number, day: number): Promise<void> {
    const monthEditor = this.recurrence.yearlyMonthInput.nth(0);
    const dayEditor = this.recurrence.yearlyMonthInput.nth(1);

    await t
      .selectText(monthEditor)
      .typeText(monthEditor, month.toString(), { replace: true });

    await t
      .selectText(dayEditor)
      .typeText(dayEditor, day.toString(), { replace: true });
  }

  /**
   * Sets the repeat end condition
   * @param t - TestController instance
   * @param type - The end type: 'never', 'until', or 'count'
   * @param value - The value for 'until' (date string) or 'count' (number)
   */
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
