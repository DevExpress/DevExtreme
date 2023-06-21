import $ from '../../../core/renderer';
import Form from '../../form';
import dateSerialization from '../../../core/utils/date_serialization';
import messageLocalization from '../../../localization/message';
import devices from '../../../core/devices';
import DataSource from '../../../data/data_source';
import timeZoneDataUtils from '../timezones/utils.timezones_data';
import { extend } from '../../../core/utils/extend';
import dateUtils from '../../../core/utils/date';
import { Semaphore } from '../../../renovation/ui/scheduler/utils/semaphore/semaphore';

import '../recurrence_editor';
import '../../text_area';
import '../../tag_box';
import '../../switch';
import '../../select_box';
import { createAppointmentAdapter } from '../appointmentAdapter';

const SCREEN_SIZE_OF_SINGLE_COLUMN = 600;

export const APPOINTMENT_FORM_GROUP_NAMES = {
    Main: 'mainGroup',
    Recurrence: 'recurrenceGroup'
};

const getStartDateWithStartHour = (startDate, startDayHour) => {
    return new Date(new Date(startDate).setHours(startDayHour));
};

const validateAppointmentFormDate = (editor, value, previousValue) => {
    const isCurrentDateCorrect = value === null || !!value;
    const isPreviousDateCorrect = previousValue === null || !!previousValue;
    if(!isCurrentDateCorrect && isPreviousDateCorrect) {
        editor.option('value', previousValue);
    }
};

const updateRecurrenceItemVisibility = (recurrenceRuleExpr, value, form) => {
    form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'visible', value);
    !value && form.updateData(recurrenceRuleExpr, '');
    form.getEditor(recurrenceRuleExpr)?.changeValueByVisibility(value);
};

const createDateBoxEditor = (dataField, colSpan, firstDayOfWeek, label, onValueChanged) => {
    return {
        editorType: 'dxDateBox',
        dataField,
        colSpan,
        label: {
            text: messageLocalization.format(label)
        },
        validationRules: [{
            type: 'required'
        }],
        editorOptions: {
            width: '100%',
            calendarOptions: {
                firstDayOfWeek
            },
            onValueChanged,
            useMaskBehavior: true
        },
    };
};

export class AppointmentForm {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.form = null;

