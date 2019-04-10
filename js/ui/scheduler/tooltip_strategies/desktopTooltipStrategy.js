import $ from "../../../core/renderer";
import { TooltipStrategyBase } from './tooltipStrategyBase';
import Tooltip from "../../tooltip";
import translator from "../../../animation/translator";
import dragEvents from "../../../events/drag";
import eventsEngine from "../../../events/core/events_engine";
import FunctionTemplate from "../../widget/function_template";
import { extendFromObject } from "../../../core/utils/extend";

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
const FAKE_APPOINTMENT_DRAG_CONTAINER = '.dx-scheduler-scrollable-fixed-content';

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

    onListItemClick(e) {
    }

    getItemListTemplateName() {
        return "appointmentTooltipTemplate";
    }

    getItemListDefaultTemplateName() {
        return "appointmentTooltip";
    }

    createFunctionTemplate(template, data, targetData, index) {
        return new FunctionTemplate(options => {
            return template.render({
                model: data,
                targetedAppointmentData: targetData,
                container: options.container
            });
        });
    }
}

class TooltipSingleAppointmentBehavior extends TooltipBehaviorBase {
    getTooltipPosition(dataList) {
        const result = super.getTooltipPosition();
        result.boundary = this._getBoundary(dataList);
        return result;
    }

    _getBoundary(dataList) {
        return this._isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer();
    }

    onListItemClick(e) {
        this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData);
    }

    _isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
    }
}

class TooltipManyAppointmentsBehavior extends TooltipBehaviorBase {
    onListItemRendered(e) {
        if(this.scheduler._allowDragging()) {
            const appData = e.itemData.data;

            eventsEngine.on(e.itemElement, dragEvents.start, (mouseEvent) => this._onAppointmentDragStart(appData, appData.settings, mouseEvent, this.scheduler._$element));
            eventsEngine.on(e.itemElement, dragEvents.move, (e) => this._onAppointmentDragMove(e, appData.allDay));
            eventsEngine.on(e.itemElement, dragEvents.end, () => this._onAppointmentDragEnd(appData));
        }
    }

    onListItemClick(listItemClickArg) {
        const config = {
            itemData: listItemClickArg.itemData.data,
            itemElement: listItemClickArg.itemElement
        };
        const showEditAppointmentPopupAction = this.createAppointmentClickAction();
        showEditAppointmentPopupAction(this.createClickEventArgument(config, listItemClickArg));
    }

    createAppointmentClickAction() {
        return this.scheduler._createActionByOption("onAppointmentClick", {
            afterExecute: e => {
                const config = e.args[0];
                config.event.stopPropagation();
                this.scheduler.fire("showEditAppointmentPopup", { data: config.appointmentData });
            }
        });
    }

    createClickEventArgument(config, listItemClickArg) {
        const result = extendFromObject(this.scheduler.fire("mapAppointmentFields", config), listItemClickArg, false);
        return this.trimClickEventArgument(result);
    }

    trimClickEventArgument(e) {
        delete e.itemData;
        delete e.itemIndex;
        delete e.itemElement;
        return e;
    }

    createFunctionTemplate(template, data, targetData, index) {
        return new FunctionTemplate((options) => {
            return template.render({
                model: data,
                index: index,
                container: options.container
            });
        });
    }

    getItemListTemplateName() {
        return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltipTemplate" : "dropDownAppointmentTemplate";
    }

    getItemListDefaultTemplateName() {
        return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltip" : "dropDownAppointment";
    }

    _isEmptyDropDownAppointmentTemplate() {
        return this.scheduler.option("dropDownAppointmentTemplate") === "dropDownAppointment";
    }

    _onAppointmentDragStart(itemData, settings, mouseEvent, schedulerElement) {
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
        $items.length > 0 && this._prepareDragItem($items, settings, mouseEvent, schedulerElement);

        this.scheduler.hideAppointmentTooltip();
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

    _prepareDragItem($items, settings, mouseEvent, schedulerElement) {
        const schedulerOffset = schedulerElement.find(FAKE_APPOINTMENT_DRAG_CONTAINER).offset();
        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];
        this._startPosition = {
            top: mouseEvent.pageY - schedulerOffset.top - (this._$draggedItem.height() / 2),
            left: mouseEvent.pageX - schedulerOffset.left - (this._$draggedItem.width() / 2)
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
            this.behavior = this._createBehavior(isSingleBehavior, target);
            this.hide();

            if(!this.tooltip) {
                this.list = this._createList(target, dataList);
                this.tooltip = this._createTooltip(target, this.list);
            } else {
                this.list.option("dataSource", dataList);
                this.tooltip.option("target", target);
                this.tooltip.option("visible", true);
            }

            this.list.focus();
            this.list.option("focusStateEnabled", this.scheduler.option("focusStateEnabled"));
            this.tooltip.option("position", this.behavior.getTooltipPosition(dataList));
        }
    }

    _createBehavior(isSingleBehavior, target) {
        return isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler, target)
            : new TooltipManyAppointmentsBehavior(this.scheduler, target);
    }

    _createFunctionTemplate(template, data, targetData, index) {
        return this.behavior.createFunctionTemplate(template, data, targetData, index);
    }

    _getItemListTemplateName() {
        return this.behavior.getItemListTemplateName();
    }

    _getItemListDefaultTemplateName() {
        return this.behavior.getItemListDefaultTemplateName();
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
    _onListItemClick(e) {
        super._onListItemClick(e);
        this.behavior.onListItemClick(e);
    }

    hide() {
        if(this.tooltip) {
            this.tooltip.option("visible", false);
        }
    }
}
