import { Selector, ClientFunction } from 'testcafe';
import AppointmentTooltipListItem from './listItem';

const CLASS = {
    appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
    stateInvisible: 'dx-state-invisible',
    tooltip: 'dx-tooltip',
    tooltipWrapper: 'dx-tooltip-wrapper',
    tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',
};

export default class AppointmentTooltip {
    element: Selector;
    deleteElement: Selector;
    wrapper: Selector;

    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);
        this.deleteElement = Selector(`.${CLASS.tooltipDeleteButton}`);
        this.wrapper = Selector(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
    }

    getListItem(title: string, index: number = 0): AppointmentTooltipListItem {
        return new AppointmentTooltipListItem(this.wrapper, title, index);
    }

    isVisible(): Promise<boolean> {
        const { element } = this;
        const invisibleStateClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(element()).hasClass(invisibleStateClass), {
            dependencies: { element, invisibleStateClass }
        })();
    }
}
