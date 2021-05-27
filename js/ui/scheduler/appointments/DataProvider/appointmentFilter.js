import config from '../../../../core/config';
import dateUtils from '../../../../core/utils/date';
import { equalByValue } from '../../../../core/utils/common';
import dateSerialization from '../../../../core/utils/date_serialization';
import { getRecurrenceProcessor } from '../../recurrence';
import { inArray, wrapToArray } from '../../../../core/utils/array';
import { extend } from '../../../../core/utils/extend';
import { map, each } from '../../../../core/utils/iterator';
import { isFunction, isDefined, isString } from '../../../../core/utils/type';
import query from '../../../../data/query';
import { getInstanceFactory } from '../../instanceFactory';

const toMs = dateUtils.dateToMilliseconds;
const DATE_FILTER_POSITION = 0;
const USER_FILTER_POSITION = 1;

const FilterStrategies = {
    virtual: 'virtual',
    standard: 'standard'
};

class AppointmentFilterHelper {
    compareDateWithStartDayHour(startDate, endDate, startDayHour, allDay, severalDays) {
        const startTime = dateUtils.dateTimeFromDecimal(startDayHour);

        const result = (startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes) ||
                    (endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes) ||
                    (endDate.getHours() > startTime.hours) ||
                    severalDays ||
                    allDay;

        return result;
    }

    compareDateWithEndDayHour(options) {
        const {
            startDate,
            endDate,
            startDayHour,
            endDayHour,
            viewStartDayHour,
            viewEndDayHour,
            allDay,
            severalDays,
            min,
            max,
            checkIntersectViewport
        } = options;

        const hiddenInterval = (24 - viewEndDayHour + viewStartDayHour) * toMs('hour');
        const apptDuration = endDate.getTime() - startDate.getTime();
        const delta = (hiddenInterval - apptDuration) / toMs('hour');
        const apptStartHour = startDate.getHours();
        const apptStartMinutes = startDate.getMinutes();
        let result;

        const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
        const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
        const apptIntersectViewport = startDate < max && endDate > min;

        result =
            (checkIntersectViewport &&
                apptIntersectViewport) ||
            (apptStartHour < endTime.hours) ||
            (apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes) ||
            (allDay &&
                startDate <= max) ||
            (severalDays &&
                apptIntersectViewport &&
                    (apptStartHour < endTime.hours || (endDate.getHours() * 60 + endDate.getMinutes()) > startTime.hours * 60)
            );

        if(apptDuration < hiddenInterval) {
            if((apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes) && (delta <= apptStartHour - endDayHour)) {
                result = false;
            }
        }

        return result;
    }
}

class FilterMaker {
    constructor(dataAccessors) {
        this._filterRegistry = null;
        this.dataAccessors = dataAccessors;
    }

    isRegistered() {
        return !!this._filterRegistry;
    }

    clearRegistry() {
        delete this._filterRegistry;
    }

    make(type, args) {

        if(!this._filterRegistry) {
            this._filterRegistry = {};
        }

        this._make(type).apply(this, args);
    }

    _make(type) {
        switch(type) {
            case 'date': return (min, max, useAccessors) => {
                const startDate = useAccessors ? this.dataAccessors.getter.startDate : this.dataAccessors.expr.startDateExpr;
                const endDate = useAccessors ? this.dataAccessors.getter.endDate : this.dataAccessors.expr.endDateExpr;
                const recurrenceRule = this.dataAccessors.expr.recurrenceRuleExpr;

                this._filterRegistry.date = [
                    [
                        [endDate, '>', min],
                        [startDate, '<', max]
                    ],
                    'or',
                    [recurrenceRule, 'startswith', 'freq'],
                    'or',
                    [
                        [endDate, min],
                        [startDate, min]
                    ]
                ];

                if(!recurrenceRule) {
                    this._filterRegistry.date.splice(1, 2);
                }
            };
            case 'user': return (userFilter) => {
                this._filterRegistry.user = userFilter;
            };
        }
    }
    combine() {
        const filter = [];

        this._filterRegistry.date && filter.push(this._filterRegistry.date);
        this._filterRegistry.user && filter.push(this._filterRegistry.user);

        return filter;
    }

