import { Selector, ClientFunction } from 'testcafe';
import Switch from '../../switch/switch';

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

interface ISchedulerPopupExpr {
  subject?: string;
  startDate?: string;
  startDateTimeZone?: string;
  endDate?: string;
  endDateTimeZone?: string;
  description?: string;
}

const defaultExpr: Required<ISchedulerPopupExpr> = {
  subject: 'text',
  startDate: 'startDate',
  startDateTimeZone: 'startDateTimeZone',
  endDate: 'endDate',
  endDateTimeZone: 'endDateTimeZone',
  description: 'description',
};

export default class AppointmentPopup {
  element: Selector;

  wrapper: Selector;

  subjectElement: Selector;

  descriptionElement: Selector;

  startDateElement: Selector;

  startDateTimeZoneElement: Selector;

  endDateElement: Selector;

  endDateTimeZoneElement: Selector;

  doneButton: Selector;

  cancelButton: Selector;

  allDay: Switch;

  recurrenceElement: Selector;

  freqElement: Selector;

  endRepeatDateElement: Selector;

  repeatEveryElement: Selector;

  fullScreen: Promise<boolean>;

  private readonly expr = defaultExpr;

  private readonly inputElements: Selector;

  constructor(scheduler: Selector, expr?: ISchedulerPopupExpr) {
    this.expr = { ...defaultExpr, ...expr };

    this.element = scheduler.find(`.${CLASS.popup}.${CLASS.appointmentPopup}`);
    this.wrapper = Selector(`.${CLASS.popupWrapper}.${CLASS.appointmentPopup}`);
    this.inputElements = this.wrapper.find('.dx-texteditor-input');

    this.subjectElement = this.inputElements.withAttribute('id', new RegExp(this.expr.subject));
    this.startDateElement = this.inputElements.withAttribute('id', new RegExp(this.expr.startDate));
    this.startDateTimeZoneElement = this.inputElements.withAttribute('id', new RegExp(this.expr.startDateTimeZone));
    this.endDateElement = this.inputElements.withAttribute('id', new RegExp(this.expr.endDate));
    this.endDateTimeZoneElement = this.inputElements.withAttribute('id', new RegExp(this.expr.endDateTimeZone));
    this.descriptionElement = this.inputElements.withAttribute('id', new RegExp(this.expr.description));

    this.allDay = new Switch(this.wrapper.find('.dx-switch').nth(0));
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
