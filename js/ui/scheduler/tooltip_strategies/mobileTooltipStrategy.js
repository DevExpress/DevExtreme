import Overlay from "../../overlay";
import { TooltipStrategyBase } from './tooltipStrategyBase';
import $ from "../../../core/renderer";
import { getWindow } from "../../../core/utils/window";

const SLIDE_PANEL_CLASS_NAME = "dx-scheduler-overlay-panel";
const MAX_OVERLAY_HEIGHT = 250;

const animationConfig = {
    show: {
        type: "slide",
        duration: 300,
        from: { position: { my: 'top', at: 'bottom', of: getWindow() } },
        to: { position: { my: 'center', at: 'center', of: getWindow() } }
    },
    hide: {
        type: "slide",
        duration: 300,
        to: { position: { my: 'top', at: 'bottom', of: getWindow() } },
        from: { position: { my: 'center', at: 'center', of: getWindow() } }
    }
};

const positionConfig = {
    my: "bottom",
    at: "bottom",
    of: getWindow()
};

export class MobileTooltipStrategy extends TooltipStrategyBase {
    _onListItemClick(e) {
        super._onListItemClick(e);
        this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData);
    }

    _shouldUseTarget() {
        return false;
    }

    _onShowing() {
        this.tooltip.option('height', 'auto');
        const height = this.list.$element().outerHeight();
        this.tooltip.option('height', height > MAX_OVERLAY_HEIGHT ? MAX_OVERLAY_HEIGHT : 'auto');
    }

    _createTooltip(target) {
        const $overlay = $("<div>").addClass(SLIDE_PANEL_CLASS_NAME).appendTo(this.scheduler.$element());
        return this.scheduler._createComponent($overlay, Overlay, {
            shading: false,
            position: positionConfig,
            animation: animationConfig,
            target: this.scheduler.$element(),
            container: this.scheduler.$element(),
            closeOnOutsideClick: true,
            width: "100%",
            height: "auto",
            onShowing: () => this._onShowing()
        });
    }
}
