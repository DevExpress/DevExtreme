import Button from "../../button";
import dateUtils from "../../../core/utils/date";
import FunctionTemplate from "../../widget/function_template";
import $ from "../../../core/renderer";
import List from "../../list/ui.list.edit";
import Tooltip from "../../tooltip";
import { extendFromObject } from "../../../core/utils/extend";

const DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment";
const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
const DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-buttons-block";
const DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button";

const DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-info-block";
const DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title";
const DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date";

const DELETE_BUTTON_SIZE = 25;

const APPOINTMENT_TOOLTIP_CLASS = "dx-scheduler-appointment-tooltip";
// APPOINTMENT_TOOLTIP_TITLE_CLASS = "dx-scheduler-appointment-tooltip-title",
// APPOINTMENT_TOOLTIP_DATE_CLASS = "dx-scheduler-appointment-tooltip-date",
// APPOINTMENT_TOOLTIP_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-buttons",
// APPOINTMENT_TOOLTIP_OPEN_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-open-button",
// APPOINTMENT_TOOLTIP_CLOSE_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-close-button",
// APPOINTMENT_TOOLTIP_DELETE_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-delete-button";

export class TooltipStrategyBase {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.showEditAppointmentPopupAction = this._createAppointmentClickAction();
    }

    show(dataItemList) {
    }

    hide() {
    }

    _createTooltip(target, list, getBoundary) {
        this.$tooltip = this._createTooltipElement();

        return this.scheduler._createComponent(this.$tooltip, Tooltip, {
            visible: true,
            target: target,
            rtlEnabled: this.scheduler.option("rtlEnabled"),
            contentTemplate: () => list.$element(),
            position: {
                my: "bottom",
                at: "top",
                of: target,
                boundary: getBoundary && getBoundary(), // TODO
                collision: "fit flipfit",
                offset: this.scheduler.option("_appointmentTooltipOffset")
            }
        });
    }

    _createList(dataItemList) {
        const $list = $("<div>");
        return this.scheduler._createComponent($list, List, {
            dataSource: dataItemList,
            onItemClick: (e) => { this._onListItemClick(e); },
            itemTemplate: (item) => this._renderTemplate(item.data, item.currentData, item.targetedData, item.$appointment)
        });
    }

    _createTooltipElement() {
        return $("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
    }

    _getTargetData(data, $appointment) {
        return this.scheduler.fire("getTargetedAppointmentData", data, $appointment);
    }

    _renderTemplate(data, currentData, $appointment) {
        this._createTemplate(data, currentData, $appointment);
        const template = this.scheduler._getAppointmentTemplate("appointmentTooltipTemplate");

        return new FunctionTemplate(options => {
            return template.render({
                model: data,
                targetedAppointmentData: this._getTargetData(data, $appointment),
                container: options.container
            });
        });
    }

    _onListItemClick(args) {
        const mappedData = this.scheduler.fire("mapAppointmentFields", args),
            result = extendFromObject(mappedData, args, false);
        this.showEditAppointmentPopupAction(result);
    }

    _createTemplate(appointmentData, singleAppointmentData, $appointment) {
        this.scheduler._defaultTemplates["appointmentTooltip"] = new FunctionTemplate(options => {
            const $container = $(options.container),
                $content = this._createTemplateContent(appointmentData, singleAppointmentData, $appointment);

            $container.replaceWith($content.addClass($container.attr("class")));
            return $container;
        });
    }

    _createTemplateContent(appointmentData, singleAppointmentData, $appointment) {
        const editing = this.scheduler.option("editing"),
            isAllDay = this.scheduler.fire("getField", "allDay", appointmentData),
            text = this.scheduler.fire("getField", "text", appointmentData),
            startDateTimeZone = this.scheduler.fire("getField", "startDateTimeZone", appointmentData),
            endDateTimeZone = this.scheduler.fire("getField", "endDateTimeZone", appointmentData),
            startDate = this.scheduler.fire("convertDateByTimezone", this.scheduler.fire("getField", "startDate", singleAppointmentData), startDateTimeZone),
            endDate = this.scheduler.fire("convertDateByTimezone", this.scheduler.fire("getField", "endDate", singleAppointmentData), endDateTimeZone);

        // const borderSide = this.scheduler.option("rtlEnabled") ? "right" : "left";

        // color && color.done((color) => {
        //     appointmentElement.css(SIDE_BORDER_COLOR_STYLES[borderSide], color);
        // });

        const $itemElement = $("<div>").addClass(APPOINTMENT_TOOLTIP_CLASS).addClass(DROPDOWN_APPOINTMENT_CLASS);
        $itemElement.append(this._createContentInfo(text, this._formatDate(startDate, endDate, isAllDay)));

        if(editing && editing.allowDeleting === true || editing === true) {
            $itemElement.append(this._createDeleteButton(appointmentData));
        }

        return $itemElement;
    }

    _createContentInfo(text, formattedDate) {
        const result = $("<div>").addClass(DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS);
        const $title = $("<div>").addClass(DROPDOWN_APPOINTMENT_TITLE_CLASS).text(text);
        const $date = $("<div>").addClass(DROPDOWN_APPOINTMENT_DATE_CLASS).text(formattedDate);

        return result.append($title).append($date);
    }

    _createDeleteButton(appointmentData) {
        const $container = $("<div>").addClass(DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS),
            $deleteButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS);

        $container.append($deleteButton);
        this.scheduler._createComponent($deleteButton, Button, {
            icon: "trash",
            height: DELETE_BUTTON_SIZE,
            width: DELETE_BUTTON_SIZE,
            onClick: (e) => {
                e.event.stopPropagation();
                this.scheduler.deleteAppointment(appointmentData);
            }
        });

        return $container;
    }

    _createAppointmentClickAction() {
        return this.scheduler._createActionByOption("onAppointmentClick", {
            afterExecute: e => {
                const config = e.args[0];
                config.event.stopPropagation();
                this.scheduler.fire("showEditAppointmentPopup", { data: config.appointmentData.data });
            }
        });
    }

    _formatDate(startDate, endDate, isAllDay) {
        let result = "";

        this.scheduler.fire("formatDates", {
            startDate: startDate,
            endDate: endDate,
            formatType: this._getTypeFormat(startDate, endDate, isAllDay),
            callback: value => { result = value; }
        });

        return result;
    }

    _getTypeFormat(startDate, endDate, isAllDay) {
        if(isAllDay) {
            return "DATE";
        }
        if(this.scheduler.option("currentView") !== "month" && dateUtils.sameDate(startDate, endDate)) {
            return "TIME";
        }
        return "DATETIME";
    }
}
