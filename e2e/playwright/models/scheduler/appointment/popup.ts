import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import Button from '../../button';
import Popup from '../../popup';
import { textMatcher } from '../../internal/textMatcher';

const SELECTORS = {
  appointmentPopup: '.dx-scheduler-appointment-popup.dx-popup.dx-widget',
  content: '.dx-scheduler-appointment-popup .dx-overlay-content',
  toolbar: '.dx-scheduler-appointment-popup .dx-popup-title',
  form: '.dx-scheduler-form',
  doneButton: '.dx-popup-done.dx-button.dx-widget',
  cancelButton: '.dx-popup-cancel.dx-button.dx-widget',
  editorInput: '.dx-texteditor-input',
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
  listItem: '.dx-list-item',
};

export interface PopupEditor {
  element: Locator;
  input: Locator;
}

export default class AppointmentPopup {
  public readonly popup: Popup;

  public readonly contentElement: Locator;

  public readonly toolbarElement: Locator;

  public readonly saveButton: Button;

  public readonly cancelButton: Button;

  public readonly form: Locator;

  public readonly textEditor: PopupEditor;

  public readonly allDaySwitch: Locator;

  public readonly startDateEditor: PopupEditor;

  public readonly startTimeEditor: PopupEditor;

  public readonly startTimeZoneEditor: PopupEditor;

  public readonly endDateEditor: PopupEditor;

  public readonly endTimeEditor: PopupEditor;

  public readonly endTimeZoneEditor: PopupEditor;

  public readonly repeatEditor: PopupEditor;

  public readonly descriptionEditor: PopupEditor;

  public readonly recurrenceSettingsButton: Button;

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
    this.contentElement = page.locator(SELECTORS.content);
    this.toolbarElement = page.locator(SELECTORS.toolbar);
    this.saveButton = new Button(page, this.toolbarElement.locator(SELECTORS.doneButton));
    this.cancelButton = new Button(page, this.toolbarElement.locator(SELECTORS.cancelButton));
    this.form = this.contentElement.locator(SELECTORS.form);

    const editor = (selector: string): PopupEditor => {
      const element = this.contentElement.locator(selector);

      return { element, input: element.locator(SELECTORS.editorInput) };
    };

    this.textEditor = editor(SELECTORS.textEditor);
    this.allDaySwitch = this.contentElement.locator(SELECTORS.allDaySwitch);
    this.startDateEditor = editor(SELECTORS.startDateEditor);
    this.startTimeEditor = editor(SELECTORS.startTimeEditor);
    this.startTimeZoneEditor = editor(SELECTORS.startTimeZoneEditor);
    this.endDateEditor = editor(SELECTORS.endDateEditor);
    this.endTimeEditor = editor(SELECTORS.endTimeEditor);
    this.endTimeZoneEditor = editor(SELECTORS.endTimeZoneEditor);
    this.repeatEditor = editor(SELECTORS.repeatEditor);
    this.descriptionEditor = editor(SELECTORS.descriptionEditor);
    this.recurrenceSettingsButton = new Button(
      page,
      this.repeatEditor.element.locator(SELECTORS.recurrenceSettingsButton),
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

  public async selectRepeatValue(frequency = 'Daily'): Promise<void> {
    await this.repeatEditor.element.click();

    const item = this.page.locator(`${SELECTORS.listItem}:visible`)
      .filter({ hasText: textMatcher(frequency) })
      .first();

    await item.click();
    await expect(item).toBeHidden();
  }

  public async clickRecurrenceSettingsButton(): Promise<void> {
    await this.recurrenceSettingsButton.element.click();
    await expect(this.recurrence.group).toBeVisible();
  }
}
