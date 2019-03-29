import $ from "../../../core/renderer";
import Tooltip from "../../tooltip";
import tooltip from "../../tooltip/ui.tooltip";
import { TooltipStrategyBase } from './tooltipStrategyBase';

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";

export class DesktopTooltipStrategy extends TooltipStrategyBase {

    show(itemList) {
        const item = itemList[0];
        if(!item || this.tooltip && this.tooltip.option("visible") && $(this.tooltip.option("target")).get(0) === $(item.$appointment).get(0)) {
            return;
        }

        this.hide();

        this.$tooltip = $("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
        this.tooltip = this.scheduler._createComponent(this.$tooltip, Tooltip, {
            visible: true,
            target: item.$appointment,
            rtlEnabled: this.scheduler.option("rtlEnabled"),
            contentTemplate: this._renderTemplate(item.data, item.currentData, item.$appointment),
            position: {
                my: "bottom",
                at: "top",
                of: item.$appointment,
                boundary: this._isAppointmentInAllDayPanel(item.data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer(),
                collision: "fit flipfit",
                offset: this.scheduler.option("_appointmentTooltipOffset")
            }
        });
    }

    hide() {
        if(this.$tooltip) {
            this.$tooltip.remove();
            delete this.$tooltip;
            delete this.tooltip;
            tooltip.hide();
        }
    }
}
