import type { Locator, Page } from '@playwright/test';
import Button from '../../button';
import DateBox from '../../dateBox';
import Form from '../../form/form';
import Popup from '../../popup';
import SelectBox from '../../selectBox';
import TextArea from '../../textArea';
import TextBox from '../../textBox';

export const SELECTORS = {
  appointmentPopup: '.dx-scheduler-appointment-popup.dx-popup.dx-widget',
  appointmentPopupContent: '.dx-scheduler-appointment-popup .dx-overlay-content',
  appointmentPopupToolbar: '.dx-scheduler-appointment-popup .dx-popup-title',
  form: '.dx-scheduler-form',
  doneButton: '.dx-popup-done.dx-button.dx-widget',
  cancelButton: '.dx-popup-cancel.dx-button.dx-widget',
  textEditor: '.dx-textbox.dx-widget',
  allDaySwitch: '.dx-scheduler-form-all-day-switch .dx-switch.dx-widget',
  startDateEditor: '.dx-scheduler-form-start-date-editor .dx-datebox.dx-datebox-date.dx-widget',
  startTimeEditor: '.dx-scheduler-form-start-time-editor .dx-datebox.dx-datebox-time.dx-widget',
  startTimeZoneEditor: '.dx-scheduler-form-start-date-timezone-editor .dx-selectbox.dx-widget',
  endDateEditor: '.dx-scheduler-form-end-date-editor .dx-datebox.dx-datebox-date.dx-widget',
  endTimeEditor: '.dx-scheduler-form-end-time-editor .dx-datebox.dx-datebox-time.dx-widget',
  endTimeZoneEditor: '.dx-scheduler-form-end-date-timezone-editor .dx-selectbox.dx-widget',
  repeatEditor: '.dx-scheduler-form-repeat-editor .dx-selectbox.dx-widget',
  descriptionEditor: '.dx-scheduler-form-description-editor .dx-textarea.dx-widget',
  recurrenceGroup: '.dx-scheduler-form-recurrence-group',
  backButton: '.dx-button.dx-widget[aria-label="Back"]',
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
  public readonly popup: Popup;

  public readonly contentElement: Locator;

  public readonly toolbarElement: Locator;

  public readonly saveButton: Button;

  public readonly cancelButton: Button;

  public readonly form: Form;

  public readonly textEditor: TextBox;

  public readonly allDaySwitch: Locator;

  public readonly startDateEditor: DateBox;

  public readonly startTimeEditor: DateBox;

  public readonly startTimeZoneEditor: SelectBox;

  public readonly endDateEditor: DateBox;

  public readonly endTimeEditor: DateBox;

  public readonly endTimeZoneEditor: SelectBox;

  public readonly repeatEditor: SelectBox;

  public readonly recurrenceSettingsButton: Button;

  public readonly descriptionEditor: TextArea;

  public readonly recurrence: {
    backButton: Locator;
    group: Locator;
    startDateInput: Locator;
    frequencyEditor: Locator;
    weekDayButtons: Locator;
    monthDayInput: Locator;
    yearlyMonthInput: Locator;
    endRadioGroup: Locator;
    endInputGroup: Locator;
  };

  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;

    this.popup = new Popup(page, SELECTORS.appointmentPopup);
    // The form's own dropdowns and load panels add more overlay contents once it is open; the
    // dialog is the first of them, which is the one the TestCafe selector resolved to.
    this.contentElement = page.locator(SELECTORS.appointmentPopupContent).first();
    this.toolbarElement = page.locator(SELECTORS.appointmentPopupToolbar);

    this.saveButton = new Button(page, this.toolbarElement.locator(SELECTORS.doneButton));
    this.cancelButton = new Button(page, this.toolbarElement.locator(SELECTORS.cancelButton));

    this.form = new Form(page, this.contentElement.locator(SELECTORS.form));

    // TestCafe selectors resolved to their first match; a Locator has to say so explicitly.
    this.textEditor = new TextBox(page, this.contentElement.locator(SELECTORS.textEditor).first());

    this.allDaySwitch = this.contentElement.locator(SELECTORS.allDaySwitch);

    this.startDateEditor = new DateBox(
      page,
      this.contentElement.locator(SELECTORS.startDateEditor),
    );
    this.startTimeEditor = new DateBox(
      page,
      this.contentElement.locator(SELECTORS.startTimeEditor),
    );
    this.startTimeZoneEditor = new SelectBox(
      page,
      this.contentElement.locator(SELECTORS.startTimeZoneEditor),
    );

    this.endDateEditor = new DateBox(page, this.contentElement.locator(SELECTORS.endDateEditor));
    this.endTimeEditor = new DateBox(page, this.contentElement.locator(SELECTORS.endTimeEditor));
    this.endTimeZoneEditor = new SelectBox(
      page,
      this.contentElement.locator(SELECTORS.endTimeZoneEditor),
    );

    this.repeatEditor = new SelectBox(page, this.contentElement.locator(SELECTORS.repeatEditor));
    this.recurrenceSettingsButton = new Button(
      page,
      this.repeatEditor.element.locator(SELECTORS.recurrenceSettingsButton),
    );

    this.descriptionEditor = new TextArea(
      page,
      this.contentElement.locator(SELECTORS.descriptionEditor),
    );

    this.recurrence = {
      backButton: page.locator(SELECTORS.backButton),
      group: page.locator(SELECTORS.recurrenceGroup),
      startDateInput: page.locator(SELECTORS.recurrenceStartDateInput),
      frequencyEditor: page.locator(SELECTORS.recurrenceFrequencyEditor),
      weekDayButtons: page.locator(SELECTORS.weekDayButtons),
      monthDayInput: page.locator(SELECTORS.monthDayInput),
      yearlyMonthInput: page.locator(SELECTORS.yearlyMonthInput),
      endRadioGroup: page.locator(SELECTORS.recurrenceEndRadioGroup),
      endInputGroup: page.locator(SELECTORS.recurrenceEndInputGroup),
    };
  }

  public async selectRepeatValue(freq = 'Daily'): Promise<void> {
    await this.repeatEditor.element.click();

    await this.page.locator(SELECTORS.listItem).filter({ hasText: freq }).first()
      .click();

    await this.page.waitForTimeout(500);
  }

  public async clickRecurrenceSettingsButton(): Promise<void> {
    await this.recurrenceSettingsButton.element.click();

    await this.page.waitForTimeout(500);
  }
}
