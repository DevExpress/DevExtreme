import { Selector } from 'testcafe';
import TooltipBase from './base';
import ListItem from './listItem';

const CLASS = {
  tooltip: 'dx-tooltip',
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  tooltipWrapper: 'dx-tooltip-wrapper',
  tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',
  mobileTooltip: '.dx-scheduler-overlay-panel > .dx-overlay-content',
};

export default class AppointmentTooltip extends TooltipBase {
  readonly mobileElement: Selector;

  readonly deleteButton: Selector;

  readonly wrapper: Selector;

  readonly element: Selector;

  constructor(scheduler: Selector) {
    super(CLASS.appointmentTooltipWrapper);

    this.element = scheduler.find(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);

    this.mobileElement = Selector(CLASS.mobileTooltip);

    this.deleteButton = Selector(`.${CLASS.tooltipDeleteButton}`);

    this.wrapper = Selector(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
  }

  getListItem(title?: string, index = 0): ListItem {
    return new ListItem(this.wrapper, title, index);
  }
}
