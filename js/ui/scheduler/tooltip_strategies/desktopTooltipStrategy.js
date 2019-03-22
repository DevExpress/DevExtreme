import $ from "../../../core/renderer";
import tooltip from "../../tooltip/ui.tooltip";
import { TooltipStrategyBase } from './tooltipStrategyBase';

export class DesktopTooltipStrategy extends TooltipStrategyBase {

    show(itemList) {
        const item = itemList[0];
        if(!item || this.tooltip && this.tooltip.option("visible") && $(this.tooltip.option("target")).get(0) === $(item.$appointment).get(0)) {
            return;
        }
        this.hide();

        this.list = this._createList(itemList);
        this.tooltip = this._createTooltip(item.$appointment, this.list, () => {
            return this._isAppointmentInAllDayPanel(item.data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer();
        });
    }

    _isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
    }

    hide() {
        if(this.$tooltip) { // TODO
            this.$tooltip.remove();
            delete this.$tooltip;
            delete this.tooltip;
            tooltip.hide();
        }
    }
}
