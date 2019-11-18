import $ from "../../../core/renderer";
import { TooltipStrategyBase, createDefaultTooltipTemplate } from './tooltipStrategyBase';
import Tooltip from "../../tooltip";
import translator from "../../../animation/translator";
import { FunctionTemplate } from "../../../core/templates/function_template";
import { touch } from "../../../core/utils/support";

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
const MAX_TOOLTIP_HEIGHT = 200;

const LIST_ITEM_DATA_KEY = "dxListItemData";

const FIXED_CONTAINER_CLASS = "dx-scheduler-fixed-appointments";
const LIST_ITEM_CLASS = "dx-list-item";

class TooltipBehaviorBase {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    onListRendered(e) {
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

    canRaiseClickEvent() {
        return false;
    }
}

class TooltipManyAppointmentsBehavior extends TooltipBehaviorBase {
    constructor(scheduler, isAllDay) {
        super(scheduler);
        this.state = {
            isAllDay: isAllDay,
            appointment: null,
            initPosition: {}
        };
    }

    onListRendered(e) {
        let dragElement,
            $element = $(e.element);

        if(this.scheduler._allowDragging()) {
            const dragBehavior = this._getWorkspaceInstance().dragBehavior;

            dragBehavior && dragBehavior.addTo($element, {
                filter: `.${LIST_ITEM_CLASS}`,
                container: this.scheduler.$element().find(`.${FIXED_CONTAINER_CLASS}`),
                cursorOffset: () => {
                    const $dragElement = $(dragElement);

                    return {
                        x: $dragElement.width() / 2,
                        y: $dragElement.height() / 2
                    };
                },
                dragTemplate: () => {
                    return dragElement;
                },
                onDragStart: (e) => {
                    const event = e.event,
                        itemData = $(e.itemElement).data(LIST_ITEM_DATA_KEY);

                    if(itemData) {
                        event.data = event.data || {};
                        event.data.itemElement = dragElement = this._createDragAppointment(itemData.data, itemData.data.settings);

                        dragBehavior.initialPosition = translator.locate($(dragElement));
                        translator.resetPosition($(dragElement));

                        this.scheduler.hideAppointmentTooltip();
                    }
                }
            });
        }
    }

    canRaiseClickEvent() {
        return true;
    }

    createFunctionTemplate(template, data, targetData, index) {
        if(this._isEmptyDropDownAppointmentTemplate()) {
            return super.createFunctionTemplate(template, data, targetData, index);
        }
        return new FunctionTemplate(options => {
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
        return this.scheduler.option().dropDownAppointmentTemplate === "dropDownAppointment";
    }

    _getAppointmentsInstance() {
        return this.scheduler.getAppointmentsInstance();
    }

    _getWorkspaceInstance() {
        return this.scheduler.getWorkSpace();
    }

    _createDragAppointment(itemData, settings) {
        const appointments = this._getAppointmentsInstance();
        const appointmentIndex = appointments.option("items").length;

        settings[0].isCompact = false;
        settings[0].virtual = false;

        appointments._currentAppointmentSettings = settings;
        appointments._renderItem(appointmentIndex, {
            itemData: itemData,
            settings: settings
        });

        const appointmentList = appointments._findItemElementByItem(itemData);
        return appointmentList.length > 1 ? this._getRecurrencePart(appointmentList, settings[0].startDate) : appointmentList[0];
    }

    _getRecurrencePart(appointments, startDate) {
        return appointments.some(appointment => {
            const appointmentStartDate = appointment.data("dxAppointmentStartDate");
            return appointmentStartDate.getTime() === startDate.getTime();
        });
    }

    _createInitPosition(appointment, mousePosition) {
        const dragAndDropContainer = appointment.parent().get(0);
        const dragAndDropContainerRect = dragAndDropContainer.getBoundingClientRect();

        return {
            top: mousePosition.top - dragAndDropContainerRect.top - appointment.height() / 2,
            left: mousePosition.left - dragAndDropContainerRect.left - appointment.width() / 2
        };
    }
}

export class DesktopTooltipStrategy extends TooltipStrategyBase {
    constructor(scheduler) {
        super(scheduler);
        this.skipHidingOnScroll = false;
        this.isSingleBehavior = false;
    }

    _showCore(target, dataList, isSingleBehavior) {
        this.isSingleBehavior = isSingleBehavior;
        this.behavior = this._createBehavior(isSingleBehavior);
        super._showCore(target, dataList, isSingleBehavior);
        this.tooltip.option("position", this._getTooltipPosition(dataList));
    }

    _onShown() {
        super._onShown();
        if(!this.isSingleBehavior) {
            this.list.focus();
            this.list.option("focusedElement", null);
        }
    }

    _createBehavior(isSingleBehavior) {
        return isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler)
            : new TooltipManyAppointmentsBehavior(this.scheduler);
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

    _createListOption(target, dataList) {
        const result = super._createListOption(target, dataList);
        // TODO:T724287 this condition is not covered by tests, because touch variable cannot be overridden.
        // In the future, it is necessary to cover the tests
        result.showScrollbar = touch ? "always" : "onHover";
        return result;
    }

    _createTooltip(target) {
        this.$tooltip = this._createTooltipElement();

        return this.scheduler._createComponent(this.$tooltip, Tooltip, {
            target: target,
            onShowing: this._onTooltipShowing.bind(this),
            closeOnTargetScroll: () => this.skipHidingOnScroll,
            maxHeight: MAX_TOOLTIP_HEIGHT,
            rtlEnabled: this.scheduler.option("rtlEnabled")
        });
    }

    dispose() {
        clearTimeout(this.skipHidingOnScrollTimeId);
    }

    _onTooltipShowing() {
        clearTimeout(this.skipHidingOnScrollTimeId);

        this.skipHidingOnScroll = true;
        this.skipHidingOnScrollTimeId = setTimeout(() => {
            this.skipHidingOnScroll = false;
            clearTimeout(this.skipHidingOnScrollTimeId);
        }, 0);
    }

    _createTooltipElement() {
        return $("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
    }

    _onListRendered(e) {
        this.behavior.onListRendered(e);
    }

    _canRaiseClickEvent() {
        return this.behavior.canRaiseClickEvent();
    }
}
