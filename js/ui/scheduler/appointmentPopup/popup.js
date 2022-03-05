import devices from '../../../core/devices';
import $ from '../../../core/renderer';
import dateUtils from '../../../core/utils/date';
import { Deferred, when } from '../../../core/utils/deferred';
import { triggerResizeEvent } from '../../../events/visibility_change';
import Popup from '../../popup';
import { hide as hideLoading, show as showLoading } from '../loading';
import { createAppointmentAdapter } from '../appointmentAdapter';
import { each } from '../../../core/utils/iterator';
import { isResourceMultiple } from '../resources/utils';
import { wrapToArray } from '../../../core/utils/array';

import {
    isPopupFullScreenNeeded,
    getMaxWidth,
    getPopupToolbarItems,
} from '../../../renovation/ui/scheduler/appointment_edit_form/popup_config';

const toMs = dateUtils.dateToMilliseconds;

const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';

const DAY_IN_MS = toMs('day');

const POPUP_CONFIG = {
    height: 'auto',
    maxHeight: '100%',
    showCloseButton: false,
    showTitle: false,
    defaultOptionsRules: [
        {
            device: () => devices.current().android,
            options: {
                showTitle: false
            }
        }
    ]
};

const modifyResourceFields = (rawAppointment, dataAccessors, resources, returnedObject) => {
    each(dataAccessors.resources.getter, (fieldName) => {
        const value = dataAccessors.resources.getter[fieldName](rawAppointment);
        const isMultiple = isResourceMultiple(resources, fieldName);

        returnedObject[fieldName] = isMultiple ? wrapToArray(value) : value;
    });
};

export const ACTION_TO_APPOINTMENT = {
    CREATE: 0,
    UPDATE: 1,
    EXCLUDE_FROM_SERIES: 2,
};

export class AppointmentPopup {
    constructor(scheduler, form) {
        this.scheduler = scheduler;
        this.form = form;
        this.popup = null;

        this.state = {
            action: null,
            lastEditData: null,
            saveChangesLocker: false,
            appointment: {
                data: null,
            },
        };
    }

    get visible() {
        return this.popup ? this.popup.option('visible') : false;
    }

    show(appointment, config) {
        this.state.appointment.data = appointment;
        this.state.action = config.action;
        this.state.excludeInfo = config.excludeInfo;

        if(!this.popup) {
            const popupConfig = this._createPopupConfig();
            this.popup = this._createPopup(popupConfig);
        }

        this.popup.option(
            'toolbarItems',
            getPopupToolbarItems(
                config.isToolbarVisible,
                (e) => this._doneButtonClickHandler(e),
            )
        );

        this.popup.show();
    }

    hide() {
        this.popup.hide();
    }

    dispose() {
        this.popup?.$element().remove();
    }

    _createPopup(options) {
        const popupElement = $('<div>')
            .addClass(APPOINTMENT_POPUP_CLASS)
            .appendTo(this.scheduler.getElement());

        return this.scheduler.createComponent(popupElement, Popup, options);
    }

    _createPopupConfig() {
        return {
            ...POPUP_CONFIG,
            onHiding: () => this.scheduler.focus(),
            contentTemplate: () => this._createPopupContent(),
            onShowing: e => this._onShowing(e),
            copyRootClassesToWrapper: true,
            _ignoreCopyRootClassesToWrapperDeprecation: true
        };
    }

    _onShowing(e) {
        this._updateForm();

        const arg = {
            form: this.form.dxForm,
            popup: this.popup,
            appointmentData: this.state.appointment.data,
            cancel: false
        };

        this.scheduler.getAppointmentFormOpening()(arg);
        this.scheduler.processActionResult(arg, canceled => {
            if(canceled) {
                e.cancel = true;
            } else {
                this.updatePopupFullScreenMode();
            }
        });
    }

    _createPopupContent() {
        this._createForm();
        return this.form.dxForm.$element(); // TODO
    }

    _createFormData(rawAppointment) {
        const appointment = this._createAppointmentAdapter(rawAppointment);
        const dataAccessors = this.scheduler.getDataAccessors();
        const resources = this.scheduler.getResources();

        const result = {
            ...rawAppointment,
            repeat: !!appointment.recurrenceRule
        };

        modifyResourceFields(rawAppointment, dataAccessors, resources, result);

        return result;
    }

    _createForm() {
        const rawAppointment = this.state.appointment.data;
        const formData = this._createFormData(rawAppointment);

        this.form.create(this.triggerResize.bind(this), this.changeSize.bind(this), formData); // TODO
    }

