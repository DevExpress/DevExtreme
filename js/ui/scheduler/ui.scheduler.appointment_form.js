var $ = require("../../core/renderer"),
    Form = require("../form"),
    dateSerialization = require("../../core/utils/date_serialization"),
    messageLocalization = require("../../localization/message"),
    clickEvent = require("../../events/click"),
    typeUtils = require("../../core/utils/type"),
    eventsEngine = require("../../events/core/events_engine");

require("./ui.scheduler.recurrence_editor");
require("./timezones/ui.scheduler.timezone_editor");
require("../text_area");
require("../tag_box");

var RECURRENCE_EDITOR_ITEM_CLASS = "dx-scheduler-recurrence-rule-item",
    RECURRENCE_SWITCH_EDITOR_ITEM_CLASS = "dx-scheduler-recurrence-switch-item";

var SchedulerAppointmentForm = {

    _appointmentForm: {},

    _validateAppointmentFormDate: function(editor, value, previousValue) {
        var isCorrectDate = !!value;

        if(!isCorrectDate) {
            editor.option("value", previousValue);
        }
    },

    _getAllDayStartDate: function(startDate) {
        return startDate.setHours(0, 0, 0, 0);
    },

    _getAllDayEndDate: function(startDate) {
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        return endDate;
    },

    create: function(componentCreator, $container, isReadOnly, formData) {

        this._appointmentForm = componentCreator($container, Form, {
            items: this._editors,
            readOnly: isReadOnly,
            showValidationSummary: true,
            scrollingEnabled: true,
            formData: formData
        });

        return this._appointmentForm;
    },

    prepareAppointmentFormEditors: function(allDay, dataExprs, schedulerInst) {
        var that = this;

        this._editors = [
            {
                dataField: dataExprs.textExpr,
                editorType: "dxTextBox",
                label: {
                    text: messageLocalization.format("dxScheduler-editorLabelTitle")
                }
            },
            {
                itemType: "empty"
            },
            {
                dataField: dataExprs.allDayExpr,
                editorType: "dxSwitch",
                label: {
                    text: messageLocalization.format("dxScheduler-allDay")
                },
                editorOptions: {
                    onValueChanged: function(args) {
                        var value = args.value,
                            startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr),
                            endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr);

                        if(startDateEditor && endDateEditor) {
                            startDateEditor.option("type", value ? "date" : "datetime");
                            endDateEditor.option("type", value ? "date" : "datetime");

                            if(!startDateEditor.option("value")) {
                                return;
                            }

                            var startDate = dateSerialization.deserializeDate(startDateEditor.option("value"));

                            if(value) {
                                startDateEditor.option("value", that._getAllDayStartDate(startDate));
                                endDateEditor.option("value", that._getAllDayEndDate(startDate));
                            } else {
                                startDate.setHours(schedulerInst.option("startDayHour"));
                                startDateEditor.option("value", startDate);
                                endDateEditor.option("value", schedulerInst._workSpace.calculateEndDate(dateSerialization.deserializeDate(startDateEditor.option("value"))));
                            }
                        }
                    }
                }
            },
            {
                dataField: dataExprs.startDateExpr,
                editorType: "dxDateBox",
                label: {
                    text: messageLocalization.format("dxScheduler-editorLabelStartDate")
                },
                validationRules: [{
                    type: "required"
                }],
                editorOptions: {
                    type: allDay ? "date" : "datetime",
                    width: "100%",
                    calendarOptions: {
                        firstDayOfWeek: schedulerInst.option("firstDayOfWeek")
                    },
                    onValueChanged: function(args) {
                        that._validateAppointmentFormDate(args.component, args.value, args.previousValue);

                        var value = dateSerialization.deserializeDate(args.value),
                            previousValue = dateSerialization.deserializeDate(args.previousValue),
                            endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr),
                            endValue = dateSerialization.deserializeDate(endDateEditor.option("value"));

                        if(typeUtils.isDefined(endValue) && typeUtils.isDefined(value) && endValue < value) {
                            var duration = endValue.getTime() - previousValue.getTime();
                            endDateEditor.option("value", new Date(value.getTime() + duration));
                        }
                    }
                }
            },
            {
                dataField: dataExprs.startDateTimeZoneExpr,
                editorType: "dxSchedulerTimezoneEditor",
                label: {
                    text: " ",
                    showColon: false
                },
                editorOptions: {
                    observer: schedulerInst
                },
                visible: false
            },
            {
                dataField: dataExprs.endDateExpr,
                editorType: "dxDateBox",
                label: {
                    text: messageLocalization.format("dxScheduler-editorLabelEndDate")
                },
                validationRules: [{
                    type: "required"
                }],
                editorOptions: {
                    type: allDay ? "date" : "datetime",
                    width: "100%",
                    calendarOptions: {
                        firstDayOfWeek: schedulerInst.option("firstDayOfWeek")
                    },
                    onValueChanged: function(args) {
                        that._validateAppointmentFormDate(args.component, args.value, args.previousValue);

                        var value = dateSerialization.deserializeDate(args.value),
                            previousValue = dateSerialization.deserializeDate(args.previousValue),
                            startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr),
                            startValue = dateSerialization.deserializeDate(startDateEditor.option("value"));

                        if(value && startValue > value) {
                            var duration = previousValue ? previousValue.getTime() - startValue.getTime() : 0;
                            startDateEditor.option("value", new Date(value.getTime() - duration));
                        }
                    }
                }
            },
            {
                dataField: dataExprs.endDateTimeZoneExpr,
                editorType: "dxSchedulerTimezoneEditor",
                label: {
                    text: " ",
                    showColon: false
                },
                editorOptions: {
                    observer: schedulerInst
                },
                visible: false
            },
            {
                itemType: "empty"
            },
            {
                dataField: dataExprs.descriptionExpr,
                editorType: "dxTextArea",
                label: {
                    text: messageLocalization.format("dxScheduler-editorLabelDescription")
                }
            },
            {
                name: "repeatOnOff",
                editorType: "dxSwitch",
                label: {
                    text: messageLocalization.format("dxScheduler-editorLabelRecurrence")
                },
                editorOptions: {
                    observer: schedulerInst,
                    onInitialized: function(args) {
                        var value = that._getRecurrenceRule(schedulerInst, that._appointmentForm);

                        schedulerInst.fire("recurrenceEditorVisibilityChanged", value);
                        args.component.option("value", value);
                    },
                    onValueChanged: function(args) {
                        var value = args.value,
                            recEditor = that._appointmentForm.getEditor(dataExprs.recurrenceRuleExpr);

                        schedulerInst.fire("recurrenceEditorVisibilityChanged", value);
                        recEditor.option("visible", value);
                    }
                },
                cssClass: RECURRENCE_SWITCH_EDITOR_ITEM_CLASS
            },
            {
                dataField: dataExprs.recurrenceRuleExpr,
                editorType: "dxRecurrenceEditor",
                editorOptions: {
                    observer: schedulerInst,
                    firstDayOfWeek: schedulerInst.option("firstDayOfWeek"),
                    onValueChanged: function(args) {
                        var value = that._getRecurrenceRule(schedulerInst, that._appointmentForm);
                        args.component.option("visible", value);
                    },
                    onContentReady: function(args) {
                        var $editorField = $(args.element).closest(".dx-field-item"),
                            $editorLabel = $editorField.find(".dx-field-item-label");

                        eventsEngine.off($editorLabel, clickEvent.name);
                        eventsEngine.on($editorLabel, clickEvent.name, function() {
                            args.component.toggle();
                        });
                    }
                },
                cssClass: RECURRENCE_EDITOR_ITEM_CLASS,
                label: {
                    visible: false
                }
            }
        ];

        if(!dataExprs.recurrenceRuleExpr) {
            this._editors.splice(9, 2);
        }

        return this._editors;
    },

    _getRecurrenceRule: function(schedulerInstance, appointmentForm) {
        return !typeUtils.isEmptyObject(appointmentForm) ? !!schedulerInstance.fire("getField", "recurrenceRule", appointmentForm.option("formData")) : false;
    },

    concatResources: function(resources) {
        this._editors = this._editors.concat(resources);
    },

    checkEditorsType: function(form, startDateExpr, endDateExpr, allDay) {
        var startDateFormItem = form.itemOption(startDateExpr),
            endDateFormItem = form.itemOption(endDateExpr);


        if(startDateFormItem && endDateFormItem) {
            var startDateEditorOptions = startDateFormItem.editorOptions,
                endDateEditorOptions = endDateFormItem.editorOptions;

            if(allDay) {
                startDateEditorOptions.type = endDateEditorOptions.type = "date";
            } else {
                startDateEditorOptions.type = endDateEditorOptions.type = "datetime";
            }

            form.itemOption(startDateExpr, "editorOptions", startDateEditorOptions);
            form.itemOption(endDateExpr, "editorOptions", endDateEditorOptions);
        }
    }
};

module.exports = SchedulerAppointmentForm;
