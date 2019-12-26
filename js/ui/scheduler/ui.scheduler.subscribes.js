import $ from '../../core/renderer';
import array from '../../core/utils/array';
import recurrenceUtils from './utils.recurrence';
import typeUtils from '../../core/utils/type';
import dateUtils from '../../core/utils/date';
import { each } from '../../core/utils/iterator';
import translator from '../../animation/translator';
import { grep } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import dateLocalization from '../../localization/date';
import SchedulerTimezones from './timezones/ui.scheduler.timezones';
import { Deferred } from '../../core/utils/deferred';

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

    needCoordinates: function(options) {
        const appointmentData = options.appointmentData;
        const startDate = options.startDate;
        const endDate = this._getEndDate(appointmentData);
        const recurrenceRule = this.fire('getField', 'recurrenceRule', appointmentData);
        const recurrenceException = this._getRecurrenceException(appointmentData);
        const dateRange = this._workSpace.getDateRange();
        let allDay = this.appointmentTakesAllDay(appointmentData);
        const startViewDate = this.appointmentTakesAllDay(appointmentData) ? dateUtils.trimTime(new Date(dateRange[0])) : dateRange[0];
        const originalStartDate = options.originalStartDate || startDate;
        const renderingStrategy = this.getLayoutManager().getRenderingStrategyInstance();
        const firstDayOfWeek = this.getFirstDayOfWeek();

        const recurrenceOptions = {
            rule: recurrenceRule,
            exception: recurrenceException,
            start: originalStartDate,
            end: endDate,
            min: startViewDate,
            max: dateRange[1],
            firstDayOfWeek: firstDayOfWeek
        };

        let dates = recurrenceUtils.getDatesByRecurrence(recurrenceOptions);
        let initialDates;

        if(!dates.length) {
            dates.push(startDate);
            initialDates = dates;
        } else {
            initialDates = dates;
            dates = dates.map((date) => {
                return dateUtils.roundDateByStartDayHour(date, this._getCurrentViewOption('startDayHour'));
            });
        }

        if(renderingStrategy.needSeparateAppointment(allDay)) {
            const datesLength = dates.length;
            let longParts = [];
            let resultDates = [];

            for(let i = 0; i < datesLength; i++) {
                const endDateOfPart = renderingStrategy.endDate(appointmentData, {
                    startDate: dates[i]
                }, !!recurrenceRule);

                longParts = dateUtils.getDatesOfInterval(dates[i], endDateOfPart, {
                    milliseconds: this.getWorkSpace().getIntervalDuration(allDay)
                });
                const maxDate = new Date(dateRange[1]);
                resultDates = resultDates.concat(longParts.filter(el => new Date(el) < maxDate));
            }

            dates = resultDates;
        }

        const itemResources = this._resourcesManager.getResourcesFromItem(appointmentData);
        allDay = this.appointmentTakesAllDay(appointmentData) && this._workSpace.supportAllDayRow();

        options.callback(this._getCoordinates(initialDates, dates, itemResources, allDay));
    },

    isGroupedByDate: function() {
        return this.getWorkSpace().isGroupedByDate();
    },

    showAppointmentTooltip: function(options) {
        options.skipDateCalculation = true;
        options.$appointment = $(options.target);
        const appointmentData = options.data;
        const singleAppointmentData = this._getSingleAppointmentData(appointmentData, options);

        this.showAppointmentTooltip(appointmentData, options.target, singleAppointmentData);
    },

    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip();
    },

    showAddAppointmentPopup: function(appointmentData) {
        const processedData = {};

        each(['startDate', 'endDate', 'allDay'], (function(_, field) {
            if(appointmentData[field] !== undefined) {
                this.fire('setField', field, processedData, appointmentData[field]);
                delete appointmentData[field];
            }
        }).bind(this));

        this.showAppointmentPopup(extend(processedData, appointmentData), true);
    },

    showEditAppointmentPopup: function(options) {
        const appointmentData = options.data;

        options.$appointment = $(options.target);
        options.skipHoursProcessing = true;

        const singleAppointmentData = this._getSingleAppointmentData(appointmentData, options);
        const startDate = this.fire('getField', 'startDate', singleAppointmentData);

        this.showAppointmentPopup(appointmentData, false, singleAppointmentData, startDate);
    },

    updateAppointmentAfterResize: function(options) {
        const targetAppointment = options.target;
        const singleAppointment = this._getSingleAppointmentData(targetAppointment, options);
        const startDate = this.fire('getField', 'startDate', singleAppointment);
        const updatedData = extend(true, {}, options.data);

        this._convertDatesByTimezoneBack(true, updatedData);

        this._checkRecurringAppointment(targetAppointment, singleAppointment, startDate, (function() {
            this._updateAppointment(targetAppointment, updatedData, function() {
                this._appointments.moveAppointmentBack();
            });
        }).bind(this));
    },

    getUpdatedData: function(options) {
        return this._getUpdatedData({ data: options.data });
    },

    updateAppointmentAfterDrag: function(options) {
        const target = options.data;
        const updatedData = this._getUpdatedData(options);
        const newCellIndex = this._workSpace.getDroppableCellIndex();
        const oldCellIndex = this._workSpace.getCellIndexByCoordinates(options.coordinates);
        const becomeAllDay = this.fire('getField', 'allDay', updatedData);
        const wasAllDay = this.fire('getField', 'allDay', target);
        const dragEvent = options.event;

        const appointment = extend({}, target, updatedData);

        const movedToAllDay = this._workSpace.supportAllDayRow() && becomeAllDay;
        const cellData = this._workSpace.getCellDataByCoordinates(options.coordinates, movedToAllDay);
        const movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() && (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);

        if((newCellIndex !== oldCellIndex) || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(target, appointment, cellData.startDate, (function() {

                this._convertDatesByTimezoneBack(true, updatedData, appointment);

                this._updateAppointment(target, appointment, function() {
                    this._appointments.moveAppointmentBack(dragEvent);
                }, dragEvent);
            }).bind(this), undefined, undefined, dragEvent);
        } else {
            this._appointments.moveAppointmentBack(dragEvent);
        }
    },

    deleteAppointment: function(options) {
        options.$appointment = $(options.target);

        const appointmentData = options.data,
            singleAppointmentData = this._getSingleAppointmentData(appointmentData, options);

        this.checkAndDeleteAppointment(appointmentData, singleAppointmentData);
    },

    getResourceForPainting: function() {
        return this._resourcesManager.getResourceForPainting(this._getCurrentViewOption('groups'));
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
        options.callback(response);
    },

    getHeaderHeight: function() {
        return this._header._$element && parseInt(this._header._$element.outerHeight(), 10);
    },

    getResourcesFromItem: function(options) {
        options.callback(this._resourcesManager.getResourcesFromItem(options.itemData));
    },

    getBoundOffset: function(options) {
        options.callback({ top: -this.getWorkSpaceAllDayHeight() });
    },

    appointmentTakesAllDay: function(options) {
        options.callback(this.appointmentTakesAllDay(options.appointment));
    },

    appointmentTakesSeveralDays: function(appointment) {
        return this._appointmentModel.appointmentTakesSeveralDays(appointment);
    },
    // NOTE: T312051, remove after fix scrollable bug T324196
    appointmentFocused: function() {
        this._workSpace.restoreScrollTop();
    },

    getResizableAppointmentArea: function(options) {
        let area;
        const allDay = options.allDay;
        const groups = this._getCurrentViewOption('groups');
        const isGrouped = groups && groups.length;

        if(isGrouped) {
            if(allDay || this.getLayoutManager().getRenderingStrategyInstance()._needHorizontalGroupBounds()) {
                const horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                area = {
                    left: horizontalGroupBounds.left,
                    right: horizontalGroupBounds.right,
                    top: 0,
                    bottom: 0
                };
            }

            if(this.getLayoutManager().getRenderingStrategyInstance()._needVerticalGroupBounds(allDay) && this._workSpace._isVerticalGroupedWorkSpace()) {
                const verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                area = {
                    left: 0,
                    right: 0,
                    top: verticalGroupBounds.top,
                    bottom: verticalGroupBounds.bottom
                };
            }
        }

        options.callback(area);
    },

    needRecalculateResizableArea: function() {
        return this.getWorkSpace().needRecalculateResizableArea();
    },

    getDraggableAppointmentArea: function(options) {
        options.callback(this.getWorkSpaceScrollableContainer());
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

    getStartDate: function(appointmentData, skipNormalize) {
        return this._getStartDate(appointmentData, skipNormalize);
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

    getEndDate: function(appointmentData, skipNormalize) {
        return this._getEndDate(appointmentData, skipNormalize);
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

    formatDates: function(options) {
        const startDate = options.startDate;
        const endDate = options.endDate;
        const formatType = options.formatType;

        const formatTypes = {
            'DATETIME': function() {
                const dateTimeFormat = 'mediumdatemediumtime';
                const startDateString = dateLocalization.format(startDate, dateTimeFormat) + ' - ';

                const endDateString = (startDate.getDate() === endDate.getDate()) ?
                    dateLocalization.format(endDate, 'shorttime') :
                    dateLocalization.format(endDate, dateTimeFormat);

                return startDateString + endDateString;
            },
            'TIME': function() {
                return dateLocalization.format(startDate, 'shorttime') + ' - ' + dateLocalization.format(endDate, 'shorttime');
            },
            'DATE': function() {
                const dateTimeFormat = 'monthAndDay';
                const startDateString = dateLocalization.format(startDate, dateTimeFormat);
                const isDurationMoreThanDay = (endDate.getTime() - startDate.getTime()) > toMs('day');

                const endDateString = (isDurationMoreThanDay || endDate.getDate() !== startDate.getDate()) ?
                    ' - ' + dateLocalization.format(endDate, dateTimeFormat) :
                    '';

                return startDateString + endDateString;
            }
        };

        options.callback(formatTypes[formatType]());
    },

    getFullWeekAppointmentWidth: function(options) {
        const groupIndex = options.groupIndex;
        const groupWidth = this._workSpace.getGroupWidth(groupIndex);

        options.callback(groupWidth);
    },

    getMaxAppointmentWidth: function(options) {
        const cellCountToLastViewDate = this._workSpace.getCellCountToLastViewDate(options.date);
        options.callback(cellCountToLastViewDate * this._workSpace.getCellWidth());
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

        updatedStartDate = dateUtils.roundDateByStartDayHour(updatedStartDate, startDayHour);

        options.callback(updatedStartDate);
    },

    updateAppointmentEndDate: function(options) {
        const endDate = new Date(options.endDate);
        const endDayHour = this._getCurrentViewOption('endDayHour');
        const startDayHour = this._getCurrentViewOption('startDayHour');
        let updatedEndDate = endDate;

        if(endDate.getHours() >= endDayHour) {
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        } else if(startDayHour > 0 && (endDate.getHours() * 60 + endDate.getMinutes() < (startDayHour * 60))) {
            updatedEndDate = new Date(updatedEndDate.getTime() - toMs('day'));
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        }
        options.callback(updatedEndDate);
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
        const result = {
            appointmentData: config.itemData,
            appointmentElement: config.itemElement
        };

        if(config.itemData) {
            result.targetedAppointmentData = this.fire('getTargetedAppointmentData', config.itemData, config.itemElement);
        }

        return result;
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

            return inArray(resizableInst.option('handles'), ['right left', 'left right']) > -1 && typeUtils.isPlainObject(area);
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

    recurrenceEditorVisibilityChanged: function(visible) {
        this.recurrenceEditorVisibilityChanged(visible);
    },

    resizePopup: function() {
        this.resizePopup();
    },

    getField: function(field, obj) {
        if(!typeUtils.isDefined(this._dataAccessors.getter[field])) {
            return;
        }

        return this._dataAccessors.getter[field](obj);
    },

    setField: function(field, obj, value) {
        if(!typeUtils.isDefined(this._dataAccessors.setter[field])) {
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

    agendaIsReady: function(rows, innerRowOffset, outerRowOffset) {
        const $appts = this.getAppointmentsInstance()._itemElements();
        let total = 0;

        $appts.css('marginBottom', innerRowOffset);

        const applyOffset = function(_, count) {
            const index = count + total - 1;
            $appts.eq(index).css('marginBottom', outerRowOffset);
            total += count;
        };

        for(let i = 0; i < rows.length; i++) {
            each(rows[i], applyOffset);
        }
    },

    getTimezone: function() {
        return this._getTimezoneOffsetByOption();
    },

    getClientTimezoneOffset: function(date) {
        date = date || new Date();
        return SchedulerTimezones.getClientTimezoneOffset(date);
    },

    convertDateByTimezone: function(date, appointmentTimezone) {
        date = new Date(date);

        const tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets);
        date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets);

        return date;
    },

    convertDateByTimezoneBack: function(date, appointmentTimezone) {
        date = new Date(date);

        const tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets, true);
        date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets, true);

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
        let appointmentTimezoneOffset = scheduler._calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== 'number') {
            appointmentTimezoneOffset = clientTimezoneOffset;
        }

        return {
            client: clientTimezoneOffset,
            common: commonTimezoneOffset,
            appointment: appointmentTimezoneOffset
        };
    },

    getDaylightOffset: function(startDate, endDate) {
        return startDate.getTimezoneOffset() - endDate.getTimezoneOffset();
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

    getTargetedAppointmentData: function(appointmentData, appointmentElement, skipCheckUpdate) {
        const $appointmentElement = $(appointmentElement);
        const appointmentIndex = $appointmentElement.data(this._appointments._itemIndexKey());
        const recurringData = this._getSingleAppointmentData(appointmentData, {
            skipDateCalculation: true,
            $appointment: $appointmentElement,
            skipHoursProcessing: true
        }, skipCheckUpdate);
        const result = {};

        extend(true, result, appointmentData, recurringData);

        this._convertDatesByTimezoneBack(false, result);

        // TODO: _getSingleAppointmentData already uses a related cell data for appointment that contains info about resources
        appointmentElement && this.setTargetedAppointmentResources(result, appointmentElement, appointmentIndex);

        return result;
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
            const isDifferentDate = !dateUtils.sameDate(startDate, new Date(endDate.getTime() - 1));
            const floorQuantityOfDays = Math.floor(appointmentDuration / dayDuration);
            let tailDuration;

            if(isDifferentDate) {
                const hiddenDayDuration = dayDuration - visibleDayDuration;

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
        options.callback(result);
    },

    fixWrongEndDate: function(appointment, startDate, endDate) {
        return this._appointmentModel.fixWrongEndDate(appointment, startDate, endDate);
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
    }
};
module.exports = subscribes;