    _isReadOnly(rawAppointment) {
        const appointment = this._createAppointmentAdapter(rawAppointment);

        if(rawAppointment && appointment.disabled) {
            return true;
        }

        if(this.state.action === ACTION_TO_APPOINTMENT.CREATE) {
            return false;
        }

        return !this.scheduler.getEditingConfig().allowUpdating;
    }

    _createAppointmentAdapter(rawAppointment) {
        return createAppointmentAdapter(
            rawAppointment,
            this.scheduler.getDataAccessors(),
            this.scheduler.getTimeZoneCalculator()
        );
    }

    _updateForm() {
        const { data } = this.state.appointment;
        const appointment = this._createAppointmentAdapter(this._createFormData(data));

        if(appointment.startDate) {
            appointment.startDate = appointment.calculateStartDate('toAppointment');
        }

        if(appointment.endDate) {
            appointment.endDate = appointment.calculateEndDate('toAppointment');
        }

        const formData = appointment.source();

        this.form.readOnly = this._isReadOnly(formData);
        this.form.updateFormData(formData);
    }

    triggerResize() {
        if(this.popup) {
            triggerResizeEvent(this.popup.$element());
        }
    }

    changeSize(isRecurrence) {
        if(this.popup) {
            const isFullScreen = isPopupFullScreenNeeded();
            const maxWidth = isFullScreen
                ? '100%'
                : getMaxWidth(isRecurrence);
            this.popup.option('fullScreen', isFullScreen);
            this.popup.option('maxWidth', maxWidth);
        }
    }

    updatePopupFullScreenMode() {
        if(this.form.dxForm) { // TODO
            const formData = this.form.formData;
            const isRecurrence = formData[this.scheduler.getDataAccessors().expr.recurrenceRuleExpr];

            if(this.visible) {
                this.changeSize(isRecurrence);
            }
        }
    }

    saveChangesAsync(isShowLoadPanel) {
        const deferred = new Deferred();
        const validation = this.form.dxForm.validate();

        isShowLoadPanel && this._showLoadPanel();

        when(validation && validation.complete || validation).done((validation) => {
            if(validation && !validation.isValid) {
                hideLoading();
                deferred.resolve(false);
                return;
            }

            const adapter = this._createAppointmentAdapter(this.form.formData);
            const appointment = adapter.clone({ pathTimeZone: 'fromAppointment' }).source(); // TODO:

            delete appointment.repeat; // TODO

            switch(this.state.action) {
                case ACTION_TO_APPOINTMENT.CREATE:
                    this.scheduler.addAppointment(appointment).done(deferred.resolve);
                    break;
                case ACTION_TO_APPOINTMENT.UPDATE:
                    this.scheduler.updateAppointment(this.state.appointment.data, appointment).done(deferred.resolve);
                    break;
                case ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES:
                    this.scheduler.updateAppointment(this.state.excludeInfo.sourceAppointment, this.state.excludeInfo.updatedAppointment);
                    this.scheduler.addAppointment(appointment).done(deferred.resolve);
                    break;
            }

            deferred.done(() => {
                hideLoading();
                this.state.lastEditData = appointment;
            });
        });

        return deferred.promise();
    }

    _doneButtonClickHandler(e) {
        e.cancel = true;
        this.saveEditDataAsync();
    }

    saveEditDataAsync() {
        const deferred = new Deferred();

        if(this._tryLockSaveChanges()) {
            when(this.saveChangesAsync(true)).done(() => {
                if(this.state.lastEditData) { // TODO
                    const adapter = this._createAppointmentAdapter(this.state.lastEditData);

                    const { startDate, endDate, allDay } = adapter;

                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    const inAllDayRow = allDay || (endTime - startTime) >= DAY_IN_MS;

                    const resources = {};
                    const dataAccessors = this.scheduler.getDataAccessors();
                    const resourceList = this.scheduler.getResources();

                    modifyResourceFields(this.state.lastEditData, dataAccessors, resourceList, resources);

                    this.scheduler.updateScrollPosition(startDate, resources, inAllDayRow);
                    this.state.lastEditData = null;
                }

                this._unlockSaveChanges();

                deferred.resolve();
            });
        }

        return deferred.promise();
    }

    _showLoadPanel() {
        const container = this.popup.$overlayContent();

        showLoading({
            container,
            position: {
                of: container
            },
            copyRootClassesToWrapper: true,
            _ignoreCopyRootClassesToWrapperDeprecation: true
        });
    }

    _tryLockSaveChanges() {
        if(this.state.saveChangesLocker === false) {
            this.state.saveChangesLocker = true;
            return true;
        }
        return false;
    }

    _unlockSaveChanges() {
        this.state.saveChangesLocker = false;
    }
}