    dateFilter() {
        return this._filterRegistry.date;
    }
}

export class AppointmentFilterBaseStrategy {
    constructor(scheduler, dataSource, dataAccessors) {
        this.scheduler = scheduler;
        this.dataAccessors = dataAccessors;
        this.dataSource = dataSource;
        this.filterHelper = new AppointmentFilterHelper();

        this._init();
    }

    get strategyName() { return FilterStrategies.standard; }

    // TODO - Use DI to get appropriate services
    get workspace() { return this.scheduler.getWorkSpace(); }
    get viewDataProvider() { return this.workspace.viewDataProvider; }
    get resourceManager() { return getInstanceFactory().resourceManager; }
    get timeZoneCalculator() { return this.scheduler.timeZoneCalculator; }

    get viewStartDayHour() { return this.scheduler._getCurrentViewOption('startDayHour'); }
    get viewEndDayHour() { return this.scheduler._getCurrentViewOption('endDayHour'); }
    get firstDayOfWeek() { return this.scheduler.getFirstDayOfWeek(); }
    get appointmentDuration() { return this.scheduler.getAppointmentDurationInMinutes(); }

    get recurrenceExceptionGenerator() { return this.scheduler._getRecurrenceException.bind(this.scheduler); }

    _init() {
        this.setDataAccessors(this.dataAccessors);
        this.setDataSource(this.dataSource);
    }

    filter() {
        const dateRange = this.workspace.getDateRange();
        const resources = this.resourceManager.getResourcesData();

        let allDay;

        if(!this.scheduler.option('showAllDayPanel') && this.workspace.supportAllDayRow()) {
            allDay = false;
        }

        return this.filterLoadedAppointments({
            startDayHour: this.viewStartDayHour,
            endDayHour: this.viewEndDayHour,
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
            min: dateRange[0],
            max: dateRange[1],
            resources: resources,
            allDay: allDay,
            firstDayOfWeek: this.firstDayOfWeek,
            recurrenceException: this.recurrenceExceptionGenerator,
        }, this.timeZoneCalculator);
    }

    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        if(!this.dataSource) {
            return;
        }

        const trimmedDates = this._trimDates(min, max);

