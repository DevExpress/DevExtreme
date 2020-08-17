import $ from '../../core/renderer';
import array from '../../core/utils/array';
import { isDefined, isPlainObject } from '../../core/utils/type';
import dateUtils from '../../core/utils/date';
import { each } from '../../core/utils/iterator';
import errors from '../widget/ui.errors';
import translator from '../../animation/translator';
import { grep } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import SchedulerTimezones from './timezones/ui.scheduler.timezones';
import { Deferred } from '../../core/utils/deferred';
import dateLocalization from '../../localization/date';
import timeZoneUtils from './utils.timeZone';
import { AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS } from './constants';
import utils from './utils';

const MINUTES_IN_HOUR = 60;
const toMs = dateUtils.dateToMilliseconds;

const subscribes = {
    isCurrentViewAgenda: function() {
        return this.option('currentView') === 'agenda';
    },
    currentViewUpdated: function(currentView) {
        this.option('currentView', currentView);
    },

    currentDateUpdated: function(date) {
        this.option('currentDate', date);
    },

    setCellDataCacheAlias: function(appointment, geometry) {
        this._workSpace.setCellDataCacheAlias(appointment, geometry);
    },

    createAppointmentSettings: function(args) {
        return this._createAppointmentSettings(args.appointmentData); // TODO: temporary solution
    },

    isGroupedByDate: function() {
        return this.getWorkSpace().isGroupedByDate();
    },

    showAppointmentTooltip: function(options) {
        const targetedAppointment = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentTooltip(options.data, options.target, targetedAppointment);
    },

    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip();
    },

    showAddAppointmentPopup: function(cellData, cellGroups) {
        const appointmentAdapter = this.createAppointmentAdapter({});

        appointmentAdapter.allDay = cellData.allDay;
        appointmentAdapter.startDate = this.timeZoneCalculator.createDate(cellData.startDate, { path: 'fromGrid' });
        appointmentAdapter.endDate = this.timeZoneCalculator.createDate(cellData.endDate, { path: 'fromGrid' });

        const resultAppointment = extend(appointmentAdapter.source(), cellGroups);
        this.showAppointmentPopup(resultAppointment, true);
    },

    showEditAppointmentPopup: function(options) {
        const targetedData = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentPopup(options.data, false, targetedData);
    },

    updateAppointmentAfterResize: function(options) {
        const info = utils.dataAccessors.getAppointmentInfo(options.$appointment);
        const exceptionDate = info.sourceAppointment.startDate;

        this._checkRecurringAppointment(options.target, options.data, exceptionDate, (function() {
            this._updateAppointment(options.target, options.data, function() {
                this._appointments.moveAppointmentBack();
            });
        }).bind(this));
    },

    getUpdatedData: function(options) {
        return this._getUpdatedData({ data: options.data });
    },

    updateAppointmentAfterDrag: function(options) {
        const info = utils.dataAccessors.getAppointmentInfo(options.$appointment);

        const sourceAppointment = options.data;
        const sourceAppointmentAdapter = this.createAppointmentAdapter(sourceAppointment);

        const currentAppointmentAdapter = this.createAppointmentAdapter(extend({}, sourceAppointment, this._getUpdatedData(options)))
            .clone({ pathTimeZone: 'fromGrid' });
        const currentAppointmentWithoutConverting = currentAppointmentAdapter.source();

        const newCellIndex = this._workSpace.getDroppableCellIndex();
        const oldCellIndex = this._workSpace.getCellIndexByCoordinates(options.coordinates);

        const becomeAllDay = currentAppointmentAdapter.allDay;
        const wasAllDay = sourceAppointmentAdapter.allDay;

        const dragEvent = options.event;

        const movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() && (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);

        if((newCellIndex !== oldCellIndex) || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(sourceAppointment, currentAppointmentWithoutConverting, info.sourceAppointment.startDate, (function() {

                this._updateAppointment(sourceAppointment, currentAppointmentWithoutConverting, function() {
                    this._appointments.moveAppointmentBack(dragEvent);
                }, dragEvent);
            }).bind(this), undefined, undefined, dragEvent);
        } else {
            this._appointments.moveAppointmentBack(dragEvent);
        }
    },

    onDeleteButtonPress: function(options) {
        const targetedData = this.getTargetedAppointment(options.data, $(options.target));
        this.checkAndDeleteAppointment(options.data, targetedData);

        this.hideAppointmentTooltip();
    },

    getAppointmentColor: function(options) {
        const resourcesManager = this._resourcesManager;
        const resourceForPainting = resourcesManager.getResourceForPainting(this._getCurrentViewOption('groups'));
        let response = new Deferred().resolve().promise();

        if(resourceForPainting) {
            const field = resourcesManager.getField(resourceForPainting);
            const groupIndex = options.groupIndex;
            const groups = this._workSpace._getCellGroups(groupIndex);
            const resourceValues = array.wrapToArray(resourcesManager.getDataAccessors(field, 'getter')(options.itemData));
            let groupId = resourceValues.length ? resourceValues[0] : undefined;

            for(let i = 0; i < groups.length; i++) {
                if(groups[i].name === field) {
                    groupId = groups[i].id;
                    break;
                }
            }

            response = resourcesManager.getResourceColor(field, groupId);
        }
        return response;
    },

    getHeaderHeight: function() {
        return this._header._$element && parseInt(this._header._$element.outerHeight(), 10);
    },

    getResourcesFromItem: function(itemData) {
        return this._resourcesManager.getResourcesFromItem(itemData);
    },

    getBoundOffset: function() {
        return { top: -this.getWorkSpaceAllDayHeight() };
    },

    appointmentTakesSeveralDays: function(appointment) {
        return this._appointmentModel.appointmentTakesSeveralDays(appointment);
    },

    getTextAndFormatDate(appointment, targetedAppointment, format) { // TODO: rename to createFormattedDateText
        const appointmentAdapter = this.createAppointmentAdapter(appointment);
        const adapter = this.createAppointmentAdapter(targetedAppointment || appointment)
            .clone({ pathTimeZone: 'toGrid' });

        const formatType = format || this.fire('_getTypeFormat', adapter.startDate, adapter.endDate, adapter.allDay);

        return {
            text: adapter.text || appointmentAdapter.text,
            formatDate: this.fire('_formatDates', adapter.startDate, adapter.endDate, formatType)
        };
    },

    _getAppointmentFields(data, arrayOfFields) {
        return arrayOfFields.reduce((accumulator, field) => {
            accumulator[field] = this.fire('getField', field, data);
            return accumulator;
        }, {});
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
        const isDurationLessThanDay = (endDate.getTime() - startDate.getTime()) <= toMs('day');

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
                return `${dateLocalization.format(startDate, dateFormat)}${isDurationLessThanDay || isSameDate ? '' : ' - ' + dateLocalization.format(endDate, dateFormat)}`;
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
        return this._cellWidth;
    },

    getCellHeight: function() {
        return this._cellHeight;
    },

    getResizableStep: function() {
        const cellWidth = this._cellWidth;
        const workSpace = this.getWorkSpace();

        if(workSpace.isGroupedByDate()) {
            return workSpace._getGroupCount() * cellWidth;
        }

        return cellWidth;
    },

    getRenderingStrategy: function() {
        return this._getAppointmentsRenderingStrategy();
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
        const targetedData = this.getTargetedAppointment(config.itemData, config.itemElement);

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

    updateResizableArea: function() {
        const $allResizableElements = this.$element().find('.dx-scheduler-appointment.dx-resizable');

        const horizontalResizables = grep($allResizableElements, function(el) {
            const $el = $(el);
            const resizableInst = $el.dxResizable('instance');
            const area = resizableInst.option('area');

            return inArray(resizableInst.option('handles'), ['right left', 'left right']) > -1 && isPlainObject(area);
        });

        each(horizontalResizables, (function(_, el) {
            const $el = $(el);
            const position = translator.locate($el);
            const appointmentData = this._appointments._getItemData($el);

            const area = this._appointments._calculateResizableArea({
                left: position.left
            }, appointmentData);

            $el.dxResizable('instance').option('area', area);

        }).bind(this));
    },

    getField: function(field, obj) {
        if(!isDefined(this._dataAccessors.getter[field])) {
            return;
        }

        return this._dataAccessors.getter[field](obj);
    },

    setField: function(field, obj, value) {
        if(!isDefined(this._dataAccessors.setter[field])) {
            return;
        }

        const splitExprStr = this.option(field + 'Expr').split('.');
        const rootField = splitExprStr[0];

        if(obj[rootField] === undefined && splitExprStr.length > 1) {
            const emptyChain = (function(arr) {
                const result = {};
                let tmp = result;
                const arrLength = arr.length - 1;

                for(let i = 1; i < arrLength; i++) {
                    tmp = tmp[arr[i]] = {};
                }

                return result;
            })(splitExprStr);

            obj[rootField] = emptyChain;
        }

        this._dataAccessors.setter[field](obj, value);
        return obj;
    },

    prerenderFilter: function() {
        const dateRange = this.getWorkSpace().getDateRange();
        const resources = this._resourcesManager.getResourcesData();
        let allDay;

        if(!this.option('showAllDayPanel') && this._workSpace.supportAllDayRow()) {
            allDay = false;
        }

        return this._appointmentModel.filterLoadedAppointments({
            startDayHour: this._getCurrentViewOption('startDayHour'),
            endDayHour: this._getCurrentViewOption('endDayHour'),
            min: dateRange[0],
            max: dateRange[1],
            resources: resources,
            allDay: allDay,
            firstDayOfWeek: this.getFirstDayOfWeek(),
            recurrenceException: this._getRecurrenceException.bind(this),
        }, this._subscribes['convertDateByTimezone'].bind(this));
    },

    dayHasAppointment: function(day, appointment, trimTime) {
        return this.dayHasAppointment(day, appointment, trimTime);
    },

    createResourcesTree: function() {
        return this._resourcesManager.createResourcesTree(this._loadedResources);
    },

    getResourceTreeLeaves: function(tree, appointmentResources) {
        return this._resourcesManager.getResourceTreeLeaves(tree, appointmentResources);
    },

    createReducedResourcesTree: function() {
        const tree = this._resourcesManager.createResourcesTree(this._loadedResources);

        return this._resourcesManager.reduceResourcesTree(tree, this.getFilteredItems());
    },

    groupAppointmentsByResources: function(appointments) {
        let result = { '0': appointments };
        const groups = this._getCurrentViewOption('groups');

        if(groups && groups.length && this._resourcesManager.getResourcesData().length) {
            result = this._resourcesManager.groupAppointmentsByResources(appointments, this._loadedResources);
        }

        let totalResourceCount = 0;

        each(this._loadedResources, function(i, resource) {
            if(!i) {
                totalResourceCount = resource.items.length;
            } else {
                totalResourceCount *= resource.items.length;
            }
        });

        for(let j = 0; j < totalResourceCount; j++) {
            const index = j.toString();

            if(result[index]) {
                continue;
            }

            result[index] = [];
        }

        return result;
    },

    getAgendaRows: function(options) {
        const renderingStrategy = this._layoutManager.getRenderingStrategyInstance();
        const calculateRows = renderingStrategy.calculateRows.bind(renderingStrategy);
        const d = new Deferred();

        function rowsCalculated(appointments) {
            const result = calculateRows(appointments, options.agendaDuration, options.currentDate);
            this._dataSourceLoadedCallback.remove(rowsCalculated);

            d.resolve(result);
        }

        this._dataSourceLoadedCallback.add(rowsCalculated);

        return d.promise();
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

    getMaxAppointmentsPerCell: function() {
        return this.getMaxAppointmentsPerCell();
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

    getClientTimezoneOffset: function(date) {
        date = date || new Date();
        return SchedulerTimezones.getClientTimezoneOffset(date);
    },

    convertDateByTimezone: function(date, appointmentTimezone, skipAppointmentTimezone) {
        date = new Date(date);

        const tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets);
        if(!skipAppointmentTimezone || skipAppointmentTimezone && !appointmentTimezone) {
            date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets);
        }

        return date;
    },

    convertDateByTimezoneBack: function(date, appointmentTimezone, skipAppointmentTimezone) {
        date = new Date(date);

        const tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets, true);
        if(!skipAppointmentTimezone || skipAppointmentTimezone && !appointmentTimezone) {
            date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets, true);
        }

        return date;
    },

    translateDateToAppointmentTimeZone: function(date, offsets, back) {
        const operation = back ? -1 : 1;
        const dateInUTC = date.getTime() - operation * offsets.client * toMs('hour');
        return new Date(dateInUTC + operation * offsets.appointment * toMs('hour'));
    },

    translateDateToCommonTimeZone: function(date, offsets, back) {
        const operation = back ? -1 : 1;
        if(typeof offsets.common === 'number') {
            const offset = offsets.common - offsets.appointment;
            const hoursOffset = (offset < 0 ? -1 : 1) * Math.floor(Math.abs(offset));
            const minutesOffset = offset % 1;

            date.setHours(date.getHours() + operation * hoursOffset);
            date.setMinutes(date.getMinutes() + operation * minutesOffset * MINUTES_IN_HOUR);
        }
        return date;
    },

    getComplexOffsets: function(scheduler, date, appointmentTimezone) {
        const clientTimezoneOffset = -this.getClientTimezoneOffset(date) / toMs('hour');
        const commonTimezoneOffset = scheduler._getTimezoneOffsetByOption(date);
        let appointmentTimezoneOffset = timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== 'number') {
            appointmentTimezoneOffset = clientTimezoneOffset;
        }

        return {
            client: clientTimezoneOffset,
            common: commonTimezoneOffset || clientTimezoneOffset,
            appointment: appointmentTimezoneOffset
        };
    },

    getTimezonesDisplayName: function() {
        return SchedulerTimezones.getTimezonesDisplayName();
    },

    getTimezoneDisplayNameById: function(id) {
        return SchedulerTimezones.getTimezoneDisplayNameById(id);
    },

    getSimilarTimezones: function(id) {
        return SchedulerTimezones.getSimilarTimezones(id);
    },

    getTimezonesIdsByDisplayName: function(displayName) {
        return SchedulerTimezones.getTimezonesIdsByDisplayName(displayName);
    },

    getTargetedAppointmentData: function(appointment, element) {
        return this.getTargetedAppointment(appointment, element);
    },

    getAppointmentDurationInMs: function(options) {
        const startDate = options.startDate;
        const endDate = options.endDate;
        const allDay = options.allDay;
        const appointmentDuration = endDate.getTime() - startDate.getTime();

        const dayDuration = toMs('day');
        const visibleDayDuration = this._workSpace.getVisibleDayDuration();
        let result = 0;

        if(allDay) {
            const ceilQuantityOfDays = Math.ceil(appointmentDuration / dayDuration);

            result = ceilQuantityOfDays * visibleDayDuration;
        } else {
            const isDifferentDates = !timeZoneUtils.isSameAppointmentDates(startDate, endDate);
            const floorQuantityOfDays = Math.floor(appointmentDuration / dayDuration);
            let tailDuration;

            if(isDifferentDates) {
                const startDateEndHour = new Date(new Date(startDate).setHours(this.option('endDayHour'), 0, 0));
                const hiddenDayDuration = dayDuration - visibleDayDuration - (startDate.getTime() > startDateEndHour.getTime() ? startDate.getTime() - startDateEndHour.getTime() : 0);

                tailDuration = appointmentDuration - (floorQuantityOfDays ? floorQuantityOfDays * dayDuration : hiddenDayDuration);

                const startDayTime = this.option('startDayHour') * toMs('hour');
                const endPartDuration = endDate - dateUtils.trimTime(endDate);

                if(endPartDuration < startDayTime) {
                    if(floorQuantityOfDays) {
                        tailDuration -= hiddenDayDuration;
                    }

                    tailDuration += startDayTime - endPartDuration;
                }
            } else {
                tailDuration = appointmentDuration % dayDuration;
            }

            if(tailDuration > visibleDayDuration) {
                tailDuration = visibleDayDuration;
            }

            result = (floorQuantityOfDays * visibleDayDuration + tailDuration) || toMs('minute');
        }
        return result;
    },

    fixWrongEndDate: function(appointment, startDate, endDate) {
        return this._appointmentModel.fixWrongEndDate(appointment, startDate, endDate);
    },

    calculateAppointmentEndDate: function(isAllDay, startDate) {
        return this._appointmentModel._calculateAppointmentEndDate(isAllDay, startDate);
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

    moveBack: function() {
        const dragBehavior = this.getWorkSpace().dragBehavior;

        dragBehavior && dragBehavior.moveBack();
    },

    validateDayHours: function() {
        const endDayHour = this._getCurrentViewOption('endDayHour');
        const startDayHour = this._getCurrentViewOption('startDayHour');

        if(startDayHour >= endDayHour) {
            throw errors.Error('E1058');
        }
    },

    removeDroppableCellClass: function() {
        this._workSpace.removeDroppableCellClass();
    }
};
export default subscribes;
