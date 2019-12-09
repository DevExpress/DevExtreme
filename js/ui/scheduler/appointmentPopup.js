import $ from '../../core/renderer';
import Popup from '../popup';
import windowUtils from '../../core/utils/window';
import AppointmentForm from './ui.scheduler.appointment_form';
import devices from '../../core/devices';
import domUtils from '../../core/utils/dom';
import objectUtils from '../../core/utils/object';
import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { Deferred, when } from '../../core/utils/deferred';

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = 'dx-scheduler';
const APPOINTMENT_POPUP_CLASS = `${WIDGET_CLASS}-appointment-popup`;

const APPOINTMENT_POPUP_WIDTH = 610;
const APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH = 768;

const TOOLBAR_ITEM_AFTER_LOCATION = 'after';
const TOOLBAR_ITEM_BEFORE_LOCATION = 'before';

export default class AppointmentPopup {
    constructor(scheduler) {
        this.scheduler = scheduler;

        this._popup = null;
        this._appointmentForm = null;

        this.state = {
            lastEditData: null,
            appointment: {
                data: null,
                processTimeZone: false,
                isEmptyText: false,
                isEmptyDescription: false
            }
        };
    }

    show(data, showButtons, processTimeZone) {
        this.state.appointment = {
            data: data,
            processTimeZone: processTimeZone
        };

        if(!this._popup) {
            this._popup = this._createPopup();
        }

        this._popup.option({
            toolbarItems: showButtons ? this._getPopupToolbarItems() : [],
            showCloseButton: showButtons ? this._popup.initialOption('showCloseButton') : true
        });

        this._popup.option('onShowing', e => {
            this._updateForm(data, processTimeZone);

            const arg = {
                form: this._appointmentForm,
                appointmentData: data,
                cancel: false
            };

            this.scheduler._actions['onAppointmentFormOpening'](arg);
            this.scheduler._processActionResult(arg, canceled => {
                if(canceled) {
                    e.cancel = true;
                } else {
                    this.updatePopupFullScreenMode();
                }
            });
        });

        this._popup.show();
    }

    hide() {
        this._popup.hide();
    }

    isVisible() {
        return this._popup ? this._popup.option('visible') : false;
    }

    getPopup() {
        return this._popup;
    }

    dispose() {
        if(this._$popup) {
            this._popup.$element().remove();
            this._$popup = null;
        }
    }

    _createPopup() {
        const popupElement = $('<div>')
            .addClass(APPOINTMENT_POPUP_CLASS)
            .appendTo(this.scheduler.$element());

        return this.scheduler._createComponent(popupElement, Popup, this._createPopupConfig());
    }

    _createPopupConfig() {
        return {
            height: 'auto',
            maxHeight: '100%',
            onHiding: () => { this._appointmentForm.resetValues(); this.scheduler.focus(); },
            contentTemplate: () => this._createPopupContent(),
            defaultOptionsRules: [
                {
                    device: () => devices.current().android,
                    options: {
                        showTitle: false
                    }
                }
            ]
        };
    }

    _createPopupContent() {
        const formElement = $('<div>');
        this._appointmentForm = this._createForm(formElement);

        return formElement;
    }

    _createAppointmentFormData(appointmentData) {
        const result = extend(true, {}, appointmentData);
        each(this.scheduler._resourcesManager.getResourcesFromItem(result, true) || {}, (name, value) => result[name] = value);

        return result;
    }

    _createForm(element) {
        const { expr } = this.scheduler._dataAccessors;
        const resources = this.scheduler.option('resources');

        AppointmentForm.prepareAppointmentFormEditors({
            textExpr: expr.textExpr,
            allDayExpr: expr.allDayExpr,
            startDateExpr: expr.startDateExpr,
            endDateExpr: expr.endDateExpr,
            descriptionExpr: expr.descriptionExpr,
            recurrenceRuleExpr: expr.recurrenceRuleExpr,
            startDateTimeZoneExpr: expr.startDateTimeZoneExpr,
            endDateTimeZoneExpr: expr.endDateTimeZoneExpr
        }, this.scheduler);

        if(resources && resources.length) {
            this.scheduler._resourcesManager.setResources(this.scheduler.option('resources'));
            AppointmentForm.concatResources(this.scheduler._resourcesManager.getEditors());
        }

        return AppointmentForm.create(
            this.scheduler._createComponent.bind(this.scheduler),
            element,
            this._isReadOnly(this.state.appointment.data),
            this._createAppointmentFormData(this.state.appointment.data)
        );
    }

    _isReadOnly(data) {
        if(data && data.disabled) {
            return true;
        }
        return this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false;
    }

    _updateForm(appointmentData, isProcessTimeZone) {
        let allDay = this.scheduler.fire('getField', 'allDay', appointmentData),
            startDate = this.scheduler.fire('getField', 'startDate', appointmentData),
            endDate = this.scheduler.fire('getField', 'endDate', appointmentData);

        const formData = this._createAppointmentFormData(appointmentData);

        this.state.appointment.isEmptyText = appointmentData === undefined || appointmentData.text === undefined;
        this.state.appointment.isEmptyDescription = appointmentData === undefined || appointmentData.description === undefined;

        if(this.state.appointment.isEmptyText) {
            formData.text = '';
        }
        if(this.state.appointment.isEmptyDescription) {
            formData.description = '';
        }

        if(isProcessTimeZone) {
            startDate = this.scheduler.fire('convertDateByTimezone', startDate);
            endDate = this.scheduler.fire('convertDateByTimezone', endDate);

            this.scheduler.fire('setField', 'startDate', formData, startDate);
            this.scheduler.fire('setField', 'endDate', formData, endDate);
        }

        var startDateExpr = this.scheduler._dataAccessors.expr.startDateExpr,
            endDateExpr = this.scheduler._dataAccessors.expr.endDateExpr;

        formData.recurrenceRule = formData.recurrenceRule || ''; // TODO: plug for recurrent editor

        AppointmentForm.updateFormData(this._appointmentForm, formData);
        this._appointmentForm.option('readOnly', this._isReadOnly(this.state.appointment.data));

        AppointmentForm.checkEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay);

