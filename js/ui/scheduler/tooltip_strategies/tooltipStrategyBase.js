import Button from "../../button";
import dateUtils from "../../../core/utils/date";
import FunctionTemplate from "../../widget/function_template";
import $ from "../../../core/renderer";
import List from "../../list/ui.list.edit";
import { extendFromObject } from "../../../core/utils/extend";

const TOOLTIP_APPOINTMENT_ITEM = "tooltip-appointment-item",
    TOOLTIP_APPOINTMENT_ITEM_CONTENT = TOOLTIP_APPOINTMENT_ITEM + "-content",
    TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = TOOLTIP_APPOINTMENT_ITEM + "-content-subject",
    TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = TOOLTIP_APPOINTMENT_ITEM + "-content-date",
    TOOLTIP_APPOINTMENT_ITEM_MARKER = TOOLTIP_APPOINTMENT_ITEM + "-marker",
    TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = TOOLTIP_APPOINTMENT_ITEM + "-marker-body",

    TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = TOOLTIP_APPOINTMENT_ITEM + "-delete-button-container",
    TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = TOOLTIP_APPOINTMENT_ITEM + "-delete-button";


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
            itemTemplate: (item) => this._renderTemplate(target, item.data, item.currentData || item.data, item.color)
        });
    }

    _onListItemRendered(e) {
    }

    _getTargetData(data, $appointment) {
        return this.scheduler.fire("getTargetedAppointmentData", data, $appointment);
    }

    _renderTemplate(target, data, currentData, color) {
        this._createTemplate(data, currentData, color);
        const template = this.scheduler._getAppointmentTemplate(this._getItemListTemplateName());

        return new FunctionTemplate(options => {
            return template.render({
                model: data,
                targetedAppointmentData: this._getTargetData(data, target),
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

    _createTemplate(data, currentData, color) {
        this.scheduler._defaultTemplates[this._getItemListDefaultTemplateName()] = new FunctionTemplate(options => {
            const $container = $(options.container);
            $container.append(this._createItemListContent(data, currentData, color));
            return $container;
        });
    }

    _createItemListContent(data, currentData, color) {
        const editing = this.scheduler.option("editing"),
            isAllDay = this.scheduler.fire("getField", "allDay", data),
            text = this.scheduler.fire("getField", "text", data),
            startDateTimeZone = this.scheduler.fire("getField", "startDateTimeZone", data),
            endDateTimeZone = this.scheduler.fire("getField", "endDateTimeZone", data),
            startDate = this.scheduler.fire("convertDateByTimezone", this.scheduler.fire("getField", "startDate", currentData), startDateTimeZone),
            endDate = this.scheduler.fire("convertDateByTimezone", this.scheduler.fire("getField", "endDate", currentData), endDateTimeZone);

        const $itemElement = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM);
        $itemElement.append(this._createItemListMarker(color));
        $itemElement.append(this._createItemListInfo(text, this._formatDate(startDate, endDate, isAllDay)));

        if(editing && editing.allowDeleting === true || editing === true) {
            $itemElement.append(this._createDeleteButton(data));
        }

        return $itemElement;
    }

    _createItemListMarker(color) {
        const $marker = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
        const $markerBody = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);

        $marker.append($markerBody);
        color && color.done(value => $markerBody.css("background", value));

        return $marker;
    }

    _createItemListInfo(text, formattedDate) {
        const result = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
        const $title = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(text);
        const $date = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(formattedDate);

        return result.append($title).append($date);
    }

    _createDeleteButton(data) {
        const $container = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER),
            $deleteButton = $("<div>").addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);

        $container.append($deleteButton);
        this.scheduler._createComponent($deleteButton, Button, {
            icon: "trash",
            onClick: e => {
                this._onDeleteButtonClick();
                e.event.stopPropagation();
                this.scheduler.deleteAppointment(data);
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
            callback: value => result = value
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