        this.semaphore = new Semaphore();
    }

    get dxForm() {
        return this.form;
    }

    set readOnly(value) {
        this.form.option('readOnly', value);
        const { recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;

        const recurrenceEditor = this.form.getEditor(recurrenceRuleExpr);
        recurrenceEditor?.option('readOnly', value);
    }

    get formData() {
        return this.form.option('formData');
    }

    set formData(value) {
        this.form.option('formData', value);
    }

    create(triggerResize, changeSize, formData) {
        const allowTimeZoneEditing = this.scheduler.getEditingConfig().allowTimeZoneEditing;
        const { expr } = this.scheduler.getDataAccessors();

        const recurrenceEditorVisibility = !!formData[expr.recurrenceRuleExpr]; // TODO
        const colSpan = recurrenceEditorVisibility ? 1 : 2;

        const mainItems = [
            ...this._createMainItems(expr, triggerResize, changeSize, allowTimeZoneEditing),
            ...this.scheduler.createResourceEditorModel()
        ];

        changeSize(recurrenceEditorVisibility);
        const items = [
            {
                itemType: 'group',
                name: APPOINTMENT_FORM_GROUP_NAMES.Main,
                colCountByScreen: {
                    lg: 2,
                    xs: 1
                },
                colSpan,
                items: mainItems,
            }, {
                itemType: 'group',
                name: APPOINTMENT_FORM_GROUP_NAMES.Recurrence,
                visible: recurrenceEditorVisibility,
                colSpan,
                items: this._createRecurrenceEditor(expr),
            }
        ];

        const element = $('<div>');

        this.form = this.scheduler.createComponent(element, Form, {
            items,
            showValidationSummary: true,
            scrollingEnabled: true,
            colCount: 'auto',
            colCountByScreen: {
                lg: 2,
                xs: 1
            },
            formData,
            showColonAfterLabel: false,
            labelLocation: 'top',
            customizeItem: (e) => {
                if(this.form && e.itemType === 'group') {
                    const dataExprs = this.scheduler.getDataAccessors().expr;

                    const startDate = new Date(this.formData[dataExprs.startDateExpr]);
                    const endDate = new Date(this.formData[dataExprs.endDateExpr]);

                    const startTimeZoneEditor = e.items.find(i => i.dataField === dataExprs.startDateTimeZoneExpr);
                    const endTimeZoneEditor = e.items.find(i => i.dataField === dataExprs.endDateTimeZoneExpr);

                    if(startTimeZoneEditor) {
                        startTimeZoneEditor.editorOptions.dataSource = this.createTimeZoneDataSource(startDate);
                    }

                    if(endTimeZoneEditor) {
                        endTimeZoneEditor.editorOptions.dataSource = this.createTimeZoneDataSource(endDate);
                    }
                }
            },
            screenByWidth: (width) => {
                return width < SCREEN_SIZE_OF_SINGLE_COLUMN || devices.current().deviceType !== 'desktop' ? 'xs' : 'lg';
            }
        });
    }

    createTimeZoneDataSource(date) {
        return new DataSource({
            store: timeZoneDataUtils.getDisplayedTimeZones(date),
            paginate: true,
            pageSize: 10
        });
    }

    _createAppointmentAdapter(rawAppointment) {
        return createAppointmentAdapter(
            rawAppointment,
            this.scheduler.getDataAccessors(),
        );
    }

    _dateBoxValueChanged(args, dateExpr, isNeedCorrect) {
        validateAppointmentFormDate(args.component, args.value, args.previousValue);

        const value = dateSerialization.deserializeDate(args.value);
        const previousValue = dateSerialization.deserializeDate(args.previousValue);
        const dateEditor = this.form.getEditor(dateExpr);
        const dateValue = dateSerialization.deserializeDate(dateEditor.option('value'));
        if(this.semaphore.isFree() && dateValue && value && isNeedCorrect(dateValue, value)) {
            const duration = previousValue ? dateValue.getTime() - previousValue.getTime() : 0;
            dateEditor.option('value', new Date(value.getTime() + duration));
        }
    }

    _createTimezoneEditor(timeZoneExpr, secondTimeZoneExpr, visibleIndex, colSpan, isMainTimeZone, visible = false) {
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
                    const form = this.form;
                    const secondTimezoneEditor = form.getEditor(secondTimeZoneExpr);
                    if(isMainTimeZone) {
                        secondTimezoneEditor.option('value', args.value);
                    }
                }
            },
            visible
        };
    }

    _createDateBoxItems(dataExprs, allowTimeZoneEditing) {
        const colSpan = allowTimeZoneEditing ? 2 : 1;
        const firstDayOfWeek = this.scheduler.getFirstDayOfWeek();

        return [
            createDateBoxEditor(
                dataExprs.startDateExpr,
                colSpan,
                firstDayOfWeek,
                'dxScheduler-editorLabelStartDate',
                args => {
                    this._dateBoxValueChanged(args, dataExprs.endDateExpr, (endValue, startValue) => endValue < startValue);
                }
            ),

            this._createTimezoneEditor(dataExprs.startDateTimeZoneExpr, dataExprs.endDateTimeZoneExpr, 1, colSpan, true, allowTimeZoneEditing),

            createDateBoxEditor(
                dataExprs.endDateExpr,
                colSpan,
                firstDayOfWeek,
                'dxScheduler-editorLabelEndDate',
                args => {
                    this._dateBoxValueChanged(args, dataExprs.startDateExpr, (startValue, endValue) => endValue < startValue);
                }
            ),

            this._createTimezoneEditor(dataExprs.endDateTimeZoneExpr, dataExprs.startDateTimeZoneExpr, 3, colSpan, false, allowTimeZoneEditing)
        ];
    }

    _changeFormItemDateType(itemPath, isAllDay) {
        const itemEditorOptions = this.form.itemOption(itemPath).editorOptions;

        const type = isAllDay ? 'date' : 'datetime';

        const newEditorOption = { ...itemEditorOptions, type };

        this.form.itemOption(itemPath, 'editorOptions', newEditorOption);
    }

    _createMainItems(dataExprs, triggerResize, changeSize, allowTimeZoneEditing) {
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
                items: this._createDateBoxItems(dataExprs, allowTimeZoneEditing),
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
                            const startDateEditor = this.form.getEditor(dataExprs.startDateExpr);
                            const endDateEditor = this.form.getEditor(dataExprs.endDateExpr);
                            const startDate = dateSerialization.deserializeDate(startDateEditor.option('value'));

                            if(this.semaphore.isFree() && startDate) {
                                if(value) {
                                    const allDayStartDate = dateUtils.trimTime(startDate);
                                    startDateEditor.option('value', new Date(allDayStartDate));
                                    endDateEditor.option('value', new Date(allDayStartDate));
                                } else {
                                    const startDateWithStartHour = getStartDateWithStartHour(startDate, this.scheduler.getStartDayHour());
                                    const endDate = this.scheduler.getCalculatedEndDate(startDateWithStartHour);
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
                            const form = this.form;
                            const colSpan = args.value ? 1 : 2;

                            form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Main, 'colSpan', colSpan);
                            form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'colSpan', colSpan);

                            updateRecurrenceItemVisibility(dataExprs.recurrenceRuleExpr, args.value, form);

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
    }

    _createRecurrenceEditor(dataExprs) {
        return [{
            dataField: dataExprs.recurrenceRuleExpr,
            editorType: 'dxRecurrenceEditor',
            editorOptions: {
                firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
                timeZoneCalculator: this.scheduler.getTimeZoneCalculator(),
                getStartDateTimeZone: () => this._createAppointmentAdapter(this.formData).startDateTimeZone
            },
            label: {
                text: ' ',
                visible: false
            }
        }];
    }

    setEditorsType(allDay) {
        const { startDateExpr, endDateExpr } = this.scheduler.getDataAccessors().expr;

        const startDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Main}.${startDateExpr}`;
        const endDateItemPath = `${APPOINTMENT_FORM_GROUP_NAMES.Main}.${endDateExpr}`;

        const startDateFormItem = this.form.itemOption(startDateItemPath);
        const endDateFormItem = this.form.itemOption(endDateItemPath);

        if(startDateFormItem && endDateFormItem) {
            const startDateEditorOptions = startDateFormItem.editorOptions;
            const endDateEditorOptions = endDateFormItem.editorOptions;

            startDateEditorOptions.type = endDateEditorOptions.type = allDay ? 'date' : 'datetime';

            this.form.itemOption(startDateItemPath, 'editorOptions', startDateEditorOptions);
            this.form.itemOption(endDateItemPath, 'editorOptions', endDateEditorOptions);
        }
    }

    updateRecurrenceEditorStartDate(date, expression) {
        const options = { startDate: date };

        this.setEditorOptions(expression, 'Recurrence', options);
    }

    setEditorOptions(name, groupName, options) {
        const editorPath = `${APPOINTMENT_FORM_GROUP_NAMES.groupName}.${name}`;
        const editor = this.form.itemOption(editorPath);

        editor && this.form.itemOption(editorPath, 'editorOptions', extend({}, editor.editorOptions, options));
    }

    setTimeZoneEditorDataSource(date, path) {
        const dataSource = this.createTimeZoneDataSource(date);
        this.setEditorOptions(path, 'Main', { dataSource: dataSource });
    }

    updateFormData(formData) {
        this.semaphore.take();

        this.form.option('formData', formData);

        const dataExprs = this.scheduler.getDataAccessors().expr;

        const allDay = formData[dataExprs.allDayExpr];

        const startDate = new Date(formData[dataExprs.startDateExpr]);
        const endDate = new Date(formData[dataExprs.endDateExpr]);

        this.setTimeZoneEditorDataSource(startDate, dataExprs.startDateTimeZoneExpr);
        this.setTimeZoneEditorDataSource(endDate, dataExprs.endDateTimeZoneExpr);

        this.updateRecurrenceEditorStartDate(startDate, dataExprs.recurrenceRuleExpr);

        this.setEditorsType(allDay);

        this.semaphore.release();
    }
}
