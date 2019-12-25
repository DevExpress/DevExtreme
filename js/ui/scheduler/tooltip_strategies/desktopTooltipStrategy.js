import { TooltipStrategyBase } from './tooltipStrategyBase';
import Tooltip from '../../tooltip';
import { touch } from '../../../core/utils/support';

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = 'dx-scheduler-appointment-tooltip-wrapper';
const MAX_TOOLTIP_HEIGHT = 200;

export class DesktopTooltipStrategy extends TooltipStrategyBase {
    constructor(options) {
        super(options);
        this._skipHidingOnScroll = false;
    }

    _showCore(target, dataList) {
        super._showCore(target, dataList);
        this._tooltip.option('position', {
            my: 'bottom',
            at: 'top',
            boundary: this._getBoundary(dataList),
            offset: this._extraOptions.offset,
            collision: 'fit flipfit',
        });
    }

    _getBoundary(dataList) {
        return this._options.isAppointmentInAllDayPanel(dataList[0].data) ? this._options.container : this._options.getScrollableContainer();
    }

    _onShown() {
        super._onShown();
        if(this._extraOptions.isButtonClick) {
            this._list.focus();
            this._list.option('focusedElement', null);
        }
    }

    _createListOption(target, dataList) {
        const result = super._createListOption(target, dataList);
        // TODO:T724287 this condition is not covered by tests, because touch variable cannot be overridden.
        // In the future, it is necessary to cover the tests
        result.showScrollbar = touch ? 'always' : 'onHover';
        return result;
    }

    _createTooltip(target, dataList) {
        var tooltip = this._createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);

        return this._options.createComponent(tooltip, Tooltip, {
            target: target,
            onShowing: this._onTooltipShowing.bind(this),
            closeOnTargetScroll: () => this._skipHidingOnScroll,
            maxHeight: MAX_TOOLTIP_HEIGHT,
            rtlEnabled: this._extraOptions.rtlEnabled,
            onShown: this._onShown.bind(this),
            contentTemplate: this._getContentTemplate(dataList)
        });
    }

    _onListRender(e) {
        return this._extraOptions.dragBehavior && this._extraOptions.dragBehavior(e);
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