        if(!this.filterMaker.isRegistered()) {
            this._createFilter(trimmedDates.min, trimmedDates.max, remoteFiltering, dateSerializationFormat);
        } else {
            this.filterMaker.make('date', [trimmedDates.min, trimmedDates.max]);

            if(this.dataSource.filter()?.length > 1) {
                // TODO: serialize user filter value only necessary for case T838165(details in note)
                const userFilter = this._serializeRemoteFilter([this.dataSource.filter()[1]], dateSerializationFormat);
                this.filterMaker.make('user', userFilter);
            }
            if(remoteFiltering) {
                this.dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
            }
        }
    }

    hasAllDayAppointments(appointments) {
        let result = false;

        if(appointments) {
            each(appointments, (_, item) => {
                if(this.appointmentTakesAllDay(item, this.viewStartDayHour, this.viewEndDayHour)) {
                    result = true;
                    return false;
                }
            });
        }

        return result;
    }

    //
    setDataAccessors(dataAccessors) {
        this.dataAccessors = dataAccessors;

        this.filterMaker = new FilterMaker(this.dataAccessors);
    }

    setDataSource(dataSource) {
        this.dataSource = dataSource;

        this.filterMaker?.clearRegistry();
    }

    _getAppointmentDurationInHours(startDate, endDate) {
        return (endDate.getTime() - startDate.getTime()) / toMs('hour');
    }

    appointmentTakesSeveralDays(appointment) {
        const dataAccessors = this.dataAccessors;
        const startDate = new Date(dataAccessors.getter.startDate(appointment));
        const endDate = new Date(dataAccessors.getter.endDate(appointment));

        return !dateUtils.sameDate(startDate, endDate);
    }

    _appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour) {
        const appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate);
        const shortDayDurationInHours = endDayHour - startDayHour;

        return (appointmentDurationInHours >= shortDayDurationInHours && startDate.getHours() === startDayHour && endDate.getHours() === endDayHour);
    }

    _appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const dayDuration = 24;
        const appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate);

        return (appointmentDurationInHours >= dayDuration) || this._appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour);
    }

    _isEndDateWrong(startDate, endDate) {
        return !endDate || isNaN(endDate.getTime()) || startDate.getTime() > endDate.getTime();
    }

    calculateAppointmentEndDate(isAllDay, startDate) {
        if(isAllDay) {
            return dateUtils.setToDayEnd(new Date(startDate));
        }

        return new Date(startDate.getTime() + this.appointmentDuration * toMs('minute'));
    }

    replaceWrongEndDate(appointment, startDate, endDate) {
        if(this._isEndDateWrong(startDate, endDate)) {
            const isAllDay = this.dataAccessors.getter.allDay(appointment);

            const calculatedEndDate = this.calculateAppointmentEndDate(isAllDay, startDate);

            this.dataAccessors.setter.endDate(appointment, calculatedEndDate);
        }
    }

    appointmentTakesAllDay(appointment, startDayHour, endDayHour) {
        const dataAccessors = this.dataAccessors;
        const startDate = dataAccessors.getter.startDate(appointment);
        const endDate = dataAccessors.getter.endDate(appointment);
        const allDay = dataAccessors.getter.allDay(appointment);

        return allDay || this._appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour);
    }

    _createAllDayAppointmentFilter(filterOptions) {
        const {
            viewStartDayHour,
            viewEndDayHour
        } = filterOptions;
        const that = this;

        return [[
            (appointment) => that.appointmentTakesAllDay(appointment, viewStartDayHour, viewEndDayHour)
        ]];
    }

    _createCombinedFilter(filterOptions, timeZoneCalculator) {
        const dataAccessors = this.dataAccessors;
        const min = new Date(filterOptions.min);
        const max = new Date(filterOptions.max);
        const getRecurrenceException = filterOptions.recurrenceException;
        const {
            startDayHour,
            endDayHour,
            viewStartDayHour,
            viewEndDayHour,
            resources,
            firstDayOfWeek,
            checkIntersectViewport
        } = filterOptions;
        const that = this;

        return [[(appointment) => {
            let result = true;
            const startDate = new Date(dataAccessors.getter.startDate(appointment));
            const endDate = new Date(dataAccessors.getter.endDate(appointment));
            const appointmentTakesAllDay = that.appointmentTakesAllDay(appointment, viewStartDayHour, viewEndDayHour);
            const appointmentTakesSeveralDays = that.appointmentTakesSeveralDays(appointment);
            const isAllDay = dataAccessors.getter.allDay(appointment);
            const appointmentIsLong = appointmentTakesSeveralDays || appointmentTakesAllDay;
            const useRecurrence = isDefined(dataAccessors.getter.recurrenceRule);
            let recurrenceRule;

            if(useRecurrence) {
                recurrenceRule = dataAccessors.getter.recurrenceRule(appointment);
            }

            if(resources && resources.length) {
                result = that._filterAppointmentByResources(appointment, resources);
            }

            if(appointmentTakesAllDay && filterOptions.allDay === false) {
                result = false;
            }

            const startDateTimeZone = dataAccessors.getter.startDateTimeZone(appointment);
            const endDateTimeZone = dataAccessors.getter.endDateTimeZone(appointment);

            const comparableStartDate = timeZoneCalculator.createDate(startDate, {
                appointmentTimeZone: startDateTimeZone,
                path: 'toGrid'
            });
            const comparableEndDate = timeZoneCalculator.createDate(endDate, {
                appointmentTimeZone: endDateTimeZone,
                path: 'toGrid'
            });

            if(result && useRecurrence) {
                const recurrenceException = getRecurrenceException
                    ? getRecurrenceException(appointment)
                    : dataAccessors.getter.recurrenceException(appointment);

                result = that._filterAppointmentByRRule({
                    startDate: comparableStartDate,
                    endDate: comparableEndDate,
                    recurrenceRule: recurrenceRule,
                    recurrenceException: recurrenceException,
                    allDay: appointmentTakesAllDay
                }, min, max, startDayHour, endDayHour, firstDayOfWeek);
            }

            // NOTE: Long appointment part without allDay field and recurrence rule should be filtered by min
            if(result && comparableEndDate < min && appointmentIsLong && !isAllDay && (!useRecurrence || (useRecurrence && !recurrenceRule))) {
                result = false;
            }

            if(result && isDefined(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
                result = this.filterHelper.compareDateWithStartDayHour(comparableStartDate, comparableEndDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays);
            }

            if(result && isDefined(endDayHour)) {
                result = this.filterHelper.compareDateWithEndDayHour({
                    startDate: comparableStartDate,
                    endDate: comparableEndDate,
                    startDayHour,
                    endDayHour,
                    viewStartDayHour,
                    viewEndDayHour,
                    allDay: appointmentTakesAllDay,
                    severalDays: appointmentTakesSeveralDays,
                    min,
                    max,
                    checkIntersectViewport
                });
            }

            if(result && useRecurrence && !recurrenceRule) {
                if(comparableEndDate < min && !isAllDay) {
                    result = false;
                }
            }

            return result;
        }]];
    }

    customizeDateFilter(dateFilter, timeZoneCalculator) {
        const currentFilter = extend(true, [], dateFilter);

        return ((appointment) => {
            const startDate = new Date(this.dataAccessors.getter.startDate(appointment));
            const endDate = new Date(this.dataAccessors.getter.endDate(appointment));

            appointment = extend(true, {}, appointment);

            const startDateTimeZone = this.dataAccessors.getter.startDateTimeZone(appointment);
            const endDateTimeZone = this.dataAccessors.getter.endDateTimeZone(appointment);

            const comparableStartDate = timeZoneCalculator.createDate(startDate, {
                appointmentTimeZone: startDateTimeZone,
                path: 'toGrid'
            });
            const comparableEndDate = timeZoneCalculator.createDate(endDate, {
                appointmentTimeZone: endDateTimeZone,
                path: 'toGrid'
            });

            this.dataAccessors.setter.startDate(appointment, comparableStartDate);
            this.dataAccessors.setter.endDate(appointment, comparableEndDate);

            return query([appointment]).filter(currentFilter).toArray().length > 0;
        }).bind(this);
    }

    _createAppointmentFilter(filterOptions, timeZoneCalculator) {
        const combinedFilter = this._createCombinedFilter(filterOptions, timeZoneCalculator);

        if(this.filterMaker.isRegistered()) {
            this.filterMaker.make('user', undefined);

            const trimmedDates = this._trimDates(filterOptions.min, filterOptions.max);

            this.filterMaker.make('date', [trimmedDates.min, trimmedDates.max, true]);

            const dateFilter = this.customizeDateFilter(this.filterMaker.combine(), timeZoneCalculator);

            combinedFilter.push([dateFilter]);
        }

        return combinedFilter;
    }

    _excessFiltering() {
        const dateFilter = this.filterMaker.dateFilter();
        const dataSourceFilter = this.dataSource.filter();

        return dataSourceFilter && (equalByValue(dataSourceFilter, dateFilter) || (dataSourceFilter.length && equalByValue(dataSourceFilter[DATE_FILTER_POSITION], dateFilter)));
    }

    _combineRemoteFilter(dateSerializationFormat) {
        const combinedFilter = this.filterMaker.combine();
        return this._serializeRemoteFilter(combinedFilter, dateSerializationFormat);
    }

    _serializeRemoteFilter(filter, dateSerializationFormat) {
        if(!Array.isArray(filter)) {
            return filter;
        }

        filter = extend([], filter);

        const startDate = this.dataAccessors.expr.startDateExpr;
        const endDate = this.dataAccessors.expr.endDateExpr;

        if(isString(filter[0])) {
            if(config().forceIsoDateParsing && filter.length > 1) {
                if(filter[0] === startDate || filter[0] === endDate) {
                    // TODO: wrap filter value to new Date only necessary for case T838165(details in note)
                    filter[filter.length - 1] = dateSerialization.serializeDate(new Date(filter[filter.length - 1]), dateSerializationFormat);
                }
            }
        }

        for(let i = 0; i < filter.length; i++) {
            filter[i] = this._serializeRemoteFilter(filter[i], dateSerializationFormat);
        }

        return filter;
    }

    _createFilter(min, max, remoteFiltering, dateSerializationFormat) {
        this.filterMaker.make('date', [min, max]);

        const userFilterPosition = this._excessFiltering() ? this.dataSource.filter()[USER_FILTER_POSITION] : this.dataSource.filter();
        this.filterMaker.make('user', [userFilterPosition]);

        if(remoteFiltering) {
            this.dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
        }
    }

    _trimDates(min, max) {
        const minCopy = dateUtils.trimTime(new Date(min));
        const maxCopy = dateUtils.trimTime(new Date(max));

        maxCopy.setDate(maxCopy.getDate() + 1);

        return {
            min: minCopy,
            max: maxCopy
        };
    }

    _filterAppointmentByResources(appointment, resources) {
        const checkAppointmentResourceValues = (resourceName, resourceIndex) => {
            const resourceGetter = this.dataAccessors.getter.resources[resourceName];
            let resource;

            if(isFunction(resourceGetter)) {
                resource = resourceGetter(appointment);
            }

            const appointmentResourceValues = wrapToArray(resource);
            const resourceData = map(
                resources[resourceIndex].items,
                (item) => { return item.id; }
            );

            for(let j = 0; j < appointmentResourceValues.length; j++) {
                if(inArray(appointmentResourceValues[j], resourceData) > -1) {
                    return true;
                }
            }

            return false;
        };

        let result = false;

        for(let i = 0; i < resources.length; i++) {
            const resourceName = resources[i].name;

            result = checkAppointmentResourceValues(resourceName, i);

            if(!result) {
                return false;
            }
        }

        return result;
    }

    _appointmentPartInInterval(startDate, endDate, startDayHour, endDayHour) {
        const apptStartDayHour = startDate.getHours();
        const apptEndDayHour = endDate.getHours();

        return (apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour) ||
                   (apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour);
    }

    _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
        const recurrenceRule = appointment.recurrenceRule;
        const recurrenceException = appointment.recurrenceException;
        const allDay = appointment.allDay;
        let result = true;
        const appointmentStartDate = appointment.startDate;
        const appointmentEndDate = appointment.endDate;
        const recurrenceProcessor = getRecurrenceProcessor();

        if(allDay || this._appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
            const trimmedDates = this._trimDates(min, max);

            min = trimmedDates.min;
            max = new Date(trimmedDates.max.getTime() - toMs('minute'));
        }

        if(recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
            result = (appointmentEndDate > min) && (appointmentStartDate <= max);
        }

        if(result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
            result = recurrenceProcessor.hasRecurrence({
                rule: recurrenceRule,
                exception: recurrenceException,
                start: appointmentStartDate,
                end: appointmentEndDate,
                min: min,
                max: max,
                firstDayOfWeek: firstDayOfWeek
            });
        }

        return result;
    }

    getPreparedDataItems() {
        const dataItems = this.dataSource?.items();

        if(!dataItems) {
            return [];
        }

        return map(dataItems, (item) => {
            const startDate = new Date(this.dataAccessors.getter.startDate(item));
            const endDate = new Date(this.dataAccessors.getter.endDate(item));

            this.replaceWrongEndDate(item, startDate, endDate);

            return item;
        });
    }

    filterLoadedAppointments(filterOption, timeZoneCalculator) {
        const combinedFilter = this._createAppointmentFilter(filterOption, timeZoneCalculator);
        return query(this.getPreparedDataItems())
            .filter(combinedFilter)
            .toArray();
    }

    filterAllDayAppointments(filterOption) {
        const combinedFilter = this._createAllDayAppointmentFilter(filterOption);
        return query(this.getPreparedDataItems())
            .filter(combinedFilter)
            .toArray();
    }
}