        const recurrenceRuleExpr = this.scheduler._dataAccessors.expr.recurrenceRuleExpr,
            recurrentEditorItem = recurrenceRuleExpr ? this._appointmentForm.itemOption(recurrenceRuleExpr) : null;

        if(recurrentEditorItem) {
            const options = recurrentEditorItem.editorOptions || {};
            options.startDate = startDate;
            this._appointmentForm.itemOption(recurrenceRuleExpr, 'editorOptions', options);
        }
    }

    _isPopupFullScreenNeeded() {
        if(windowUtils.hasWindow()) {
            const window = windowUtils.getWindow();
            return $(window).width() < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH;
        }
        return false;
    }

    triggerResize() {
        this._popup && domUtils.triggerResizeEvent(this._popup.$element());
    }

    updatePopupFullScreenMode() {
        if(this.isVisible()) {
            const isFullScreen = this._isPopupFullScreenNeeded();
            this._popup.option({
                maxWidth: isFullScreen ? '100%' : APPOINTMENT_POPUP_WIDTH,
                fullScreen: isFullScreen
            });
        }
    }

    _getPopupToolbarItems() {
        const isIOs = devices.current().platform === 'ios';
        return [
            {
                shortcut: 'done',
                location: TOOLBAR_ITEM_AFTER_LOCATION,
                onClick: (e) => this._doneButtonClickHandler(e)
            },
            {
                shortcut: 'cancel',
                location: isIOs ? TOOLBAR_ITEM_BEFORE_LOCATION : TOOLBAR_ITEM_AFTER_LOCATION
            }
        ];
    }

    saveChanges(disableButton) {
        const deferred = new Deferred();
        const validation = this._appointmentForm.validate();
        const state = this.state.appointment;

        const convert = (obj, dateFieldName) => {
            const date = new Date(this.scheduler.fire('getField', dateFieldName, obj));
            const tzDiff = this.scheduler._getTimezoneOffsetByOption() * toMs('hour') + this.scheduler.fire('getClientTimezoneOffset', date);

            return new Date(date.getTime() + tzDiff);
        };

        disableButton && this._disableDoneButton();

        when(validation && validation.complete || validation).done((validation) => {
            if(validation && !validation.isValid) {
                this._enableDoneButton();
                deferred.resolve(false);
                return;
            }

            const formData = objectUtils.deepExtendArraySafe({}, this._getFormData(), true),
                oldData = this.scheduler._editAppointmentData,
                recData = this.scheduler._updatedRecAppointment;

            if(state.isEmptyText && formData.text === '') {
                delete formData.text;
            }
            if(state.isEmptyDescription && formData.description === '') {
                delete formData.description;
            }
            if(state.data.recurrenceRule === undefined && formData.recurrenceRule === '') { // TODO: plug for recurrent editor
                delete formData.recurrenceRule;
            }

            if(oldData) {
                this.scheduler._convertDatesByTimezoneBack(false, formData);
            }

            if(oldData && !recData) {
                this.scheduler.updateAppointment(oldData, formData);
            } else {

                if(recData) {
                    this.scheduler.updateAppointment(oldData, recData);
                    delete this.scheduler._updatedRecAppointment;

                    if(typeof this.scheduler._getTimezoneOffsetByOption() === 'number') {
                        this.scheduler.fire('setField', 'startDate', formData, convert.call(this, formData, 'startDate'));
                        this.scheduler.fire('setField', 'endDate', formData, convert.call(this, formData, 'endDate'));
                    }
                }

                this.scheduler.addAppointment(formData);
            }
            this._enableDoneButton();

            this.state.lastEditData = formData;

            deferred.resolve(true);
        });
        return deferred.promise();
    }

    _getFormData() {
        const formData = this._appointmentForm.option('formData'),
            startDate = this.scheduler.fire('getField', 'startDate', formData),
            endDate = this.scheduler.fire('getField', 'endDate', formData);

        this.scheduler.fire('setField', 'startDate', formData, startDate);
        this.scheduler.fire('setField', 'endDate', formData, endDate);

        return formData;
    }

    _doneButtonClickHandler(e) {
        e.cancel = true;
        this.saveEditData();
    }

    saveEditData() {
        const deferred = new Deferred();
        when(this.saveChanges(true)).done(() => {
            if(this.state.lastEditData) {
                const startDate = this.scheduler.fire('getField', 'startDate', this.state.lastEditData);
                this.scheduler._workSpace.updateScrollPosition(startDate);
                this.state.lastEditData = null;
            }
            deferred.resolve();
        });
        return deferred.promise();
    }

    _enableDoneButton() {
        const toolbarItems = this._popup.option('toolbarItems');
        toolbarItems[0].options = extend(toolbarItems[0].options, { disabled: false });
        this._popup.option('toolbarItems', toolbarItems);
    }

    _disableDoneButton() {
        const toolbarItems = this._popup.option('toolbarItems');
        toolbarItems[0].options = extend(toolbarItems[0].options, { disabled: true });
        this._popup.option('toolbarItems', toolbarItems);
    }
}
