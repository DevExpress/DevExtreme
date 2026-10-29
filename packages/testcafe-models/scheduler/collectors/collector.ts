import { ClientFunction } from 'testcafe';

export const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
  stateFocused: 'dx-state-focused',
  compact: 'dx-scheduler-appointment-collector-compact',
};

export default class AppointmentCollector {
  readonly element: Selector;

  constructor(scheduler: Selector, index = 0, title?: string) {
    const element = scheduler.find(`.${CLASS.appointmentCollector}`);
    this.element = (title ? element.withText(title) : element).nth(index);
  }

  get isFocused(): Promise<boolean> {
    return this.element.hasClass(CLASS.stateFocused);
  }

  get isCompact(): Promise<boolean> {
    return this.element.hasClass(CLASS.compact);
  }

  // the pointer events are dispatched synchronously: a mouseup that arrives
  // more than 750ms after mousedown starts the hold gesture of the appointment
  // collection, which cancels the click of the collector button
  click(): Promise<void> {
    const { element: getElement } = this;

    return ClientFunction(() => {
      const element = getElement() as unknown as HTMLElement;

      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      const {
        left, top, width, height,
      } = element.getBoundingClientRect();
      const options = {
        bubbles: true,
        cancelable: true,
        clientX: left + width / 2,
        clientY: top + height / 2,
        button: 0,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
      };

      element.dispatchEvent(new PointerEvent('pointerdown', { ...options, buttons: 1 }));
      element.dispatchEvent(new MouseEvent('mousedown', { ...options, buttons: 1 }));
      element.focus();
      element.dispatchEvent(new PointerEvent('pointerup', options));
      element.dispatchEvent(new MouseEvent('mouseup', options));
      element.dispatchEvent(new MouseEvent('click', options));
    }, {
      dependencies: { getElement },
    })();
  }
}
