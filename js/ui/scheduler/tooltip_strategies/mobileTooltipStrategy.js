import List from "../../list/ui.list.edit";
import Overlay from "../../overlay";
import { TooltipStrategyBase } from './tooltipStrategyBase';
import $ from "../../../core/renderer";
import { getWindow } from "../../../core/utils/window";

const SLIDE_PANEL_CLASS_NAME = "dx-scheduler-slide-panel";

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
    at: "bottom"
};

export class MobileTooltipStrategy extends TooltipStrategyBase {
    constructor(scheduler) {
        super(scheduler);

        this.list = this.createList();
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        const $overlay = $("<div>").addClass(SLIDE_PANEL_CLASS_NAME).appendTo(this.scheduler.$element());
        return this.scheduler._createComponent($overlay, Overlay, {
            shading: false,
            position: positionConfig,
            animation: animationConfig,
            target: this.scheduler.$element(),
            container: this.scheduler.$element(),
            closeOnOutsideClick: true,
            width: "100%",
            height: "100%",
            contentTemplate: () => this.list.$element()
        });
    }

    show(dataItemList) {
        this.list.option('dataSource', dataItemList);
        this.overlay.option("visible", true);
    }

    createList() {
        const $list = $("<div>");
        return this.scheduler._createComponent($list, List, {
            itemTemplate: (item) => this._renderTemplate(item.data, item.currentData, item.targetedData, item.$appointment)
        });
    }
}
