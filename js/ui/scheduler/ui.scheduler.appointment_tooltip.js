var $ = require("../../core/renderer"),
    Tooltip = require("../tooltip"),
    tooltip = require("../tooltip/ui.tooltip"),
    Button = require("../button"),
    FunctionTemplate = require("../widget/function_template"),
    dateUtils = require("../../core/utils/date");

var APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper",
    APPOINTMENT_TOOLTIP_CLASS = "dx-scheduler-appointment-tooltip",
    APPOINTMENT_TOOLTIP_TITLE_CLASS = "dx-scheduler-appointment-tooltip-title",
    APPOINTMENT_TOOLTIP_DATE_CLASS = "dx-scheduler-appointment-tooltip-date",
    APPOINTMENT_TOOLTIP_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-buttons",
    APPOINTMENT_TOOLTIP_OPEN_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-open-button",
    APPOINTMENT_TOOLTIP_CLOSE_BUTTON_CLASS = "dx-scheduler-appointment-tooltip-close-button",
    APPOINTMENT_TOOLTIP_DELETE_BUTTONS_CLASS = "dx-scheduler-appointment-tooltip-delete-button";

var appointmentTooltip = {
    show: function(appointmentData, singleAppointmentData, $appointment, instance) {

        if(this._tooltip) {
            if(this._tooltip.option("visible") && $(this._tooltip.option("target")).get(0) === $($appointment).get(0)) {
                return;
            }
        }

        this.instance = instance;

        this._initDynamicTemplate(appointmentData, singleAppointmentData, $appointment);

        var template = instance._getAppointmentTemplate("appointmentTooltipTemplate");

        this.hide();

        this._$tooltip = $("<div>").appendTo(instance.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);

        var targetedAppointmentData = instance.fire("getTargetedAppointmentData", appointmentData, $appointment);

        this._tooltip = instance._createComponent(this._$tooltip, Tooltip, {
            visible: true,
            target: $appointment,
            rtlEnabled: instance.option("rtlEnabled"),
            contentTemplate: new FunctionTemplate(function(options) {
                return template.render({
                    model: appointmentData,
                    targetedAppointmentData: targetedAppointmentData,
                    container: options.container
                });
            }),
            position: {
                my: "bottom",
                at: "top",
                of: $appointment,
                boundary: this._isAppointmentInAllDayPanel(appointmentData) ? instance.$element() : instance.getWorkSpaceScrollableContainer(),
                collision: "fit flipfit",
                offset: this.instance.option("_appointmentTooltipOffset")
            }
        });
    },

    hide: function() {
        if(!this._$tooltip) {
            return;
        }

        this._$tooltip.remove();
        delete this._$tooltip;
        delete this._tooltip;
        tooltip.hide();
    },

    _isAppointmentInAllDayPanel: function(appointmentData) {
        var workSpace = this.instance._workSpace,
            itTakesAllDay = this.instance.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel");
    },

    _initDynamicTemplate: function(appointmentData, singleAppointmentData, $appointment) {
        var that = this;

        this.instance._defaultTemplates["appointmentTooltip"] = new FunctionTemplate(function(options) {
            var $container = $(options.container),
                $tooltip = that._tooltipContent(appointmentData, singleAppointmentData, $appointment);
            $tooltip.addClass($container.attr("class"));
            $container.replaceWith($tooltip);
            return $container;
        });
    },

    _tooltipContent: function(appointmentData, singleAppointmentData, $appointment) {
        var $tooltip = $("<div>").addClass(APPOINTMENT_TOOLTIP_CLASS);

        var isAllDay = this.instance.fire("getField", "allDay", appointmentData),
            startDate = this.instance.fire("getField", "startDate", singleAppointmentData),
            endDate = this.instance.fire("getField", "endDate", singleAppointmentData),
            text = this.instance.fire("getField", "text", appointmentData),
            startDateTimeZone = this.instance.fire("getField", "startDateTimeZone", appointmentData),
            endDateTimeZone = this.instance.fire("getField", "endDateTimeZone", appointmentData);

        startDate = this.instance.fire("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.instance.fire("convertDateByTimezone", endDate, endDateTimeZone);

        var $title = $("<div>")
            .text(text)
            .addClass(APPOINTMENT_TOOLTIP_TITLE_CLASS)
            .appendTo($tooltip);

        $("<div>")
            .addClass(APPOINTMENT_TOOLTIP_DATE_CLASS)
            .text(this._formatTooltipDate(startDate, endDate, isAllDay))
            .appendTo($tooltip);


        var $buttons = $("<div>").addClass(APPOINTMENT_TOOLTIP_BUTTONS_CLASS);

        this.instance.option("_appointmentTooltipButtonsPosition") === "top"
            ? $buttons.prependTo($tooltip)
            : $buttons.appendTo($tooltip);

        if(this.instance.option("_appointmentTooltipCloseButton")) {
            this._getCloseButton().appendTo($buttons);
        }

        if(this.instance.option("_useAppointmentColorForTooltip")) {
            this.instance.getAppointmentsInstance().notifyObserver("getAppointmentColor", {
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

        if(this.instance._editing.allowDeleting) {
            this._getDeleteButton(appointmentData, singleAppointmentData).appendTo($buttons);
        }

        this._getOpenButton(appointmentData, singleAppointmentData).appendTo($buttons);

        return $tooltip;
    },

    _formatTooltipDate: function(startDate, endDate, isAllDay) {
        var formatType = this.instance.option("currentView") !== "month" && dateUtils.sameDate(startDate, endDate) ? "TIME" : "DATETIME",
            formattedString = "";

        if(isAllDay) {
            formatType = "DATE";
        }

        this.instance.fire("formatDates", {
            startDate: startDate,
            endDate: endDate,
            formatType: formatType,
            callback: function(result) {
                formattedString = result;
            }
        });

        return formattedString;
    },

    _getDeleteButton: function(appointmentData, singleAppointmentData) {
        var button = new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_DELETE_BUTTONS_CLASS), {
            icon: "trash",
            onClick: function() {
                var startDate = this.instance._getStartDate(singleAppointmentData, true);
                this.instance._checkRecurringAppointment(appointmentData, singleAppointmentData, startDate, function() {
                    this.instance.deleteAppointment(appointmentData);
                }.bind(this), true);
                this.hide();
            }.bind(this)
        });
        return button.$element();
    },

    _getOpenButton: function(appointmentData, singleAppointmentData) {
        var that = this,
            allowUpdating = that.instance._editing.allowUpdating,
            text = this.instance.option("_appointmentTooltipOpenButtonText");

        return (new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_OPEN_BUTTON_CLASS), {
            icon: allowUpdating ? "edit" : this.instance.option("_appointmentTooltipOpenButtonIcon"),
            text: text,
            onClick: function() {
                that.instance.showAppointmentPopup(appointmentData, false, singleAppointmentData);
                that.hide();
            }
        })).$element();
    },

    _getCloseButton: function() {
        var that = this;
        return (new Button($("<div>").addClass(APPOINTMENT_TOOLTIP_CLOSE_BUTTON_CLASS), {
            icon: "close",
            onClick: function() {
                that.hide();
            }
        })).$element();
    }
};
module.exports = appointmentTooltip;
