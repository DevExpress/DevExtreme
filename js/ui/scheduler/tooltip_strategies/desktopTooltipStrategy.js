import { TooltipStrategyBase } from './tooltipStrategyBase';
import Tooltip from '../../tooltip';
import { touch } from '../../../core/utils/support';

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = 'dx-scheduler-appointment-tooltip-wrapper';
const MAX_TOOLTIP_HEIGHT = 200;

export class DesktopTooltipStrategy extends TooltipStrategyBase {
    constructor(scheduler) {
        super(scheduler);
        this._skipHidingOnScroll = false;
    }

    _showCore(target, dataList) {
        super._showCore(target, dataList);
        this.tooltip.option('position', this._getTooltipPosition(dataList));
    }

    _onShown() {
        super._onShown();
        this._list.focus();
        this._list.option('focusedElement', null);
    }

    _getTooltipPosition(dataList) {
        return {
            my: 'bottom',
            at: 'top',
            of: this.target,
            collision: 'fit flipfit',
            boundary: this._getBoundary(dataList),
            offset: this.scheduler.option('_appointmentTooltipOffset')
        };
    }

    _getBoundary(dataList) {
        return this._isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer();
    }

    _isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option('showAllDayPanel');
    }

    _createListOption(target, dataList) {
        const result = super._createListOption(target, dataList);
        // TODO:T724287 this condition is not covered by tests, because touch variable cannot be overridden.
        // In the future, it is necessary to cover the tests
        result.showScrollbar = touch ? 'always' : 'onHover';
        return result;
    }

    _createTooltip(target, dataList) {
        this.$tooltip = this._createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);

        return this.scheduler._createComponent(this.$tooltip, Tooltip, {
            target: target,
            onShowing: this._onTooltipShowing.bind(this),
            closeOnTargetScroll: () => this._skipHidingOnScroll,
            maxHeight: MAX_TOOLTIP_HEIGHT,
            rtlEnabled: this.scheduler.option('rtlEnabled'),
            onShown: this._onShown.bind(this),
            contentTemplate: this._getContentTemplate(dataList)
        });
    }

    dispose() {
        clearTimeout(this._skipHidingOnScrollTimeId);
    }

    _onTooltipShowing() {
        clearTimeout(this._skipHidingOnScrollTimeId);

        this._skipHidingOnScroll = true;
        this._skipHidingOnScrollTimeId = setTimeout(() => {
            this._skipHidingOnScroll = false;
            clearTimeout(this._skipHidingOnScrollTimeId);
        }, 0);
    }
}
