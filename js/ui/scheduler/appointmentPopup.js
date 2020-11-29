import devices from '../../core/devices';
import $ from '../../core/renderer';
import dateUtils from '../../core/utils/date';
import { Deferred, when } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { isDefined, isEmptyObject } from '../../core/utils/type';
import { getWindow, hasWindow } from '../../core/utils/window';
import { triggerResizeEvent } from '../../events/visibility_change';
import messageLocalization from '../../localization/message';
import Popup from '../popup';
import { AppointmentForm } from './ui.scheduler.appointment_form';
import { hide as hideLoading, show as showLoading } from './ui.loading';

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = 'dx-scheduler';
const APPOINTMENT_POPUP_CLASS = `${WIDGET_CLASS}-appointment-popup`;

const APPOINTMENT_POPUP_WIDTH = 485;
const APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE = 970;
const APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH = 1000;

const APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH_MOBILE = 500;
const APPOINTMENT_POPUP_WIDTH_MOBILE = 350;

const TOOLBAR_ITEM_AFTER_LOCATION = 'after';
const TOOLBAR_ITEM_BEFORE_LOCATION = 'before';

const DAY_IN_MS = toMs('day');

export default class AppointmentPopup {
    constructor(scheduler) {
        this.scheduler = scheduler;

        this._popup = null;
        this._appointmentForm = null;

        this.state = {
            lastEditData: null,
            saveChangesLocker: false,
            appointment: {
                data: null,
                isEmptyText: false,
                isEmptyDescription: false
            }
        };
    }

    show(data = {}, isDoneButtonVisible) {
        if(isEmptyObject(data)) {
            const startDate = this.scheduler.option('currentDate');
            const endDate = new Date(startDate.getTime() + this.scheduler.option('cellDuration') * toMs('minute'));
            this.scheduler.fire('setField', 'startDate', data, startDate);
            this.scheduler.fire('setField', 'endDate', data, endDate);
        }
        this.state.appointment.data = data;

        if(!this._popup) {
            const popupConfig = this._createPopupConfig();
            this._popup = this._createPopup(popupConfig);
        }

        this._popup.option('toolbarItems', this._createPopupToolbarItems(isDoneButtonVisible));
        this._popup.show();
    }

    hide() {
        this._popup.hide();
    }

    isVisible() {
        return this._popup ? this._popup.option('visible') : false;
    }

    ///#DEBUG
    getPopup() {
        return this._popup;
    }
    ///#ENDDEBUG

    dispose() {
        if(this._$popup) {
            this._popup.$element().remove();
            this._$popup = null;
        }
    }

    _createPopup(options) {
        const popupElement = $('<div>')
            .addClass(APPOINTMENT_POPUP_CLASS)
            .appendTo(this.scheduler.$element());

        return this.scheduler._createComponent(popupElement, Popup, options);
    }

