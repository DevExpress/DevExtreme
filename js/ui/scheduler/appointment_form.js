import Form from '../form';
import dateSerialization from '../../core/utils/date_serialization';
import messageLocalization from '../../localization/message';
import devices from '../../core/devices';
import DataSource from '../../data/data_source';
import timeZoneDataUtils from './timezones/utils.timezones_data';
import { extend } from '../../core/utils/extend';

import './recurrence_editor';
import '../text_area';
import '../tag_box';
import '../switch';
import '../select_box';

const SCREEN_SIZE_OF_SINGLE_COLUMN = 600;

export const APPOINTMENT_FORM_GROUP_NAMES = {
    Main: 'mainGroup',
    Recurrence: 'recurrenceGroup'
};

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

    create: function(componentCreator, $container, isReadOnly, formData) {
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
            screenByWidth: (width) => {
                return width < SCREEN_SIZE_OF_SINGLE_COLUMN || devices.current().deviceType !== 'desktop' ? 'xs' : 'lg';
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

    _createTimezoneEditor: function(timeZoneExpr, secondTimeZoneExpr, visibleIndex, colSpan, isMainTimeZone, isShow = false) {
        const noTzTitle = messageLocalization.format('dxScheduler-noTimezoneTitle');

        return {
            dataField: timeZoneExpr,
            editorType: 'dxSelectBox',
            visibleIndex: visibleIndex,
            colSpan: colSpan,
            label: {
                text: ' ',
            },
            editorOptions: {
                displayExpr: 'title',
                valueExpr: 'id',
                placeholder: noTzTitle,
                searchEnabled: true,
                onValueChanged: (args) => {
                    const form = this._appointmentForm;
                    const secondTimezoneEditor = form.getEditor(secondTimeZoneExpr);
                    if(isMainTimeZone) {
                        secondTimezoneEditor.option('value', args.value);
                    }
                }
            },
            visible: isShow
        };
    },

    _createDateBoxEditor: function(dataExpr, colSpan, firstDayOfWeek, label, callback) {
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

    _createDateBoxItems: function(dataExprs, schedulerInst, allowTimeZoneEditing) {
        const colSpan = allowTimeZoneEditing ? 2 : 1;
        const firstDayOfWeek = schedulerInst.option('firstDayOfWeek');
        return [
            this._createDateBoxEditor(dataExprs.startDateExpr, colSpan, firstDayOfWeek, 'dxScheduler-editorLabelStartDate',
                (args) => {
                    this._dateBoxValueChanged(args, dataExprs.endDateExpr, (endValue, startValue) => { return endValue < startValue; });
                }),

            this._createTimezoneEditor(dataExprs.startDateTimeZoneExpr, dataExprs.endDateTimeZoneExpr, 1, colSpan, true, allowTimeZoneEditing),

            this._createDateBoxEditor(dataExprs.endDateExpr, colSpan, firstDayOfWeek, 'dxScheduler-editorLabelEndDate',
                (args) => {
                    this._dateBoxValueChanged(args, dataExprs.startDateExpr, (startValue, endValue) => { return endValue < startValue; });
                }),

            this._createTimezoneEditor(dataExprs.endDateTimeZoneExpr, dataExprs.startDateTimeZoneExpr, 3, colSpan, false, allowTimeZoneEditing)
        ];
    },

    _changeFormItemDateType: function(itemPath, value) {
        const itemEditorOptions = this._appointmentForm.itemOption(itemPath).editorOptions;

        const newType = value ? 'date' : 'datetime';

        itemEditorOptions.type = newType;

        this._appointmentForm.itemOption(itemPath, 'editorOptions', itemEditorOptions);
    },

    _createMainItems: function(dataExprs, schedulerInst, triggerResize, changeSize, allowTimeZoneEditing) {
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
                items: this._createDateBoxItems(dataExprs, schedulerInst, allowTimeZoneEditing),
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
                    cssClass: 'dx-appointment-form-switch',
                    editorType: 'dxSwitch',
                    label: {
                        text: messageLocalization.format('dxScheduler-allDay'),
                        location: 'right',
                    },
                    editorOptions: {
                        onValueChanged: (args) => {
                            const value = args.value;
                            const startDateEditor = this._appointmentForm.getEditor(dataExprs.startDateExpr);
                            const endDateEditor = this._appointmentForm.getEditor(dataExprs.endDateExpr);
                            const startDate = dateSerialization.deserializeDate(startDateEditor.option('value'));

                            if(!this._appointmentForm._lockDateShiftFlag && startDate) {
                                if(value) {
                                    const allDayStartDate = this._getAllDayStartDate(startDate);
                                    startDateEditor.option('value', allDayStartDate);
                                    endDateEditor.option('value', this._getAllDayEndDate(allDayStartDate));
                                } else {
                                    const startDateWithStartHour = this._getStartDateWithStartHour(startDate, schedulerInst.option('startDayHour'));
                                    const endDate = schedulerInst._workSpace.calculateEndDate(startDateWithStartHour);
                                    startDateEditor.option('value', startDateWithStartHour);
                                    endDateEditor.option('value', endDate);
                                }
                            }

                            const startDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Main}.${dataExprs.startDateExpr}`;
                            const endDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Main}.${dataExprs.endDateExpr}`;

                            this._changeFormItemDateType(startDateItemPath, value);
                            this._changeFormItemDateType(endDateItemPath, value);
                        }
                    }
                }, {
                    editorType: 'dxSwitch',
                    dataField: 'repeat',
                    cssClass: 'dx-appointment-form-switch',
                    name: 'visibilityChanged',
                    label: {
                        text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
                        location: 'right',
                    },
                    editorOptions: {
                        onValueChanged: (args) => {
                            const form = this._appointmentForm;
                            const colSpan = args.value ? 1 : 2;

                            form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Main, 'colSpan', colSpan);
                            form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'colSpan', colSpan);

                            this._updateRecurrenceItemVisibility(dataExprs.recurrenceRuleExpr, args.value, form);

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

    _updateRecurrenceItemVisibility: function(recurrenceRuleExpr, value, form) {
        form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'visible', value);
        !value && form.updateData(recurrenceRuleExpr, '');
        form.getEditor(recurrenceRuleExpr)?.changeValueByVisibility(value);
    },

    prepareAppointmentFormEditors: function(dataExprs, schedulerInst, triggerResize, changeSize, appointmentData, allowTimeZoneEditing, readOnly) {
        const recurrenceEditorVisibility = !!this.getRecurrenceRule(appointmentData, dataExprs);

        changeSize(recurrenceEditorVisibility);
        this._editors = [
            {
                itemType: 'group',
                name: APPOINTMENT_FORM_GROUP_NAMES.Main,
                colCountByScreen: {
                    lg: 2,
                    xs: 1
                },
                colSpan: recurrenceEditorVisibility ? 1 : 2,
                items: this._createMainItems(dataExprs, schedulerInst, triggerResize, changeSize, allowTimeZoneEditing),
            },
            {
                itemType: 'group',
                name: APPOINTMENT_FORM_GROUP_NAMES.Recurrence,
                visible: recurrenceEditorVisibility,
                colSpan: recurrenceEditorVisibility ? 1 : 2,
                items: this._createRecurrenceEditor(dataExprs, schedulerInst, readOnly),
            }
        ];

        return this._editors;
    },

    _createRecurrenceEditor(dataExprs, schedulerInst, readOnly) {
        return [{
            dataField: dataExprs.recurrenceRuleExpr,
            editorType: 'dxRecurrenceEditor',
            editorOptions: {
                readOnly: readOnly,
                firstDayOfWeek: schedulerInst.option('firstDayOfWeek'),
            },
            label: {
                text: ' ',
                visible: false
            }
        }];
    },

    getRecurrenceRule(data, dataExprs) {
        return data[dataExprs.recurrenceRuleExpr];
    },

    concatResources: function(resources) {
        this._editors[0].items = this._editors[0].items.concat(resources);
    },

    setEditorsType: function(form, startDateExpr, endDateExpr, allDay) {
        const startDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Main}.${startDateExpr}`;
        const endDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Recurrence}.${endDateExpr}`;

        const startDateFormItem = form.itemOption(startDateItemPath);
        const endDateFormItem = form.itemOption(endDateItemPath);

        if(startDateFormItem && endDateFormItem) {
            const startDateEditorOptions = startDateFormItem.editorOptions;
            const endDateEditorOptions = endDateFormItem.editorOptions;

            startDateEditorOptions.type = endDateEditorOptions.type = allDay ? 'date' : 'datetime';

            form.itemOption(startDateItemPath, 'editorOptions', startDateEditorOptions);
            form.itemOption(endDateItemPath, 'editorOptions', endDateEditorOptions);
        }
    },

    updateTimeZoneEditorDataSource(date, expression) {
        const timeZoneDataSource = new DataSource({
            store: timeZoneDataUtils.getDisplayedTimeZones(date),
            paginate: true,
            pageSize: 10
        });

        const options = { dataSource: timeZoneDataSource };

        this.setEditorOptions(expression, 'Main', options);
    },

    updateRecurrenceEditorStartDate(date, expression) {
        const options = { startDate: date };

        this.setEditorOptions(expression, 'Recurrence', options);
    },

    setEditorOptions(name, groupName, options) {
        const editorPath = `${APPOINTMENT_FORM_GROUP_NAMES.groupName}.${name}`;
        const editor = this._appointmentForm.itemOption(editorPath);

        editor && this._appointmentForm.itemOption(editorPath, 'editorOptions', extend({}, editor.editorOptions, options));
    },

    updateFormData: function(appointmentForm, formData, dataExprs) {
        appointmentForm._lockDateShiftFlag = true;

        const startDate = new Date(formData[dataExprs.startDateExpr]);
        const endDate = new Date(formData[dataExprs.endDateExpr]);

        this.updateTimeZoneEditorDataSource(startDate, dataExprs.startDateTimeZoneExpr);
        this.updateTimeZoneEditorDataSource(endDate, dataExprs.endDateTimeZoneExpr);
        this.updateRecurrenceEditorStartDate(startDate, dataExprs.recurrenceRuleExpr);

        appointmentForm.option('formData', formData);
        appointmentForm._lockDateShiftFlag = false;
    }
};

export {
    SchedulerAppointmentForm as AppointmentForm
};
