import $ from '../../core/renderer';
import { isPlainObject } from '../../core/utils/type';
import dateUtils from '../../core/utils/date';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import dateLocalization from '../../localization/date';
import { AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS } from './classes';
import { utils } from './utils';
import {
    getResourceManager,
    getAppointmentDataProvider,
    getTimeZoneCalculator
} from './instanceFactory';
import { createAppointmentAdapter } from './appointmentAdapter';

const toMs = dateUtils.dateToMilliseconds;

const subscribes = {
    getResourceManager: function() {
        return getResourceManager(this.key);
    },

    getAppointmentDataProvider: function() {
        return getAppointmentDataProvider(this.key);
    },

    isCurrentViewAgenda: function() {
        return this.option('currentView') === 'agenda';
    },
    currentViewUpdated: function(currentView) {
        this.option('currentView', currentView);
    },

    currentDateUpdated: function(date) {
        this.option('currentDate', date);
    },

    getOption: function(name) {
        return this.option(name);
    },

    getWorkspaceOption: function(name) {
        return this.getWorkSpace().option(name);
    },

    isVirtualScrolling: function() {
        return this.isVirtualScrolling();
    },

    setCellDataCacheAlias: function(appointment, geometry) {
        this._workSpace.setCellDataCacheAlias(appointment, geometry);
    },

    isGroupedByDate: function() { // TODO replace with ModelProvider
        return this.getWorkSpace().isGroupedByDate();
    },

    showAppointmentTooltip: function(options) {
        const targetedAppointment = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentTooltip(options.data, options.target, targetedAppointment);
    },

    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip();
    },

    showEditAppointmentPopup: function(options) {
        const targetedData = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentPopup(options.data, false, targetedData);
    },

    updateAppointmentAfterResize: function(options) {
        const info = utils.dataAccessors.getAppointmentInfo(options.$appointment);
        const exceptionDate = info.sourceAppointment.exceptionDate;

        this._checkRecurringAppointment(options.target, options.data, exceptionDate, (function() {
            this._updateAppointment(options.target, options.data, function() {
                this._appointments.moveAppointmentBack();
            });
        }).bind(this));
    },

    getUpdatedData: function(rawAppointment) {
        return this._getUpdatedData(rawAppointment);
    },

    updateAppointmentAfterDrag: function({ event, element, rawAppointment, coordinates }) {
        const info = utils.dataAccessors.getAppointmentInfo(element);

        const appointment = createAppointmentAdapter(this.key, rawAppointment);
        const targetedAppointment = createAppointmentAdapter(this.key, extend({}, rawAppointment, this._getUpdatedData(rawAppointment)));
        const targetedRawAppointment = targetedAppointment.source();

        const newCellIndex = this._workSpace.getDroppableCellIndex();
        const oldCellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);

        const becomeAllDay = targetedAppointment.allDay;
        const wasAllDay = appointment.allDay;

        const movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() &&
            (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);

        if((newCellIndex !== oldCellIndex) || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(rawAppointment, targetedRawAppointment, info.sourceAppointment.exceptionDate, (function() {

                this._updateAppointment(rawAppointment, targetedRawAppointment, function() {
                    this._appointments.moveAppointmentBack(event);
                }, event);
            }).bind(this), undefined, undefined, event);
        } else {
            this._appointments.moveAppointmentBack(event);
        }
    },

    onDeleteButtonPress: function(options) {
        const targetedData = this.getTargetedAppointment(options.data, $(options.target));
        this.checkAndDeleteAppointment(options.data, targetedData);

        this.hideAppointmentTooltip();
    },

    getTextAndFormatDate(appointmentRaw, targetedAppointmentRaw, format) { // TODO: rename to createFormattedDateText
        const appointmentAdapter = createAppointmentAdapter(this.key, appointmentRaw);
        const targetedAdapter = createAppointmentAdapter(this.key, (targetedAppointmentRaw || appointmentRaw));
        const timeZoneCalculator = getTimeZoneCalculator(this.key);

        // TODO pull out time zone converting from appointment adapter for knockout(T947938)
        const startDate = timeZoneCalculator.createDate(targetedAdapter.startDate, { path: 'toGrid' });
        const endDate = timeZoneCalculator.createDate(targetedAdapter.endDate, { path: 'toGrid' });

        const formatType = format || this.fire('_getTypeFormat', startDate, endDate, targetedAdapter.allDay);

        return {
            text: targetedAdapter.text || appointmentAdapter.text,
            formatDate: this.fire('_formatDates', startDate, endDate, formatType)
        };
    },

    _getTypeFormat(startDate, endDate, isAllDay) {
        if(isAllDay) {
            return 'DATE';
        }
        if(this.option('currentView') !== 'month' && dateUtils.sameDate(startDate, endDate)) {
            return 'TIME';
        }
        return 'DATETIME';
    },

    _createAppointmentTitle(data) {
        if(isPlainObject(data)) {
            return data.text;
        }

        return String(data);
    },

    _formatDates(startDate, endDate, formatType) {
        const dateFormat = 'monthandday';
        const timeFormat = 'shorttime';
        const isSameDate = startDate.getDate() === endDate.getDate();

        switch(formatType) {
            case 'DATETIME':
                return [
                    dateLocalization.format(startDate, dateFormat),
                    ' ',
                    dateLocalization.format(startDate, timeFormat),
                    ' - ',
                    isSameDate ? '' : dateLocalization.format(endDate, dateFormat) + ' ',
                    dateLocalization.format(endDate, timeFormat)
                ].join('');
            case 'TIME':
                return `${dateLocalization.format(startDate, timeFormat)} - ${dateLocalization.format(endDate, timeFormat)}`;
            case 'DATE':
                return `${dateLocalization.format(startDate, dateFormat)}${isSameDate ? '' : ' - ' + dateLocalization.format(endDate, dateFormat)}`;
        }
    },

    getResizableAppointmentArea: function(options) {
        const allDay = options.allDay;
        const groups = this._getCurrentViewOption('groups');

        if(groups && groups.length) {
            if(allDay || this.getLayoutManager().getRenderingStrategyInstance()._needHorizontalGroupBounds()) {
                const horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                return {
                    left: horizontalGroupBounds.left,
                    right: horizontalGroupBounds.right,
                    top: 0,
                    bottom: 0
                };
            }

            if(this.getLayoutManager().getRenderingStrategyInstance()._needVerticalGroupBounds(allDay) && this._workSpace._isVerticalGroupedWorkSpace()) {
                const verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                return {
                    left: 0,
                    right: 0,
                    top: verticalGroupBounds.top,
                    bottom: verticalGroupBounds.bottom
                };
            }
        }
    },

    needRecalculateResizableArea: function() {
        return this.getWorkSpace().needRecalculateResizableArea();
    },

    getAppointmentGeometry: function(settings) {
        return this.getLayoutManager().getRenderingStrategyInstance().getAppointmentGeometry(settings);
    },

    isAllDay: function(appointmentData) {
        return this.getLayoutManager().getRenderingStrategyInstance().isAllDay(appointmentData);
    },

    getDeltaTime: function(e, initialSize, itemData) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDeltaTime(e, initialSize, itemData);
    },

    getDropDownAppointmentWidth: function(isAllDay) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentWidth(this._getViewCountConfig().intervalCount, isAllDay);
    },

    getDropDownAppointmentHeight: function() {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentHeight();
    },

    getCellWidth: function() {
        return this.getWorkSpace().getCellWidth();
    },

    getCellHeight: function() {
        return this.getWorkSpace().getCellHeight();
    },

    getMaxAppointmentCountPerCellByType: function(isAllDay) {
        return this.getRenderingStrategyInstance()._getMaxAppointmentCountPerCellByType(isAllDay);
    },

    needCorrectAppointmentDates: function() {
        return this.getRenderingStrategyInstance().needCorrectAppointmentDates();
    },

    getRenderingStrategyDirection: function() {
        return this.getRenderingStrategyInstance().getDirection();
    },

    getWorkSpaceDateTableOffset: function() {
        return this.getWorkSpaceDateTableOffset();
    },

    getFullWeekAppointmentWidth: function(options) {
        const groupIndex = options.groupIndex;
        return this._workSpace.getGroupWidth(groupIndex);
    },

    getMaxAppointmentWidth: function(options) {
        const workSpace = this._workSpace;
        return workSpace.getCellCountToLastViewDate(options.date) * workSpace.getCellWidth();
    },

    updateAppointmentStartDate: function(options) {
        const appointment = options.appointment;
        const firstViewDate = this._workSpace.getStartViewDate();
        let startDate = new Date(options.startDate);
        const startDayHour = this._getCurrentViewOption('startDayHour');
        let updatedStartDate;

        if(this.appointmentTakesAllDay(appointment)) {
            updatedStartDate = dateUtils.normalizeDate(startDate, firstViewDate);
        } else {
            if(startDate < firstViewDate) {
                startDate = firstViewDate;
            }
            updatedStartDate = dateUtils.normalizeDate(options.startDate, new Date(startDate));
        }

        return dateUtils.roundDateByStartDayHour(updatedStartDate, startDayHour);
    },

    updateAppointmentEndDate: function(options) {
        const endDate = options.endDate;
        const endDayHour = this._getCurrentViewOption('endDayHour');
        const startDayHour = this._getCurrentViewOption('startDayHour');

        let updatedEndDate = endDate;

        if(endDate.getHours() >= endDayHour) {
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        } else if(!options.isSameDate && startDayHour > 0 && (endDate.getHours() * 60 + endDate.getMinutes() < (startDayHour * 60))) {
            updatedEndDate = new Date(updatedEndDate.getTime() - toMs('day'));
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        }
        return updatedEndDate;
    },

    renderCompactAppointments: function(options) {
        this._compactAppointmentsHelper.render(options);
    },

    clearCompactAppointments: function() {
        this._compactAppointmentsHelper.clear();
    },

    supportCompactDropDownAppointments: function() {
        return this._workSpace._supportCompactDropDownAppointments();
    },

    isApplyCompactAppointmentOffset: function() {
        return this._workSpace._isApplyCompactAppointmentOffset();
    },

    getGroupCount: function() {
        return this._workSpace._getGroupCount();
    },

    mapAppointmentFields: function(config) {
        const { itemData, itemElement, targetedAppointment } = config;
        const targetedData = targetedAppointment || this.getTargetedAppointment(itemData, itemElement);

        return {
            appointmentData: config.itemData,
            appointmentElement: config.itemElement,
            targetedAppointmentData: targetedData,
        };
    },

    getOffsetByAllDayPanel: function(groupIndex) {
        return this._workSpace._getOffsetByAllDayPanel(groupIndex);
    },

    getGroupTop: function(groupIndex) {
        return this._workSpace._getGroupTop(groupIndex);
    },

    dayHasAppointment: function(day, appointment, trimTime) {
        return this.dayHasAppointment(day, appointment, trimTime);
    },

    getLayoutManager: function() {
        return this._layoutManager;
    },

    getAgendaVerticalStepHeight: function() {
        return this.getWorkSpace().getAgendaVerticalStepHeight();
    },

    getAgendaDuration: function() {
        return this._getCurrentViewOption('agendaDuration');
    },

    getStartViewDate: function() {
        return this.getStartViewDate();
    },

    getEndViewDate: function() {
        return this.getEndViewDate();
    },

    forceMaxAppointmentPerCell: function() {
        return this.forceMaxAppointmentPerCell();
    },

    onAgendaReady: function(rows) {
        const $appts = this.getAppointmentsInstance()._itemElements();
        let total = 0;

        const applyClass = function(_, count) {
            const index = count + total - 1;
            $appts.eq(index).addClass(AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS);
            total += count;
        };

        for(let i = 0; i < rows.length; i++) {
            each(rows[i], applyClass);
        }
    },

    getTimezone: function() {
        return this._getTimezoneOffsetByOption();
    },

    getTargetedAppointmentData: function(appointment, element) {
        return this.getTargetedAppointment(appointment, element);
    },

    getEndDayHour: function() {
        return this._workSpace.option('endDayHour') || this.option('endDayHour');
    },

    getStartDayHour: function() {
        return this._workSpace.option('startDayHour') || this.option('startDayHour');
    },

    isAdaptive: function() {
        return this.option('adaptivityEnabled');
    },

    removeDroppableCellClass: function() {
        this._workSpace.removeDroppableCellClass();
    }
};
export default subscribes;