export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
    get strategyName() { return FilterStrategies.virtual; }

    filter() {
        const hourMs = toMs('hour');
        const isCalculateStartAndEndDayHour = this.workspace.isDateAndTimeView;
        const checkIntersectViewport = this.workspace.isDateAndTimeView && this.workspace.viewDirection === 'horizontal';

        const isAllDayWorkspace = !this.workspace.supportAllDayRow();
        const showAllDayAppointments = this.scheduler.option('showAllDayPanel') || isAllDayWorkspace;

        const endViewDate = this.workspace.getEndViewDateByEndDayHour();
        const filterOptions = [];

        const groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
        groupsInfo.forEach((item) => {
            const groupIndex = item.groupIndex;
            const groupStartDate = item.startDate;

            const groupEndDate = new Date(Math.min(item.endDate, endViewDate));
            const startDayHour = isCalculateStartAndEndDayHour
                ? groupStartDate.getHours()
                : this.viewStartDayHour;
            const endDayHour = isCalculateStartAndEndDayHour
                ? (startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate - groupStartDate) / hourMs)
                : this.viewEndDayHour;

            const resources = this._getPrerenderFilterResources(groupIndex);

            const allDayPanel = this.viewDataProvider.getAllDayPanel(groupIndex);
            // TODO split by workspace strategies
            const supportAllDayAppointment = isAllDayWorkspace || (!!showAllDayAppointments && allDayPanel?.length > 0);

            filterOptions.push({
                isVirtualScrolling: true,
                startDayHour,
                endDayHour,
                viewStartDayHour: this.viewStartDayHour,
                viewEndDayHour: this.viewEndDayHour,
                min: groupStartDate,
                max: groupEndDate,
                allDay: supportAllDayAppointment,
                resources,
                firstDayOfWeek: this.firstDayOfWeek,
                recurrenceException: this.recurrenceExceptionGenerator,
                checkIntersectViewport
            });
        });

        return this.filterLoadedAppointments(
            filterOptions,
            this.timeZoneCalculator,
            this.workspace._getGroupCount()
        );
    }

    filterLoadedAppointments(filterOptions, timeZoneCalculator, groupCount) {
        const combinedFilters = [];

        let itemsToFilter = this.getPreparedDataItems();
        const needPreFilter = groupCount > 0;
        if(needPreFilter) {
            itemsToFilter = itemsToFilter.filter(item => {
                for(let i = 0; i < filterOptions.length; ++i) {
                    const { resources } = filterOptions[i];
                    if(this._filterAppointmentByResources(item, resources)) {
                        return true;
                    }
                }
            });
        }

        filterOptions.forEach(filterOption => {
            combinedFilters.length && combinedFilters.push('or');

            const filter = this._createAppointmentFilter(filterOption, timeZoneCalculator);

            combinedFilters.push(filter);
        });

        return query(itemsToFilter)
            .filter(combinedFilters)
            .toArray();
    }

    hasAllDayAppointments() {
        return this.filterAllDayAppointments({
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
        }).length > 0;
    }

    _getPrerenderFilterResources(groupIndex) {
        const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);

        return this.resourceManager.getResourcesDataByGroups([cellGroup]);
    }
}
