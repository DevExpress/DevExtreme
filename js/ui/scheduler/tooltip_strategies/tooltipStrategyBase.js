import Button from "../../button";
import dateUtils from "../../../core/utils/date";
import FunctionTemplate from "../../widget/function_template";
import $ from "../../../core/renderer";
import List from "../../list/ui.list.edit";
import { extendFromObject } from "../../../core/utils/extend";

const DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment";
const DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-buttons-block";
const DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button";

const DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-info-block";
const DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title";
const DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date";

const DELETE_BUTTON_SIZE = 25;

const APPOINTMENT_TOOLTIP_CLASS = "dx-scheduler-appointment-tooltip";

export class TooltipStrategyBase {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.showEditAppointmentPopupAction = this._createAppointmentClickAction();
    }

    show(target, dataList) {
    }

    hide() {
    }

    _createTooltip(target, list) {
        return null;
    }

    _createTooltipElement() {
        return null;
    }

    _createList(target, dataList) {
        const $list = $("<div>");
        return this.scheduler._createComponent($list, List, {
            dataSource: dataList,
            onItemRendered: (e) => { this._onListItemRendered(e); },
            onItemClick: (e) => { this._onListItemClick(e); },
            itemTemplate: (item) => this._renderTemplate(item.data, item.currentData || item.data, item.targetedData, target)
        });
    }

    _onListItemRendered(e) {
    }

    _getTargetData(data, $appointment) {
        return this.scheduler.fire("getTargetedAppointmentData", data, $appointment);
    }

    _renderTemplate(data, currentData, $appointment) {
        this._createTemplate(data, currentData, $appointment);
        const template = this.scheduler._getAppointmentTemplate(this._getItemListTemplateName());

        return new FunctionTemplate(options => {
            return template.render({
                model: data,
                targetedAppointmentData: this._getTargetData(data, $appointment),
                container: options.container
            });
        });
    }

    _getItemListTemplateName() {
        return "appointmentTooltipTemplate";
    }

    _getItemListDefaultTemplateName() {
        return "appointmentTooltip";
    }

    _onListItemClick(e) {
        const mappedData = this.scheduler.fire("mapAppointmentFields", e),
            result = extendFromObject(mappedData, e, false);
        this.showEditAppointmentPopupAction(result);
    }

    _onDeleteButtonClick() {
    }

    _createTemplate(appointmentData, singleAppointmentData, $appointment) {
        this.scheduler._defaultTemplates[this._getItemListDefaultTemplateName()] = new FunctionTemplate(options => {
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
                this._onDeleteButtonClick();
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
