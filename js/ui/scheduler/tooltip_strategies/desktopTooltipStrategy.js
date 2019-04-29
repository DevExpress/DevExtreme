import $ from "../../../core/renderer";
import { TooltipStrategyBase, createDefaultTooltipTemplate } from './tooltipStrategyBase';
import Tooltip from "../../tooltip";
import translator from "../../../animation/translator";
import dragEvents from "../../../events/drag";
import eventsEngine from "../../../events/core/events_engine";
import FunctionTemplate from "../../widget/function_template";
import { extendFromObject } from "../../../core/utils/extend";

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
const ALL_DAY_PANEL_APPOINTMENT_CLASS = 'dx-scheduler-all-day-appointment';
const SCROLLABLE_WRAPPER_CLASS_NAME = '.dx-scheduler-date-table-scrollable .dx-scrollable-wrapper';

const MAX_TOOLTIP_HEIGHT = 200;

class TooltipBehaviorBase {
    constructor(scheduler, target) {
        this.scheduler = scheduler;
        this.target = target;
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
        return createDefaultTooltipTemplate(template, data, targetData, index);
    }
}

class TooltipSingleAppointmentBehavior extends TooltipBehaviorBase {
    onListItemClick(e) {
        this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData);
    }
}

class TooltipManyAppointmentsBehavior extends TooltipBehaviorBase {
    onListItemRendered(e) {
        if(this.scheduler._allowDragging()) {
            const appData = e.itemData.data;

            eventsEngine.on(e.itemElement, dragEvents.start, (e) => this._onAppointmentDragStart(appData, appData.settings, e));
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
        if(this._isEmptyDropDownAppointmentTemplate()) {
            return super.createFunctionTemplate(template, data, targetData, index);
        }
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

    _onAppointmentDragStart(itemData, settings, eventArgs) {
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
        $items.length > 0 && this._prepareDragItem($items, settings, eventArgs);

        this.scheduler.hideAppointmentTooltip();
    }

    _onAppointmentDragMove(eventArgs, allDay) {
        let coordinates = {
            left: this._startPosition.left + eventArgs.offset.x,
            top: this._startPosition.top + eventArgs.offset.y
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

    _prepareDragItem($items, settings, eventArgs) {
        const dragContainerOffset = this._getDragContainerOffset();
        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];
        const scrollTop = this._$draggedItem.hasClass(ALL_DAY_PANEL_APPOINTMENT_CLASS)
            ? this.scheduler._workSpace.getAllDayHeight()
            : this.scheduler._workSpace.getScrollableScrollTop();
        this._startPosition = {
            top: eventArgs.pageY - dragContainerOffset.top - (this._$draggedItem.height() / 2) + scrollTop,
            left: eventArgs.pageX - dragContainerOffset.left - (this._$draggedItem.width() / 2)
        };
        translator.move(this._$draggedItem, this._startPosition);
        eventsEngine.trigger(this._$draggedItem, dragEvents.start);
    }

    _getDragContainerOffset() {
        return this.scheduler._$element.find(SCROLLABLE_WRAPPER_CLASS_NAME).offset();
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
    _showCore(target, dataList, isSingleBehavior) {
        this.behavior = this._createBehavior(isSingleBehavior, target);
        super._showCore(target, dataList, isSingleBehavior);
        this.tooltip.option("position", this._getTooltipPosition(dataList));
        this.list.focus();
        this.list.option("focusedElement", null);
    }

    _createBehavior(isSingleBehavior, target) {
        return isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler, target)
            : new TooltipManyAppointmentsBehavior(this.scheduler, target);
    }

    _getTooltipPosition(dataList) {
        return {
            my: "bottom",
            at: "top",
            of: this.target,
            collision: "fit flipfit",
            boundary: this._getBoundary(dataList),
            offset: this.scheduler.option("_appointmentTooltipOffset")
        };
    }

    _getBoundary(dataList) {
        return this._isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer();
    }

    _isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
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
            target: target,
            maxHeight: MAX_TOOLTIP_HEIGHT,
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

    _onListItemClick(e) {
        super._onListItemClick(e);
        this.behavior.onListItemClick(e);
    }
}
