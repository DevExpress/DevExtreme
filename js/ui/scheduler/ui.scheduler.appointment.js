var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    translator = require("../../animation/translator"),
    recurrenceUtils = require("./utils.recurrence"),
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    tooltip = require("../tooltip/ui.tooltip"),
    publisherMixin = require("./ui.scheduler.publisher_mixin"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    DOMComponent = require("../../core/dom_component"),
    Resizable = require("../resizable"),
    messageLocalization = require("../../localization/message"),
    dateLocalization = require("../../localization/date");

var REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME = eventUtils.addNamespace(pointerEvents.enter, "dxSchedulerAppointment"),
    REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME = eventUtils.addNamespace(pointerEvents.leave, "dxSchedulerAppointment");

var EMPTY_APPOINTMENT_CLASS = "dx-scheduler-appointment-empty",

    APPOINTMENT_ALL_DAY_ITEM_CLASS = "dx-scheduler-all-day-appointment",
    DIRECTION_APPOINTMENT_CLASSES = {
        horizontal: "dx-scheduler-appointment-horizontal",
        vertical: "dx-scheduler-appointment-vertical"
    },

    RECURRENCE_APPOINTMENT_CLASS = "dx-scheduler-appointment-recurrence",
    COMPACT_APPOINTMENT_CLASS = "dx-scheduler-appointment-compact",

    REDUCED_APPOINTMENT_CLASS = "dx-scheduler-appointment-reduced",
    REDUCED_APPOINTMENT_ICON = "dx-scheduler-appointment-reduced-icon",
    REDUCED_APPOINTMENT_PARTS_CLASSES = {
        head: "dx-scheduler-appointment-head",
        body: "dx-scheduler-appointment-body",
        tail: "dx-scheduler-appointment-tail"
    };

var Appointment = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            data: {},
            geometry: { top: 0, left: 0, width: 0, height: 0 },
            allowDrag: true,
            allowResize: true,
            reduced: null,
            isCompact: false,
            direction: "vertical",
            resizableConfig: {},
            cellHeight: 0,
            cellWidth: 0
        });
    },


    _optionChanged: function(args) {
        switch(args.name) {
            case "data":
            case "geometry":
            case "allowDrag":
            case "allowResize":
            case "reduced":
            case "sortedIndex":
            case "isCompact":
            case "direction":
            case "resizableConfig":
            case "cellHeight":
            case "cellWidth":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _resizingRules: {
        horizontal: function() {
            var width = this.invoke("getCellWidth"),
                step = this.invoke("getResizableStep"),
                isRTL = this.option("rtlEnabled"),
                reducedHandles = {
                    head: isRTL ? "right" : "left",
                    body: "",
                    tail: isRTL ? "left" : "right"
                },
                handles = "left right",
                reducedPart = this.option("reduced");

            if(reducedPart) {
                handles = reducedHandles[reducedPart];
            }

            return {
                handles: handles,
                minHeight: 0,
                minWidth: width,
                step: step
            };
        },
        vertical: function() {
            var height = this.invoke("getCellHeight");
            return {
                handles: "top bottom",
                minWidth: 0,
                minHeight: height,
                step: height
            };
        }
    },

    _render: function() {
        this.callBase();

        this._renderAppointmentGeometry();
        this._renderEmptyClass();
        this._renderCompactClass();
        this._renderReducedAppointment();
        this._renderAllDayClass();
        this._renderDirection();

        this.$element().data("dxAppointmentStartDate", this.option("startDate"));
        this.$element().attr("title", this.invoke("getField", "text", this.option("data")));
        this.$element().attr("role", "button");

        this._renderRecurrenceClass();
        this._renderResizable();
    },

    _renderAppointmentGeometry: function() {
        var geometry = this.option("geometry"),
            $element = this.$element();
        if(this.option("allDay")) {
            $element.css("left", geometry.left);
            translator.move($element, {
                top: geometry.top
            });
        } else {
            translator.move($element, {
                top: geometry.top,
                left: geometry.left
            });
        }

        $element.css({
            width: geometry.width < 0 ? 0 : geometry.width,
            height: geometry.height < 0 ? 0 : geometry.height
        });
    },

    _renderEmptyClass: function() {
        var geometry = this.option("geometry");

        if(geometry.empty || this.option("isCompact")) {
            this.$element().addClass(EMPTY_APPOINTMENT_CLASS);
        }
    },

    _renderReducedAppointment: function() {
        var reducedPart = this.option("reduced");

        if(!reducedPart) {
            return;
        }

        this.$element()
            .toggleClass(REDUCED_APPOINTMENT_CLASS, true)
            .toggleClass(REDUCED_APPOINTMENT_PARTS_CLASSES[reducedPart], true);

        this._renderAppointmentReducedIcon();
    },

    _renderAppointmentReducedIcon: function() {
        var $icon = $("<div>")
                .addClass(REDUCED_APPOINTMENT_ICON)
                .appendTo(this.$element()),

            endDate = this._getEndDate();
        var tooltipLabel = messageLocalization.format("dxScheduler-editorLabelEndDate"),
            tooltipText = [tooltipLabel, ": ", dateLocalization.format(endDate, "monthAndDay"), ", ", dateLocalization.format(endDate, "year")].join("");

        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME, function() {
            tooltip.show({
                target: $icon,
                content: tooltipText
            });
        });
        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME, function() {
            tooltip.hide();
        });
    },

    _getEndDate: function() {
        var result = this.invoke("getField", "endDate", this.option("data"));
        if(result) {
            return new Date(result);
        }
        return result;
    },

    _renderAllDayClass: function() {
        this.$element().toggleClass(APPOINTMENT_ALL_DAY_ITEM_CLASS, !!this.option("allDay"));
    },

    _renderRecurrenceClass: function() {
        var rule = this.invoke("getField", "recurrenceRule", this.option("data"));

        if(recurrenceUtils.getRecurrenceRule(rule).isValid) {
            this.$element().addClass(RECURRENCE_APPOINTMENT_CLASS);
        }
    },

    _renderCompactClass: function() {
        this.$element().toggleClass(COMPACT_APPOINTMENT_CLASS, !!this.option("isCompact"));
    },

    _renderDirection: function() {
        this.$element().addClass(DIRECTION_APPOINTMENT_CLASSES[this.option("direction")]);
    },

    _renderResizable: function() {
        if(!this.option("allowResize") || this.option("isCompact")) {
            return;
        }

        var config = this._resizingRules[this.option("direction")].apply(this);

        if(!this.invoke("isGroupedByDate")) {
            config.stepPrecision = "strict";
        }
        this._createComponent(this.$element(), Resizable, extend(config, this.option("resizableConfig")));
    }

}).include(publisherMixin);

registerComponent("dxSchedulerAppointment", Appointment);

module.exports = Appointment;
