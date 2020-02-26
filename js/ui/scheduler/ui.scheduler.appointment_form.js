import Form from '../form';
import dateSerialization from '../../core/utils/date_serialization';
import messageLocalization from '../../localization/message';

import './ui.scheduler.recurrence_editor';
import './timezones/ui.scheduler.timezone_editor';
import '../text_area';
import '../tag_box';
import '../switch';

const SCREEN_SIZE_OF_SINGLE_COLUMN = 600;

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
        return new Date(new Date(startDate).setHours(0, 0, 0, 0));
    },

    _getAllDayEndDate: function(startDate) {
        return new Date(new Date(startDate).setDate(startDate.getDate() + 1));
    },

    _getStartDateWithStartHour: function(startDate, startDayHour) {
        return new Date(new Date(startDate).setHours(startDayHour));
    },

    create: function(componentCreator, $container, isReadOnly, formData, getWindowWidth) {
        this._appointmentForm = componentCreator($container, Form, {
            items: this._editors,
            readOnly: isReadOnly,
            showValidationSummary: true,
            scrollingEnabled: true,
            colCount: 'auto',
            colCountByScreen: {
                lg: 2,
                xs: 1
            },
            formData: formData,
            showColonAfterLabel: false,
            labelLocation: 'top',
            screenByWidth: () => {
                return getWindowWidth() < SCREEN_SIZE_OF_SINGLE_COLUMN ? 'xs' : 'lg';
            }
        });

        return this._appointmentForm;
    },

    _dateBoxValueChanged: function(args, dateExpr, isNeedCorrect) {
        this._validateAppointmentFormDate(args.component, args.value, args.previousValue);

        const value = dateSerialization.deserializeDate(args.value);
        const previousValue = dateSerialization.deserializeDate(args.previousValue);
        const dateEditor = this._appointmentForm.getEditor(dateExpr);
        const dateValue = dateSerialization.deserializeDate(dateEditor.option('value'));
        if(!this._appointmentForm._lockDateShiftFlag && dateValue && value && isNeedCorrect(dateValue, value)) {
            const duration = previousValue ? dateValue.getTime() - previousValue.getTime() : 0;
            dateEditor.option('value', new Date(value.getTime() + duration));
        }
    },

    _getTimezoneEditor: function(timeZoneExpr, secondTimeZoneExpr, visibleIndex, colSpan, schedulerInst, isShow = false) {
        const that = this;
        return {
            dataField: timeZoneExpr,
            editorType: 'dxSchedulerTimezoneEditor',
            visibleIndex: visibleIndex,
            colSpan: colSpan,
            label: {
                text: ' ',
            },
            editorOptions: {
                observer: schedulerInst,
                onValueChanged: function(args) {
                    const form = that._appointmentForm;
                    const secondTimezoneEditor = form.getEditor(secondTimeZoneExpr);
                    if(!secondTimezoneEditor.option('value')) {
                        secondTimezoneEditor.option('value', args.value);
                    }
                }
            },
            visible: isShow
        };
    },

    _getDateBoxEditor: function(dataExpr, colSpan, firstDayOfWeek, label, callback) {
        return {
            dataField: dataExpr,
            editorType: 'dxDateBox',
            colSpan: colSpan,
            label: {
                text: messageLocalization.format(label)
            },
            validationRules: [{
                type: 'required'
            }],
            editorOptions: {
                width: '100%',
                calendarOptions: {
                    firstDayOfWeek: firstDayOfWeek
                },
                onValueChanged: callback
            }
        };
    },

    _getDateBoxItems: function(dataExprs, schedulerInst, allowEditingTimeZones) {
        const that = this;
        const colSpan = allowEditingTimeZones ? 2 : 1;
        const firstDayOfWeek = schedulerInst.option('firstDayOfWeek');
        return [
            this._getDateBoxEditor(dataExprs.startDateExpr, colSpan, firstDayOfWeek, 'dxScheduler-editorLabelStartDate',
                function(args) {
                    that._dateBoxValueChanged(args, dataExprs.endDateExpr, (endValue, startValue) => { return endValue < startValue; });
                }),

            this._getTimezoneEditor(dataExprs.startDateTimeZoneExpr, dataExprs.endDateTimeZoneExpr, 1, colSpan, schedulerInst, allowEditingTimeZones),

            this._getDateBoxEditor(dataExprs.endDateExpr, colSpan, firstDayOfWeek, 'dxScheduler-editorLabelEndDate',
                function(args) {
                    that._dateBoxValueChanged(args, dataExprs.startDateExpr, (startValue, endValue) => { return endValue < startValue; });
                }),

            this._getTimezoneEditor(dataExprs.endDateTimeZoneExpr, dataExprs.startDateTimeZoneExpr, 3, colSpan, schedulerInst, allowEditingTimeZones)
        ];
    },

    _getMainItems: function(dataExprs, schedulerInst, triggerResize, changeSize, allowEditingTimeZones) {
        const that = this;
        return [
            {
                dataField: dataExprs.textExpr,
                editorType: 'dxTextBox',
                colSpan: 2,
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelTitle')
                }
            },
            {
                itemType: 'group',
                colSpan: 2,
                colCountByScreen: {
                    lg: 2,
                    xs: 1
                },
                items: this._getDateBoxItems(dataExprs, schedulerInst, allowEditingTimeZones),
            },
            {
                itemType: 'group',
                colCountByScreen: {
                    lg: 3,
                    xs: 3
                },
                colSpan: 2,
                items: [{
                    dataField: dataExprs.allDayExpr,
                    cssClass: 'dx-uppointment-form-switch',
                    editorType: 'dxSwitch',
                    label: {
                        text: messageLocalization.format('dxScheduler-allDay'),
                        location: 'right',
                    },
                    editorOptions: {
                        onValueChanged: function(args) {
                            const value = args.value;
                            const startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr);
                            const endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr);
                            const startDate = dateSerialization.deserializeDate(startDateEditor.option('value'));

                            if(!that._appointmentForm._lockDateShiftFlag && startDate) {
                                if(value) {
                                    const allDayStartDate = that._getAllDayStartDate(startDate);
                                    startDateEditor.option('value', allDayStartDate);
                                    endDateEditor.option('value', that._getAllDayEndDate(allDayStartDate));
                                } else {
                                    const startDateWithStartHour = that._getStartDateWithStartHour(startDate, schedulerInst.option('startDayHour'));
                                    const endDate = schedulerInst._workSpace.calculateEndDate(startDateWithStartHour);
                                    startDateEditor.option('value', startDateWithStartHour);
                                    endDateEditor.option('value', endDate);
                                }
                            }
                            startDateEditor.option('type', value ? 'date' : 'datetime');
                            endDateEditor.option('type', value ? 'date' : 'datetime');
                        }
                    }
                }, {
                    editorType: 'dxSwitch',
                    dataField: 'repeat',
                    cssClass: 'dx-uppointment-form-switch',
                    name: 'visibilityChanged',
                    label: {
                        text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
                        location: 'right',
                    },
                    editorOptions: {
                        onValueChanged: function(args) {
                            const form = that._appointmentForm;
                            form.option('items[0].colSpan', args.value ? 1 : 2);
                            form.getEditor(dataExprs.recurrenceRuleExpr).option('visible', args.value);
                            changeSize(args.value);
                            triggerResize();
                        }
                    }
                }]
            },
            {
                itemType: 'empty',
                colSpan: 2
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
            }
        ];
    },

    prepareAppointmentFormEditors: function(dataExprs, schedulerInst, triggerResize, changeSize, appointmentData, allowEditingTimeZones) {
        const that = this;
        const recurrenceEditorVisibility = !!appointmentData.recurrenceRule;

        this._editors = [
            {
                itemType: 'group',
                colCountByScreen: {
                    lg: 2,
                    xs: 1
                },
                colSpan: recurrenceEditorVisibility ? 1 : 2,
                items: this._getMainItems(dataExprs, schedulerInst, triggerResize, changeSize, allowEditingTimeZones),
            },
            {
                dataField: dataExprs.recurrenceRuleExpr,
                editorType: 'dxRecurrenceEditor',
                editorOptions: {
                    firstDayOfWeek: schedulerInst.option('firstDayOfWeek'),
                    onInitialized: (e) => {
                        const form = that._appointmentForm;
                        if(form.option) {
                            e.component.option('visible', !!form.option('formData').recurrenceRule);
                        }
                    }
                },
                label: {
                    text: ' ',
                    visible: false
                }
            }
        ];

        return this._editors;
    },

    concatResources: function(resources) {
        this._editors = this._editors[0].items.concat(resources);
    },

    checkEditorsType: function(form, startDateExpr, endDateExpr, allDay) {
        const startDateFormItem = form.itemOption(startDateExpr);
        const endDateFormItem = form.itemOption(endDateExpr);


        if(startDateFormItem && endDateFormItem) {
            const startDateEditorOptions = startDateFormItem.editorOptions;
            const endDateEditorOptions = endDateFormItem.editorOptions;

            startDateEditorOptions.type = endDateEditorOptions.type = allDay ? 'date' : 'datetime';

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
