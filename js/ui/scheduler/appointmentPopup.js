import $ from '../../core/renderer';
import Popup from '../popup';
import windowUtils from '../../core/utils/window';
import devices from '../../core/devices';
import domUtils from '../../core/utils/dom';
import objectUtils from '../../core/utils/object';
import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { Deferred, when } from '../../core/utils/deferred';
import { isDefined } from '../../core/utils/type';
import messageLocalization from '../../localization/message';
import { APPOINTMENT_FORM_GROUP_NAMES, AppointmentForm } from './ui.scheduler.appointment_form';
import loading from './ui.loading';

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
                processTimeZone: false,
                isEmptyText: false,
                isEmptyDescription: false
            }
        };
    }

    show(data = {}, isDoneButtonVisible, processTimeZone) {
        this.state.appointment.data = data;
        this.state.appointment.processTimeZone = processTimeZone;

        if(!this._popup) {
            const popupConfig = this._createPopupConfig();
            this._popup = this._createPopup(popupConfig);
        } else {
            this._updateForm();
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
            onShowing: this._onShowing.bind(this),
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
        this._updateForm();
        return formElement;
    }

    _createAppointmentFormData(appointmentData) {
        const recurrenceRule = this.scheduler.fire('getField', 'recurrenceRule', appointmentData);
        const result = extend(true, { repeat: !!recurrenceRule }, appointmentData);
        each(this.scheduler._resourcesManager.getResourcesFromItem(result, true) || {}, (name, value) => result[name] = value);

        return result;
    }

    _createForm(element) {
        const { expr } = this.scheduler._dataAccessors;
        const resources = this.scheduler.option('resources');
        const allowTimeZoneEditing = this._getAllowTimeZoneEditing();
        const appointmentData = this.state.appointment.data;
        const formData = this._createAppointmentFormData(appointmentData);
        const readOnly = this._isReadOnly(appointmentData);

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

    _isReadOnly(data) {
        const disabled = this.scheduler.fire('getField', 'disabled', data);
        if(data && disabled) {
            return true;
        }
        return this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false;
    }

    _updateForm() {
        const { data, processTimeZone } = this.state.appointment;
        const allDay = this.scheduler.fire('getField', 'allDay', data);
        let startDate = this.scheduler.fire('getField', 'startDate', data);
        let endDate = this.scheduler.fire('getField', 'endDate', data);
        this.state.appointment.isEmptyText = data === undefined || data.text === undefined;
        this.state.appointment.isEmptyDescription = data === undefined || data.description === undefined;

        const formData = extend({}, { text: '', description: '', recurrenceRule: '' }, this._createAppointmentFormData(data));

        if(processTimeZone) {
            if(startDate) {
                startDate = this.scheduler.fire('convertDateByTimezone', startDate);
                this.scheduler.fire('setField', 'startDate', formData, startDate);
            }
            if(endDate) {
                endDate = this.scheduler.fire('convertDateByTimezone', endDate);
                this.scheduler.fire('setField', 'endDate', formData, endDate);
            }
        }

        const { startDateExpr, endDateExpr, recurrenceRuleExpr } = this.scheduler._dataAccessors.expr;
        const recurrenceEditorOptions = this._getEditorOptions(recurrenceRuleExpr, APPOINTMENT_FORM_GROUP_NAMES.Recurrence);
        this._setEditorOptions(recurrenceRuleExpr, APPOINTMENT_FORM_GROUP_NAMES.Recurrence, extend({}, recurrenceEditorOptions, { startDate: startDate }));
        this._appointmentForm.option('readOnly', this._isReadOnly(data));

        AppointmentForm.updateFormData(this._appointmentForm, formData);
        AppointmentForm.setEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay);
    }

    _getEditorOptions(name, groupName) {
        const editor = this._appointmentForm.itemOption(`${groupName}.${name}`);
        return editor ? editor.editorOptions : {};
    }

    _setEditorOptions(name, groupName, options) {
        const editorPath = `${groupName}.${name}`;
        const editor = this._appointmentForm.itemOption(editorPath);
        editor && this._appointmentForm.itemOption(editorPath, 'editorOptions', options);
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
        if(windowUtils.hasWindow()) {
            const window = windowUtils.getWindow();
            return $(window).width();
        }
    }

    triggerResize() {
        this._popup && domUtils.triggerResizeEvent(this._popup.$element());
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

        const convert = (obj, dateFieldName) => {
            const date = new Date(this.scheduler.fire('getField', dateFieldName, obj));
            const tzDiff = this.scheduler._getTimezoneOffsetByOption() * toMs('hour') + this.scheduler.fire('getClientTimezoneOffset', date);

            return new Date(date.getTime() + tzDiff);
        };

        showLoadPanel && this._showLoadPanel();

        when(validation && validation.complete || validation).done((validation) => {
            if(validation && !validation.isValid) {
                this._hideLoadPanel();
                deferred.resolve(false);
                return;
            }

            const formData = objectUtils.deepExtendArraySafe({}, this._getFormData(), true);
            const oldData = this.scheduler._editAppointmentData;
            const recData = this.scheduler._updatedRecAppointment;

            if(state.isEmptyText && formData.text === '') {
                delete formData.text;
            }
            if(state.isEmptyDescription && formData.description === '') {
                delete formData.description;
            }

            if(state.data.recurrenceRule === undefined && formData.recurrenceRule === '') { // TODO: plug for recurrent editor
                delete formData.recurrenceRule;
            }
            if(isDefined(formData.repeat)) {
                delete formData.repeat;
            }

            if(oldData) {
                this.scheduler._convertDatesByTimezoneBack(false, formData);
            }

            if(oldData && !recData) {
                this.scheduler.updateAppointment(oldData, formData)
                    .done(deferred.resolve);
            } else {
                if(recData) {
                    this.scheduler.updateAppointment(oldData, recData);
                    delete this.scheduler._updatedRecAppointment;

                    if(typeof this.scheduler._getTimezoneOffsetByOption() === 'number') {
                        this.scheduler.fire('setField', 'startDate', formData, convert.call(this, formData, 'startDate'));
                        this.scheduler.fire('setField', 'endDate', formData, convert.call(this, formData, 'endDate'));
                    }
                }

                this.scheduler.addAppointment(formData)
                    .done(deferred.resolve);
            }

            deferred.done(() => {
                this._hideLoadPanel();
                this.state.lastEditData = formData;
            });
        });

        return deferred.promise();
    }

    _getFormData() {
        const formData = this._appointmentForm.option('formData');
        const startDate = this.scheduler.fire('getField', 'startDate', formData);
        const endDate = this.scheduler.fire('getField', 'endDate', formData);

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

        if(this._tryLockSaveChanges()) {
            when(this.saveChanges(true)).done(() => {
                if(this.state.lastEditData) {
                    const startDate = this.scheduler.fire('getField', 'startDate', this.state.lastEditData);
                    this.scheduler._workSpace.updateScrollPosition(startDate);
                    this.state.lastEditData = null;
                }

                this._unlockSaveChanges();

                deferred.resolve();
            });
        }

        return deferred.promise();
    }

    _hideLoadPanel() {
        loading.hide();
    }

    _showLoadPanel() {
        const $overlayContent = this._popup.overlayContent();

        loading.show({
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
