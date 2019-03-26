import $ from "../../../core/renderer";
import { TooltipStrategyBase } from './tooltipStrategyBase';
import Tooltip from "../../tooltip";
import translator from "../../../animation/translator";
import dragEvents from "../../../events/drag";
import eventsEngine from "../../../events/core/events_engine";

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";

class TooltipBehaviorBase {
    constructor(scheduler, target) {
        this.scheduler = scheduler;
        this.target = target;
    }

    getTooltipPosition(dataList) {
        return {
            my: "bottom",
            at: "top",
            of: this.target,
            collision: "fit flipfit",
            offset: this.scheduler.option("_appointmentTooltipOffset")
        };
    }

    onListItemRendered(e) {

    }
}

class TooltipSingleAppointmentBehavior extends TooltipBehaviorBase {
    getTooltipPosition(dataList) {
        const result = super.getTooltipPosition();
        result.boundary = this.getBoundary(dataList);
        return result;
    }

    getBoundary(dataList) {
        return this.isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer();
    }

    isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
    }
}

class TooltipManyAppointmentsBehavior extends TooltipBehaviorBase {
    onListItemRendered(e) {
        if(this.scheduler._allowDragging()) {
            const appData = e.itemData.data;

            eventsEngine.on(e.itemElement, dragEvents.start, () => this._onAppointmentDragStart(appData, appData.settings, $(this.target)));
            eventsEngine.on(e.itemElement, dragEvents.move, (e) => this._onAppointmentDragMove(e, appData.allDay));
            eventsEngine.on(e.itemElement, dragEvents.end, () => this._onAppointmentDragEnd(appData));
        }
    }

    _onAppointmentDragStart(itemData, settings, $target) {
        this.scheduler.hideAppointmentTooltip();

        const appointmentInstance = this.scheduler.getAppointmentsInstance(),
            appointmentIndex = appointmentInstance.option("items").length;

        settings[0].isCompact = false;
        settings[0].virtual = false;

        appointmentInstance._currentAppointmentSettings = settings;
        appointmentInstance._renderItem(appointmentIndex, {
            itemData: itemData,
            settings: settings
        });

        const $items = appointmentInstance._findItemElementByItem(itemData);
        $items.length > 0 && this._prepareDragItem($target, $items, settings);
    }

    _onAppointmentDragMove(e, allDay) {
        let coordinates = {
            left: this._startPosition.left + e.offset.x,
            top: this._startPosition.top + e.offset.y
        };

        this.scheduler.getAppointmentsInstance().notifyObserver("correctAppointmentCoordinates", {
            coordinates: coordinates,
            allDay: allDay,
            isFixedContainer: false,
            callback: (result) => {
                if(result) {
                    coordinates = result;
                }
            }
        });

        translator.move(this._$draggedItem, coordinates);
    }

    _onAppointmentDragEnd(itemData) {
        eventsEngine.trigger(this._$draggedItem, dragEvents.end);
        this._removeFakeAppointmentIfDragEndOnCurrentCell(itemData);
    }

    _removeFakeAppointmentIfDragEndOnCurrentCell(itemData) {
        const appointments = this.scheduler.getAppointmentsInstance(),
            newCellIndex = this.scheduler._workSpace.getDroppableCellIndex(),
            oldCellIndex = this.scheduler._workSpace.getCellIndexByCoordinates(this._startPosition);

        newCellIndex === oldCellIndex && appointments._clearItem({ itemData: itemData });
    }

    _prepareDragItem($target, $items, settings) {
        const targetPosition = translator.locate($target);
        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];
        this._startPosition = {
            top: targetPosition.top,
            left: targetPosition.left
        };

        translator.move(this._$draggedItem, this._startPosition);
        eventsEngine.trigger(this._$draggedItem, dragEvents.start);
    }

    _getRecurrencePart(appointments, startDate) {
        let result;
        for(var i = 0; i < appointments.length; i++) {
            const $appointment = appointments[i],
                appointmentStartDate = $appointment.data("dxAppointmentStartDate");
            if(appointmentStartDate.getTime() === startDate.getTime()) {
                result = $appointment;
            }
        }
        return result;
    }
}

export class DesktopTooltipStrategy extends TooltipStrategyBase {
    show(target, dataList, isSingleBehavior) {
        if(this._canShowTooltip(target, dataList)) {
            this.behavior = isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler, target)
                : new TooltipManyAppointmentsBehavior(this.scheduler, target);
            this.hide();

            if(!this.tooltip) {
                this.list = this._createList(target, dataList);
                this.tooltip = this._createTooltip(target, this.list);
            } else {
                this.list.option("dataSource", dataList);
                this.tooltip.option("target", target);
                this.tooltip.option("visible", true);
            }

            this.tooltip.option("position", this.behavior.getTooltipPosition(dataList));
        }
    }

    _createTooltip(target, list) {
        this.$tooltip = this._createTooltipElement();

        return this.scheduler._createComponent(this.$tooltip, Tooltip, {
            visible: true,
            target: target,
            rtlEnabled: this.scheduler.option("rtlEnabled"),
            contentTemplate: () => list.$element()
        });
    }

    _createTooltipElement() {
        return $("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
    }

    _onListItemRendered(e) {
        this.behavior.onListItemRendered(e);
    }

    _canShowTooltip(target, dataList) {
        if(!dataList.length || this.tooltip && this.tooltip.option("visible") && $(this.tooltip.option("target")).get(0) === $(target).get(0)) {
            return false;
        }
        return true;
    }

    _onDeleteButtonClick() {
        this.hide();
    }

    hide() {
        if(this.tooltip) {
            this.tooltip.option("visible", false);
        }
    }
}
