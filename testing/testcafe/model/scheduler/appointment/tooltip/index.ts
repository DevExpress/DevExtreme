import { Selector, ClientFunction } from 'testcafe';
import AppointmentTooltipListItem from './listItem';

const CLASS = {
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  stateInvisible: 'dx-state-invisible',
  tooltip: 'dx-tooltip',
  tooltipWrapper: 'dx-tooltip-wrapper',
  tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',

  mobileTooltip: '.dx-scheduler-overlay-panel > .dx-overlay-content',
};

export default class AppointmentTooltip {
  element: Selector;

  mobileElement: Selector;

  deleteElement: Selector;

  wrapper: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);
    this.mobileElement = Selector(CLASS.mobileTooltip);

    this.deleteElement = Selector(`.${CLASS.tooltipDeleteButton}`);
    this.wrapper = Selector(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
  }

  getListItem(title: string, index = 0): AppointmentTooltipListItem {
    return new AppointmentTooltipListItem(this.wrapper, title, index);
  }

  isVisible(): Promise<boolean> {
    const { element } = this;
    const invisibleStateClass = CLASS.stateInvisible;

    return ClientFunction(() => !$(element()).hasClass(invisibleStateClass), {
      dependencies: { element, invisibleStateClass },
    })();
  }
}
