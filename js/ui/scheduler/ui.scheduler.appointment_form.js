import $ from '../../core/renderer';
import Form from '../form';
import dateSerialization from '../../core/utils/date_serialization';
import messageLocalization from '../../localization/message';
import clickEvent from '../../events/click';
import typeUtils from '../../core/utils/type';
import eventsEngine from '../../events/core/events_engine';

import './ui.scheduler.recurrence_editor';
import './timezones/ui.scheduler.timezone_editor';
import '../text_area';
import '../tag_box';
import '../switch';

const RECURRENCE_EDITOR_ITEM_CLASS = 'dx-scheduler-recurrence-rule-item';

const SCREEN_SIZE_OF_TOP_LABEL_LOCATION = 608;
const SCREEN_SIZE_OF_SINGLE_COLUMN = 460;

const SchedulerAppointmentForm = {
    _appointmentForm: {},
    _lockDateShiftFlag: false,

    _validateAppointmentFormDate: function(editor, value, previousValue) {
        const isCurrentDateCorrect = value === null || !!value;
        const isPreviousDateCorrect = previousValue === null || !!previousValue;
        if(!isCurrentDateCorrect && isPreviousDateCorrect) {
            editor.option('value', previousValue);
        }
    },

    _getAllDayStartDate: function(startDate) {
        return startDate.setHours(0, 0, 0, 0);
    },

    _getAllDayEndDate: function(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        return endDate;
    },

    _updateLabelLocation: function(formWidth) {
        if(formWidth > 0 && this._appointmentForm._rootLayoutManager._contentReadyAction) {
            this._appointmentForm.option('labelLocation', formWidth < SCREEN_SIZE_OF_TOP_LABEL_LOCATION ? 'top' : 'left');
        }
    },

    create: function(componentCreator, $container, isReadOnly, formData) {
        this._appointmentForm = componentCreator($container, Form, {
            items: this._editors,
            readOnly: isReadOnly,
            showValidationSummary: true,
            scrollingEnabled: true,
            colCount: 2,
            formData: formData,
            showColonAfterLabel: false,
            screenByWidth: () => {
                const formWidth = $container.parent().outerWidth();
                this._updateLabelLocation(formWidth);
                return formWidth < SCREEN_SIZE_OF_SINGLE_COLUMN ? 'xs' : 'lg';
            }
        });

        return this._appointmentForm;
    },

    prepareAppointmentFormEditors: function(dataExprs, schedulerInst) {
        const that = this;

        this._editors = [
            {
                dataField: dataExprs.textExpr,
                editorType: 'dxTextBox',
                colSpan: 2,
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelTitle')
                }
            },
            {
                dataField: dataExprs.startDateExpr,
                editorType: 'dxDateBox',
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelStartDate')
                },
                validationRules: [{
                    type: 'required'
                }],
                editorOptions: {
                    width: '100%',
                    calendarOptions: {
                        firstDayOfWeek: schedulerInst.option('firstDayOfWeek')
                    },
                    onValueChanged: function(args) {
                        that._validateAppointmentFormDate(args.component, args.value, args.previousValue);

                        const value = dateSerialization.deserializeDate(args.value);
                        const previousValue = dateSerialization.deserializeDate(args.previousValue);
                        const endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr);
                        const endValue = dateSerialization.deserializeDate(endDateEditor.option('value'));
                        if(!that._appointmentForm._lockDateShiftFlag && typeUtils.isDefined(value) && typeUtils.isDefined(endValue)
                            && !!endValue && endValue < value) {
                            const duration = endValue.getTime() - previousValue.getTime();
                            endDateEditor.option('value', new Date(value.getTime() + duration));
                        }
                    }
                }
            },
            {
                dataField: dataExprs.startDateTimeZoneExpr,
                editorType: 'dxSchedulerTimezoneEditor',
                colSpan: 2,
                label: {
                    text: ' ',
                    showColon: false
                },
                editorOptions: {
                    observer: schedulerInst
                },
                visible: false
            },
            {
                dataField: dataExprs.endDateExpr,
                editorType: 'dxDateBox',
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelEndDate')
                },
                validationRules: [{
                    type: 'required'
                }],
                editorOptions: {
                    width: '100%',
                    calendarOptions: {
                        firstDayOfWeek: schedulerInst.option('firstDayOfWeek')
                    },
                    onValueChanged: function(args) {
                        that._validateAppointmentFormDate(args.component, args.value, args.previousValue);

                        const value = dateSerialization.deserializeDate(args.value);
                        const previousValue = dateSerialization.deserializeDate(args.previousValue);
                        const startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr);
                        const startValue = dateSerialization.deserializeDate(startDateEditor.option('value'));
                        if(!that._appointmentForm._lockDateShiftFlag && !!value && startValue > value) {
                            const duration = previousValue ? previousValue.getTime() - startValue.getTime() : 0;
                            startDateEditor.option('value', new Date(value.getTime() - duration));
                        }
                    }
                }
            },
            {
                dataField: dataExprs.endDateTimeZoneExpr,
                editorType: 'dxSchedulerTimezoneEditor',
                colSpan: 2,
                label: {
                    text: ' ',
                    showColon: false
                },
                editorOptions: {
                    observer: schedulerInst
                },
                visible: false
            },
            {
                dataField: dataExprs.allDayExpr,
                editorType: 'dxSwitch',
                colSpan: 2,
                label: {
                    text: messageLocalization.format('dxScheduler-allDay')
                },
                editorOptions: {
                    onValueChanged: function(args) {
                        const value = args.value;
                        const startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr);
                        const endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr);

                        if(startDateEditor && endDateEditor) {
                            startDateEditor.option('type', value ? 'date' : 'datetime');
                            endDateEditor.option('type', value ? 'date' : 'datetime');

                            if(!startDateEditor.option('value')) {
                                return;
                            }

                            const startDate = dateSerialization.deserializeDate(startDateEditor.option('value'));

                            if(value) {
                                startDateEditor.option('value', that._getAllDayStartDate(startDate));
                                endDateEditor.option('value', that._getAllDayEndDate(startDate));
                            } else {
                                startDate.setHours(schedulerInst.option('startDayHour'));
                                startDateEditor.option('value', startDate);
                                endDateEditor.option('value', schedulerInst._workSpace.calculateEndDate(dateSerialization.deserializeDate(startDateEditor.option('value'))));
                            }
                        }
                    }
                }
            },
            {
                itemType: 'empty',
                colSpan: 2,
            },
            {
                dataField: dataExprs.descriptionExpr,
                editorType: 'dxTextArea',
                colSpan: 2,
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelDescription')
                }
            },
            {
                itemType: 'empty',
                colSpan: 2
            },
            {
                dataField: dataExprs.recurrenceRuleExpr,
                editorType: 'dxRecurrenceEditor',
                colSpan: 2,
                editorOptions: {
                    observer: schedulerInst,
                    firstDayOfWeek: schedulerInst.option('firstDayOfWeek'),
                    onValueChanged: function(args) {
                        const value = that._getRecurrenceRule(schedulerInst, that._appointmentForm);
                        schedulerInst.fire('recurrenceEditorVisibilityChanged', value);
                    },
                    onContentReady: function(args) {
                        const $editorField = $(args.element).closest('.dx-field-item');
                        const $editorLabel = $editorField.find('.dx-field-item-label');

                        eventsEngine.off($editorLabel, clickEvent.name);
                        eventsEngine.on($editorLabel, clickEvent.name, function() {
                            args.component.toggle();
                        });
                    }
                },
                cssClass: RECURRENCE_EDITOR_ITEM_CLASS,
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelRecurrence')
                }
            }
        ];

        if(!dataExprs.recurrenceRuleExpr) {
            this._editors.splice(9, 2);
        }

        return this._editors;
    },

    _getRecurrenceRule: function(schedulerInstance, appointmentForm) {
        return !typeUtils.isEmptyObject(appointmentForm) ? !!schedulerInstance.fire('getField', 'recurrenceRule', appointmentForm.option('formData')) : false;
    },

    concatResources: function(resources) {
        this._editors = this._editors.concat(resources);
    },

    checkEditorsType: function(form, startDateExpr, endDateExpr, allDay) {
        const startDateFormItem = form.itemOption(startDateExpr);
        const endDateFormItem = form.itemOption(endDateExpr);


        if(startDateFormItem && endDateFormItem) {
            const startDateEditorOptions = startDateFormItem.editorOptions;
            const endDateEditorOptions = endDateFormItem.editorOptions;

            if(allDay) {
                startDateEditorOptions.type = endDateEditorOptions.type = 'date';
            } else {
                startDateEditorOptions.type = endDateEditorOptions.type = 'datetime';
            }

            form.itemOption(startDateExpr, 'editorOptions', startDateEditorOptions);
            form.itemOption(endDateExpr, 'editorOptions', endDateEditorOptions);
        }
    },

    updateFormData: function(appointmentForm, formData) {
        appointmentForm._lockDateShiftFlag = true;
        appointmentForm.option('formData', formData);
        appointmentForm._lockDateShiftFlag = false;
    }
};

module.exports = SchedulerAppointmentForm;
