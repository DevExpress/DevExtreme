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
};

export default class AppointmentPopup {
  element: Selector;

  wrapper: Selector;

  subjectElement: Selector;

  descriptionElement: Selector;

  startDateElement: Selector;

  endDateElement: Selector;

  doneButton: Selector;

  cancelButton: Selector;

  allDayElement: Selector;

  recurrenceElement: Selector;

  freqElement: Selector;

  endRepeatDateElement: Selector;

  repeatEveryElement: Selector;

  fullScreen: Promise<boolean>;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.popup}.${CLASS.appointmentPopup}`);
    this.wrapper = Selector(`.${CLASS.popupWrapper}.${CLASS.appointmentPopup}`);

    this.subjectElement = this.wrapper.find('.dx-texteditor-input').nth(0);
    this.startDateElement = this.wrapper.find('.dx-texteditor-input').nth(1);
    this.endDateElement = this.wrapper.find('.dx-texteditor-input').nth(2);
    this.descriptionElement = this.wrapper.find('.dx-texteditor-input').nth(3);
    this.allDayElement = this.wrapper.find('.dx-switch').nth(0);
    this.recurrenceElement = this.wrapper.find('.dx-switch').nth(1);

    this.freqElement = this.wrapper.find('.dx-recurrence-selectbox-freq .dx-selectbox');

    this.doneButton = this.wrapper.find('.dx-popup-done.dx-button');
    this.cancelButton = this.wrapper.find(`.${CLASS.cancelButton}`);

    this.endRepeatDateElement = this.wrapper.find(`.${CLASS.recurrenceEditor} .${CLASS.textEditorInput}`).nth(2);
    this.repeatEveryElement = this.wrapper.find(`.${CLASS.recurrenceEditor} .${CLASS.textEditorInput}`).nth(1);

    this.fullScreen = this.wrapper.find(`.${CLASS.overlayWrapper} .${CLASS.fullScreen}`).exists;
  }

  isVisible(): Promise<boolean> {
    const { element } = this;
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => !(element() as any).classList.contains(invisibleStateClass), {
      dependencies: { element, invisibleStateClass },
    })();
  }
}
