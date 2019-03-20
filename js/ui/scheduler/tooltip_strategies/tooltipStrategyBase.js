import Button from "../../button";
import dateUtils from "../../../core/utils/date";
import FunctionTemplate from "../../widget/function_template";
import $ from "../../../core/renderer";

const APPOINTMENT_TOOLTIP_CLASS = "dx-scheduler-appointment-tooltip",
    APPOINTMENT_TOOLTIP_TITLE_CLASS = "dx-scheduler-appointment-tooltip-title",
    APPOINTMENT_TOOLTIP_DATE_CLASS = "dx-scheduler-appointment-tooltip-date",
    APPOINTMENT_TOOLTIP_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-buttons",
    APPOINTMENT_TOOLTIP_OPEN_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-open-button",
    APPOINTMENT_TOOLTIP_CLOSE_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-close-button",
    APPOINTMENT_TOOLTIP_DELETE_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-delete-button";

export class TooltipStrategyBase {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    show(dataItemList) {
    }

    hide() {
    }

    _getTargetData(data, $appointment) {
        return this.scheduler.fire("getTargetedAppointmentData", data, $appointment);
    }

    _renderTemplate(data, currentData, targetedData, $appointment) {
        this._createTemplate(data, currentData, $appointment);
        const template = this.scheduler._getAppointmentTemplate("appointmentTooltipTemplate");

        return new FunctionTemplate(options => {
            return template.render({
                model: data,
                targetedAppointmentData: targetedData,
                container: options.container
            });
        });
    }

    _isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this.scheduler._workSpace,
            itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
    }

    _createTemplate(appointmentData, singleAppointmentData, $appointment) {
        this.scheduler._defaultTemplates["appointmentTooltip"] = new FunctionTemplate(options => {
            const $container = $(options.container),
                $content = this._createTemplateContent(appointmentData, singleAppointmentData, $appointment);

            $content.addClass($container.attr("class"));
            $container.replaceWith($content);
            return $container;
        });
    }

    _createTemplateContent(appointmentData, singleAppointmentData, $appointment) {
        const $content = $("<div>").addClass(APPOINTMENT_TOOLTIP_CLASS);

        let isAllDay = this.scheduler.fire("getField", "allDay", appointmentData),
            startDate = this.scheduler.fire("getField", "startDate", singleAppointmentData),
            endDate = this.scheduler.fire("getField", "endDate", singleAppointmentData),
            text = this.scheduler.fire("getField", "text", appointmentData),
            startDateTimeZone = this.scheduler.fire("getField", "startDateTimeZone", appointmentData),
            endDateTimeZone = this.scheduler.fire("getField", "endDateTimeZone", appointmentData);

        startDate = this.scheduler.fire("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.scheduler.fire("convertDateByTimezone", endDate, endDateTimeZone);

        const $title = $("<div>")
            .text(text)
            .addClass(APPOINTMENT_TOOLTIP_TITLE_CLASS)
            .appendTo($content);

        $("<div>")
            .addClass(APPOINTMENT_TOOLTIP_DATE_CLASS)
            .text(this._formatDate(startDate, endDate, isAllDay))
            .appendTo($content);


        const $buttons = $("<div>").addClass(APPOINTMENT_TOOLTIP_BUTTONS_CLASS);

        this.scheduler.option("_appointmentTooltipButtonsPosition") === "top"
            ? $buttons.prependTo($content)
            : $buttons.appendTo($content);

        if(this.scheduler.option("_appointmentTooltipCloseButton")) {
            this._createCloseButton().appendTo($buttons);
        }

        if(this.scheduler.option("_useAppointmentColorForTooltip")) {
            this.scheduler.getAppointmentsInstance().notifyObserver("getAppointmentColor", {
                itemData: appointmentData,
                groupIndex: $appointment.data("dxAppointmentSettings").groupIndex,
                callback: function(d) {
                    d.done(function(color) {
                        $title.css("backgroundColor", color);
                        $buttons.css("backgroundColor", color);
                    });
                }
            });
        }

        if(this.scheduler._editing.allowDeleting) {
            this._createDeleteButton(appointmentData, singleAppointmentData).appendTo($buttons);
        }

        this._createOpenButton(appointmentData, singleAppointmentData).appendTo($buttons);

        return $content;
    }

    _getFormatType(isAllDay, startDate, endDate) {
        if(isAllDay) {
            return "DATE";
        }
        if(this.scheduler.option("currentView") !== "month" && dateUtils.sameDate(startDate, endDate)) {
            return "TIME";
        }
        return "DATETIME";
    }

    _formatDate(startDate, endDate, isAllDay) {
        let result = "";

        this.scheduler.fire("formatDates", {
            startDate: startDate,
            endDate: endDate,
            formatType: this._getFormatType(isAllDay),
            callback: value => { result = value; }
        });

        return result;
    }

    _createDeleteButton(appointmentData, singleAppointmentData) {
        const button = new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_DELETE_BUTTONS_CLASS), {
            icon: "trash",
            onClick: () => {
                const startDate = this.scheduler._getStartDate(singleAppointmentData, true);
                this.scheduler._checkRecurringAppointment(appointmentData, singleAppointmentData, startDate, () => {
                    this.scheduler.deleteAppointment(appointmentData);
                }, true);
                this.hide();
            }
        });
        return button.$element();
    }

    _createOpenButton(appointmentData, singleAppointmentData) {
        const allowUpdating = this.scheduler._editing.allowUpdating,
            text = this.scheduler.option("_appointmentTooltipOpenButtonText");

        return new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_OPEN_BUTTON_CLASS), {
            icon: allowUpdating ? "edit" : this.scheduler.option("_appointmentTooltipOpenButtonIcon"),
            text: text,
            onClick: () => {
                this.scheduler.showAppointmentPopup(appointmentData, false, singleAppointmentData);
                this.hide();
            }
        }).$element();
    }

    _createCloseButton() {
        return new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_CLOSE_BUTTON_CLASS), {
            icon: "close",
            onClick: () => { this.hide(); }
        }).$element();
    }
}
