import devices from '../../../core/devices';
import $ from '../../../core/renderer';
import dateUtils from '../../../core/utils/date';
import { Deferred, when } from '../../../core/utils/deferred';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { isDefined } from '../../../core/utils/type';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { triggerResizeEvent } from '../../../events/visibility_change';
import messageLocalization from '../../../localization/message';
import Popup from '../../popup';
import { hide as hideLoading, show as showLoading } from '../loading';
import { createAppointmentAdapter } from '../appointmentAdapter';
import { ExpressionUtils } from '../expressionUtils';

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = 'dx-scheduler';
const APPOINTMENT_POPUP_CLASS = `${WIDGET_CLASS}-appointment-popup`;

const POPUP_WIDTH = {
    DEFAULT: 485,
    RECURRENCE: 970,
    FULLSCREEN: 1000,

    MOBILE: {
        DEFAULT: 350,
        FULLSCREEN: 500
    }
};

const TOOLBAR_LOCATION = {
    AFTER: 'after',
    BEFORE: 'before'
};

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

const isMobile = () => {
    return devices.current().deviceType !== 'desktop';
};

const isIOSPlatform = () => {
    return devices.current().platform === 'ios';
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
                isEmptyText: false,
                isEmptyDescription: false
            },
        };
    }

    get key() {
        return this.scheduler.getKey();
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

        this.popup.option('toolbarItems', this._createPopupToolbarItems(config.isToolbarVisible));
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
            onShowing: e => this._onShowing(e)
        };
    }

    _onShowing(e) {
        this._updateForm();

        const arg = {
            form: this.form.form,
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

    _createAppointmentFormData(rawAppointment) {
        const appointment = this._createAppointmentAdapter(rawAppointment);
        const result = extend(true, { repeat: !!appointment.recurrenceRule }, rawAppointment);
        const resourceManager = this.scheduler.getResourceManager();

        each(resourceManager.getResourcesFromItem(result, true) || {}, (name, value) => result[name] = value);

        return result;
    }

    _createForm() {
        const { expr } = this.scheduler.getDataAccessors();
        const allowTimeZoneEditing = this._getAllowTimeZoneEditing();
        const rawAppointment = this.state.appointment.data;
        const formData = this._createAppointmentFormData(rawAppointment);

        this.form.create(
            expr,
            this.triggerResize.bind(this),
            this.changeSize.bind(this),
            formData,
            allowTimeZoneEditing,
            formData
        );
    }

    _getAllowTimeZoneEditing() {
        return this.scheduler.getEditingConfig().allowTimeZoneEditing;
    }

    _isReadOnly(rawAppointment) {
        const adapter = this._createAppointmentAdapter(rawAppointment);

        if(rawAppointment && adapter.disabled) {
            return true;
        }

        if(this.state.action === ACTION_TO_APPOINTMENT.CREATE) {
            return false;
        }

        return !this.scheduler.getEditingConfig().allowUpdating;
    }

    _createAppointmentAdapter(rawAppointment) {
        return createAppointmentAdapter(this.key, rawAppointment);
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
            ExpressionUtils.setField(this.key, 'startDate', formData, startDate);
        }
        if(endDate) {
            ExpressionUtils.setField(this.key, 'endDate', formData, endDate);
        }

        const { startDateExpr, endDateExpr } = this.scheduler.getDataAccessors().expr;

        this.form.readOnly = this._isReadOnly(data);

        this.form.updateFormData(formData, this.scheduler.getDataAccessors().expr);
        this.form.setEditorsType(startDateExpr, endDateExpr, allDay);
    }

    _isPopupFullScreenNeeded() {
        const width = this._tryGetWindowWidth();
        if(width) {
            return isMobile() ? width < POPUP_WIDTH.MOBILE.FULLSCREEN : width < POPUP_WIDTH.FULLSCREEN;
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
        this.popup && triggerResizeEvent(this.popup.$element());
    }

    _getMaxWidth(isRecurrence) {
        if(isMobile()) {
            return POPUP_WIDTH.MOBILE.DEFAULT;
        }
        return isRecurrence ? POPUP_WIDTH.RECURRENCE : POPUP_WIDTH.DEFAULT;
    }

    changeSize(isRecurrence) {
        const isFullScreen = this._isPopupFullScreenNeeded();
        this.popup.option({
            maxWidth: isFullScreen ? '100%' : this._getMaxWidth(isRecurrence),
            fullScreen: isFullScreen
        });
    }

    updatePopupFullScreenMode() {
        if(this.form.dxForm) {
            const formData = this.form.formData;
            const isRecurrence = formData[this.scheduler.getDataAccessors().expr.recurrenceRuleExpr];

            if(this.visible) {
                this.changeSize(isRecurrence);
            }
        }
    }

    _createPopupToolbarItems(isVisible) {
        const result = [];

        if(isVisible) {
            result.push({
                shortcut: 'done',
                options: { text: messageLocalization.format('Done') },
                location: TOOLBAR_LOCATION.AFTER,
                onClick: (e) => this._doneButtonClickHandler(e)
            });
        }
        result.push({
            shortcut: 'cancel',
            location: isIOSPlatform() ? TOOLBAR_LOCATION.BEFORE : TOOLBAR_LOCATION.AFTER
        });

        return result;
    }

    saveChanges(showLoadPanel) {
        const deferred = new Deferred();
        const validation = this.form.dxForm.validate();
        const state = this.state.appointment;

        showLoadPanel && this._showLoadPanel();

        when(validation && validation.complete || validation).done((validation) => {
            if(validation && !validation.isValid) {
                hideLoading();
                deferred.resolve(false);
                return;
            }

            const formData = this.form.formData;
            const adapter = this._createAppointmentAdapter(formData);
            const appointment = adapter.clone({ pathTimeZone: 'fromAppointment' }).source(); // TODO:

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
        this.saveEditData();
    }

    saveEditData() {
        const deferred = new Deferred();

        if(this._tryLockSaveChanges()) {
            when(this.saveChanges(true)).done(() => {
                if(this.state.lastEditData) {
                    const adapter = this._createAppointmentAdapter(this.state.lastEditData);

                    const { startDate, endDate, allDay } = adapter;

                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    const inAllDayRow = allDay || (endTime - startTime) >= DAY_IN_MS;
                    const resourceManager = this.scheduler.getResourceManager();

                    this.scheduler.updateScrollPosition(
                        startDate,
                        resourceManager.getResourcesFromItem(this.state.lastEditData, true),
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

    _showLoadPanel() {
        const container = this.popup.$overlayContent();

        showLoading({
            container,
            position: {
                of: container
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