    _createPopupConfig() {
        return {
            height: 'auto',
            maxHeight: '100%',
            showCloseButton: false,
            showTitle: false,
            onHiding: () => { this.scheduler.focus(); },
            contentTemplate: () => {
                return this._createPopupContent();
            },
            onShowing: e => this._onShowing(e),
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

    _onShowing(e) {
        this._updateForm();

        const arg = {
            form: this._appointmentForm,
            popup: this._popup,
            appointmentData: this.state.appointment.data,
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
    }

    _createPopupContent() {
        const formElement = $('<div>');
        this._appointmentForm = this._createForm(formElement);
        return formElement;
    }

    _createAppointmentFormData(rawAppointment) {
        const appointment = this._createAppointmentAdapter(rawAppointment);
        const result = extend(true, { repeat: !!appointment.recurrenceRule }, rawAppointment);
        each(this.scheduler._resourcesManager.getResourcesFromItem(result, true) || {}, (name, value) => result[name] = value);

        return result;
    }

    _createForm(element) {
        const { expr } = this.scheduler._dataAccessors;
        const resources = this.scheduler.option('resources');
        const allowTimeZoneEditing = this._getAllowTimeZoneEditing();
        const rawAppointment = this.state.appointment.data;
        const formData = this._createAppointmentFormData(rawAppointment);
        const readOnly = this._isReadOnly(rawAppointment);

        AppointmentForm.prepareAppointmentFormEditors(
            expr,
            this.scheduler,
            this.triggerResize.bind(this),
            this.changeSize.bind(this),
            formData,
            allowTimeZoneEditing,
            readOnly
        );

        if(resources && resources.length) {
            AppointmentForm.concatResources(this.scheduler._resourcesManager.getEditors());
        }

        return AppointmentForm.create(
            this.scheduler._createComponent.bind(this.scheduler),
            element,
            readOnly,
            formData,
        );
    }

    _getAllowTimeZoneEditing() {
        const scheduler = this.scheduler;
        return scheduler.option('editing.allowTimeZoneEditing') || scheduler.option('editing.allowEditingTimeZones');
    }

    _isReadOnly(rawAppointment) {
        const adapter = this.scheduler.createAppointmentAdapter(rawAppointment);
        if(rawAppointment && adapter.disabled) {
            return true;
        }
        return this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false;
    }

    _createAppointmentAdapter(rawAppointment) {
        return this.scheduler.createAppointmentAdapter(rawAppointment);
    }

    _updateForm() {
        const { data } = this.state.appointment;
        const adapter = this._createAppointmentAdapter(data);

        const allDay = adapter.allDay;
        const startDate = adapter.startDate && adapter.calculateStartDate('toAppointment');
        const endDate = adapter.endDate && adapter.calculateEndDate('toAppointment');

        this.state.appointment.isEmptyText = data === undefined || adapter.text === undefined;
        this.state.appointment.isEmptyDescription = data === undefined || adapter.description === undefined;

        const appointment = this._createAppointmentAdapter(this._createAppointmentFormData(data));
        if(appointment.text === undefined) {
            appointment.text = '';
        }
        if(appointment.description === undefined) {
            appointment.description = '';
        }
        if(appointment.recurrenceRule === undefined) {
            appointment.recurrenceRule = '';
        }

        const formData = appointment.source();

        if(startDate) {
            this.scheduler.fire('setField', 'startDate', formData, startDate);
        }
        if(endDate) {
            this.scheduler.fire('setField', 'endDate', formData, endDate);
        }

        const { startDateExpr, endDateExpr } = this.scheduler._dataAccessors.expr;

        this._appointmentForm.option('readOnly', this._isReadOnly(data));

        AppointmentForm.updateFormData(this._appointmentForm, formData, this.scheduler._dataAccessors.expr);
        AppointmentForm.setEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay);
    }

    _isDeviceMobile() {
        return devices.current().deviceType !== 'desktop';
    }

    _isPopupFullScreenNeeded() {
        const width = this._tryGetWindowWidth();
        if(width) {
            return this._isDeviceMobile() ? width < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH_MOBILE : width < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH;
        }
        return false;
    }

    _tryGetWindowWidth() {
        if(hasWindow()) {
            const window = getWindow();
            return $(window).width();
        }
    }

    triggerResize() {
        this._popup && triggerResizeEvent(this._popup.$element());
    }

    _getMaxWidth(isRecurrence) {
        if(this._isDeviceMobile()) {
            return APPOINTMENT_POPUP_WIDTH_MOBILE;
        }
        return isRecurrence ? APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE : APPOINTMENT_POPUP_WIDTH;
    }

    changeSize(isRecurrence) {
        const isFullScreen = this._isPopupFullScreenNeeded();
        this._popup.option({
            maxWidth: isFullScreen ? '100%' : this._getMaxWidth(isRecurrence),
            fullScreen: isFullScreen
        });
    }

    updatePopupFullScreenMode() {
        if(!this._appointmentForm) {
            return;
        }
        const isRecurrence = AppointmentForm.getRecurrenceRule(this._appointmentForm.option('formData'), this.scheduler._dataAccessors.expr);
        if(this.isVisible()) {
            this.changeSize(isRecurrence);
        }
    }

    _createPopupToolbarItems(isDoneButtonVisible) {
        const result = [];
        const isIOs = devices.current().platform === 'ios';

        if(isDoneButtonVisible) {
            result.push({
                shortcut: 'done',
                options: { text: messageLocalization.format('Done') },
                location: TOOLBAR_ITEM_AFTER_LOCATION,
                onClick: (e) => this._doneButtonClickHandler(e)
            });
        }
        result.push({
            shortcut: 'cancel',
            location: isIOs ? TOOLBAR_ITEM_BEFORE_LOCATION : TOOLBAR_ITEM_AFTER_LOCATION
        });

        return result;
    }

    saveChanges(showLoadPanel) {
        const deferred = new Deferred();
        const validation = this._appointmentForm.validate();
        const state = this.state.appointment;

        showLoadPanel && this._showLoadPanel();

        when(validation && validation.complete || validation).done((validation) => {
            if(validation && !validation.isValid) {
                this._hideLoadPanel();
                deferred.resolve(false);
                return;
            }

            // const formData = objectUtils.deepExtendArraySafe({}, this._appointmentForm.option('formData'), true);
            const formData = this._appointmentForm.option('formData');
            const adapter = this.scheduler.createAppointmentAdapter(formData);
            const appointment = adapter.clone({ pathTimeZone: 'fromAppointment' }).source(); // TODO:

            const oldData = this.scheduler._editAppointmentData;
            const recData = this.scheduler._updatedRecAppointment;

            if(state.isEmptyText && adapter.text === '') {
                delete appointment.text; // TODO
            }
            if(state.isEmptyDescription && adapter.description === '') {
                delete appointment.description; // TODO
            }
            if(state.data.recurrenceRule === undefined && adapter.recurrenceRule === '') { // TODO: plug for recurrent editor
                delete appointment.recurrenceRule;
            }
            if(isDefined(appointment.repeat)) {
                delete appointment.repeat; // TODO
            }

            if(oldData && !recData) {
                this.scheduler.updateAppointment(oldData, appointment)
                    .done(deferred.resolve);
            } else {
                if(recData) {
                    this.scheduler.updateAppointment(oldData, recData);
                    delete this.scheduler._updatedRecAppointment;
                }

                this.scheduler.addAppointment(appointment)
                    .done(deferred.resolve);
            }

            deferred.done(() => {
                this._hideLoadPanel();
                this.state.lastEditData = appointment;
            });
        });

        return deferred.promise();
    }

    _doneButtonClickHandler(e) {
        e.cancel = true;
        this.saveEditData();
    }

    saveEditData() {
        const deferred = new Deferred();

        if(this._tryLockSaveChanges()) {
            when(this.saveChanges(true)).done(() => {
                if(this.state.lastEditData) {
                    const adapter = this.scheduler.createAppointmentAdapter(this.state.lastEditData);

                    const { startDate, endDate, allDay } = adapter;

                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    const inAllDayRow = allDay || (endTime - startTime) >= DAY_IN_MS;

                    this.scheduler._workSpace.updateScrollPosition(
                        startDate,
                        this.scheduler._resourcesManager.getResourcesFromItem(this.state.lastEditData, true),
                        inAllDayRow,
                    );
                    this.state.lastEditData = null;
                }

                this._unlockSaveChanges();

                deferred.resolve();
            });
        }

        return deferred.promise();
    }

    _hideLoadPanel() {
        hideLoading();
    }

    _showLoadPanel() {
        const $overlayContent = this._popup.overlayContent();

        showLoading({
            container: $overlayContent,
            position: {
                of: $overlayContent
            }
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
