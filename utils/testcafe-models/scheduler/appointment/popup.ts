import { Selector, ClientFunction } from 'testcafe';

export const CLASS = {
  appointmentPopup: 'dx-scheduler-appointment-popup',
  popup: 'dx-popup',
  popupWrapper: 'dx-popup-wrapper',
  cancelButton: 'dx-popup-cancel.dx-button',
  stateInvisible: 'dx-state-invisible',
  recurrenceEditor: 'dx-recurrence-editor',
  textEditorInput: 'dx-texteditor-input',
  overlayWrapper: 'dx-overlay-wrapper',
  fullScreen: 'dx-popup-fullscreen',
  switch: 'dx-switch',
  // e2e
  form: 'e2e-dx-scheduler-form',
  textEditor: 'e2e-dx-scheduler-form-text',
  descriptionEditor: 'e2e-dx-scheduler-form-description',
  startDateEditor: 'e2e-dx-scheduler-form-start-date',
  endDateEditor: 'e2e-dx-scheduler-form-end-date',
  startDateTimeZoneEditor: 'e2e-dx-scheduler-form-start-date-timezone',
  endDateTimeZoneEditor: 'e2e-dx-scheduler-form-end-date-timezone',
  allDaySwitch: 'e2e-dx-scheduler-form-all-day-switch',
  recurrenceSwitch: 'e2e-dx-scheduler-form-recurrence-switch',
};
export const SELECTORS = {
  textInput: `.${CLASS.textEditor} .${CLASS.textEditorInput}`,
  descriptionTextArea: `.${CLASS.descriptionEditor} .${CLASS.textEditorInput}`,
  startDateInput: `.${CLASS.startDateEditor} .${CLASS.textEditorInput}`,
  endDateInput: `.${CLASS.endDateEditor} .${CLASS.textEditorInput}`,
  startDateTimeZoneInput: `.${CLASS.startDateTimeZoneEditor} .${CLASS.textEditorInput}`,
  endDateTimeZoneInput: `.${CLASS.endDateTimeZoneEditor} .${CLASS.textEditorInput}`,
  allDaySwitch: `.${CLASS.allDaySwitch} .${CLASS.switch}`,
  recurrenceSwitch: `.${CLASS.recurrenceSwitch} .${CLASS.switch}`,
};

export default class AppointmentPopup {
  element = this.scheduler.find(`.${CLASS.popup}.${CLASS.appointmentPopup}`);

  form = Selector(`.${CLASS.form}`);

  wrapper = Selector(`.${CLASS.popupWrapper}.${CLASS.appointmentPopup}`);

  subjectElement = this.wrapper.find(SELECTORS.textInput);

  descriptionElement = this.wrapper.find(SELECTORS.descriptionTextArea);

  startDateElement = this.wrapper.find(SELECTORS.startDateInput);

  endDateElement = this.wrapper.find(SELECTORS.endDateInput);

  startDateTimeZoneElement = this.wrapper.find(SELECTORS.startDateTimeZoneInput);

  endDateTimeZoneElement = this.wrapper.find(SELECTORS.endDateTimeZoneInput);

  doneButton = this.wrapper.find('.dx-popup-done.dx-button');

  cancelButton = this.wrapper.find(`.${CLASS.cancelButton}`);

  allDayElement = this.wrapper.find(SELECTORS.allDaySwitch);

  recurrenceElement = this.wrapper.find(SELECTORS.recurrenceSwitch);

  freqElement = this.wrapper.find('.dx-recurrence-selectbox-freq .dx-selectbox');

  endRepeatDateElement = this.wrapper.find(`.${CLASS.recurrenceEditor} .${CLASS.textEditorInput}`).nth(2);

  repeatEveryElement = this.wrapper.find(`.${CLASS.recurrenceEditor} .${CLASS.textEditorInput}`).nth(1);

  fullScreen = this.wrapper.find(`.${CLASS.overlayWrapper} .${CLASS.fullScreen}`).exists;

  constructor(private readonly scheduler: Selector) {
  }

  isVisible(): Promise<boolean> {
    const { element } = this;
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => !(element() as any).classList.contains(invisibleStateClass), {
      dependencies: { element, invisibleStateClass },
    })();
  }

  getAllDaySwitchValue(): Promise<string | undefined> {
    return this.allDayElement.find('input[type="hidden"]').value;
  }

  getRecurrenceRuleSwitchValue(): Promise<string | undefined> {
    return this.recurrenceElement.find('input[type="hidden"]').value;
  }
}
