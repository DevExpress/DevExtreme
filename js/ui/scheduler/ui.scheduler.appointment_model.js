import config from '../../core/config';
import { map, each } from '../../core/utils/iterator';
import dateSerialization from '../../core/utils/date_serialization';
import { getRecurrenceProcessor } from './recurrence';
import dateUtils from '../../core/utils/date';
import { equalByValue } from '../../core/utils/common';
import { isFunction, isDefined, isString } from '../../core/utils/type';
import { inArray, wrapToArray } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import query from '../../data/query';
import { Deferred } from '../../core/utils/deferred';

const toMs = dateUtils.dateToMilliseconds;

const DATE_FILTER_POSITION = 0;
const USER_FILTER_POSITION = 1;

class FilterMaker {
    constructor(dataAccessors) {
        this._filterRegistry = null;
        this._dataAccessors = dataAccessors;
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
                const startDate = useAccessors ? this._dataAccessors.getter.startDate : this._dataAccessors.expr.startDateExpr;
                const endDate = useAccessors ? this._dataAccessors.getter.endDate : this._dataAccessors.expr.endDateExpr;
                const recurrenceRule = this._dataAccessors.expr.recurrenceRuleExpr;

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

const compareDateWithStartDayHour = (startDate, endDate, startDayHour, allDay, severalDays) => {
    const startTime = dateUtils.dateTimeFromDecimal(startDayHour);

    const result = (startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes) ||
                (endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes) ||
                (endDate.getHours() > startTime.hours) ||
                severalDays ||
                allDay;

    return result;
};

const compareDateWithEndDayHour = (startDate, endDate, startDayHour, endDayHour, allDay, severalDays, max, min) => {
    const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
    const apptDuration = endDate.getTime() - startDate.getTime();
    const delta = (hiddenInterval - apptDuration) / toMs('hour');
    const apptStartHour = startDate.getHours();
    const apptStartMinutes = startDate.getMinutes();
    let result;

    const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
    const startTime = dateUtils.dateTimeFromDecimal(startDayHour);

    result = (apptStartHour < endTime.hours) ||
        (apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes) ||
        (allDay && startDate <= max) ||
        (severalDays && (startDate < max && endDate > min) && (apptStartHour < endTime.hours || (endDate.getHours() * 60 + endDate.getMinutes()) > startTime.hours * 60));

    if(apptDuration < hiddenInterval) {
        if((apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes) && (delta <= apptStartHour - endDayHour)) {
            result = false;
        }
    }

    return result;
};

class AppointmentModel {
    constructor(dataSource, dataAccessors, baseAppointmentDuration) {
        this.setDataAccessors(dataAccessors);
        this.setDataSource(dataSource);
        this._updatedAppointmentKeys = [];

        this._filterMaker = new FilterMaker(dataAccessors);

        this._baseAppointmentDuration = baseAppointmentDuration;
    }

    get keyName() {
        const store = this._dataSource.store();
        return store.key();
    }

    _createFilter(min, max, remoteFiltering, dateSerializationFormat) {
        this._filterMaker.make('date', [min, max]);

        const userFilterPosition = this._excessFiltering() ? this._dataSource.filter()[USER_FILTER_POSITION] : this._dataSource.filter();
        this._filterMaker.make('user', [userFilterPosition]);

        if(remoteFiltering) {
            this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
        }
    }

    _excessFiltering() {
        const dateFilter = this._filterMaker.dateFilter();
        const dataSourceFilter = this._dataSource.filter();

        return dataSourceFilter && (equalByValue(dataSourceFilter, dateFilter) || (dataSourceFilter.length && equalByValue(dataSourceFilter[DATE_FILTER_POSITION], dateFilter)));
    }

    _combineFilter() {
        return this._filterMaker.combine();
    }

    _getStoreKey(target) {
        const store = this._dataSource.store();

        return store.keyOf(target);
    }

    _filterAppointmentByResources(appointment, resources) {
        let result = false;
        let i;
        let len;
        let resourceName;

        const checkAppointmentResourceValues = () => {
            const resourceGetter = this._dataAccessors.getter.resources[resourceName];
            let resource;

            if(isFunction(resourceGetter)) {
                resource = resourceGetter(appointment);
            }

            const appointmentResourceValues = wrapToArray(resource);
            const resourceData = map(resources[i].items, (item) => { return item.id; });

            for(let j = 0, itemDataCount = appointmentResourceValues.length; j < itemDataCount; j++) {
                if(inArray(appointmentResourceValues[j], resourceData) > -1) {
                    return true;
                }
            }

            return false;
        };

        for(i = 0, len = resources.length; i < len; i++) {
            resourceName = resources[i].name;

            result = checkAppointmentResourceValues.call(this);

            if(!result) {
                return false;
            }
        }

        return result;
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

    _appointmentPartInInterval(startDate, endDate, startDayHour, endDayHour) {
        const apptStartDayHour = startDate.getHours();
        const apptEndDayHour = endDate.getHours();

        return (apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour) ||
                   (apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour);
    }

    _createCombinedFilter(filterOptions, timeZoneCalculator) {
        const dataAccessors = this._dataAccessors;
        const startDayHour = filterOptions.startDayHour;
        const endDayHour = filterOptions.endDayHour;
        const min = new Date(filterOptions.min);
        const max = new Date(filterOptions.max);
        const resources = filterOptions.resources;
        const firstDayOfWeek = filterOptions.firstDayOfWeek;
        const getRecurrenceException = filterOptions.recurrenceException;
        const that = this;

        return [[(appointment) => {
            let result = true;
            const startDate = new Date(dataAccessors.getter.startDate(appointment));
            const endDate = new Date(dataAccessors.getter.endDate(appointment));
            const appointmentTakesAllDay = that.appointmentTakesAllDay(appointment, startDayHour, endDayHour);
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
                const recurrenceException = getRecurrenceException ? getRecurrenceException(appointment) : dataAccessors.getter.recurrenceException(appointment);
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

            if(result && startDayHour !== undefined && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
                result = compareDateWithStartDayHour(comparableStartDate, comparableEndDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays);
            }

            if(result && endDayHour !== undefined) {
                result = compareDateWithEndDayHour(comparableStartDate, comparableEndDate, startDayHour, endDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays, max, min);
            }

            if(result && useRecurrence && !recurrenceRule) {
                if(comparableEndDate < min && !isAllDay) {
                    result = false;
                }
            }

            return result;
        }]];
    }

    setDataSource(dataSource) {
        this._dataSource = dataSource;

        this.cleanModelState();
        this._initStoreChangeHandlers();
        this._filterMaker && this._filterMaker.clearRegistry();
    }

    _initStoreChangeHandlers() {
        const dataSource = this._dataSource;
        const store = dataSource?.store();

        if(store) {
            store.on('updating', newItem => {
                this._updatedAppointment = newItem;
            });

            store.on('push', pushItems => {
                const items = dataSource.items();
                const keyName = store.key();

                pushItems.forEach(pushItem => {
                    const itemExists = items.filter(item => item[keyName] === pushItem.key).length !== 0;

                    if(itemExists) {
                        this._updatedAppointmentKeys.push({ key: keyName, value: pushItem.key });
                    } else {
                        items.push(pushItem.data);
                    }
                });
            });
        }
    }

    getUpdatedAppointment() {
        return this._updatedAppointment;
    }
    getUpdatedAppointmentKeys() {
        return this._updatedAppointmentKeys;
    }

    cleanModelState() {
        this._updatedAppointment = null;
        this._updatedAppointmentKeys = [];
    }

    setDataAccessors(dataAccessors) {
        this._dataAccessors = dataAccessors;

        this._filterMaker = new FilterMaker(dataAccessors);
    }

    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        if(!this._dataSource) {
            return;
        }

        const trimmedDates = this._trimDates(min, max);

        if(!this._filterMaker.isRegistered()) {
            this._createFilter(trimmedDates.min, trimmedDates.max, remoteFiltering, dateSerializationFormat);
        } else {
            this._filterMaker.make('date', [trimmedDates.min, trimmedDates.max]);

            if(this._dataSource.filter()?.length > 1) {
                // TODO: serialize user filter value only necessary for case T838165(details in note)
                const userFilter = this._serializeRemoteFilter([this._dataSource.filter()[1]], dateSerializationFormat);
                this._filterMaker.make('user', userFilter);
            }
            if(remoteFiltering) {
                this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
            }
        }
    }

    _combineRemoteFilter(dateSerializationFormat) {
        const combinedFilter = this._filterMaker.combine();
        return this._serializeRemoteFilter(combinedFilter, dateSerializationFormat);
    }

    _serializeRemoteFilter(filter, dateSerializationFormat) {
        if(!Array.isArray(filter)) {
            return filter;
        }

        filter = extend([], filter);

        const startDate = this._dataAccessors.expr.startDateExpr;
        const endDate = this._dataAccessors.expr.endDateExpr;

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

    _createAppointmentFilter(filterOptions, timeZoneCalculator) {
        const combinedFilter = this._createCombinedFilter(filterOptions, timeZoneCalculator);

        if(this._filterMaker.isRegistered()) {
            this._filterMaker.make('user', undefined);

            const trimmedDates = this._trimDates(filterOptions.min, filterOptions.max);

            this._filterMaker.make('date', [trimmedDates.min, trimmedDates.max, true]);

            const dateFilter = this.customizeDateFilter(this._filterMaker.combine(), timeZoneCalculator);

            combinedFilter.push([dateFilter]);
        }

        return combinedFilter;
    }

    filterLoadedAppointments(filterOption, timeZoneCalculator) {
        const combinedFilter = this._createAppointmentFilter(filterOption, timeZoneCalculator);
        return query(this.getPreparedDataItems()).filter(combinedFilter).toArray();
    }

    getPreparedDataItems() {
        const dataItems = this._dataSource.items();
        return map(dataItems, (item) => {
            const startDate = new Date(this._dataAccessors.getter.startDate(item));
            const endDate = new Date(this._dataAccessors.getter.endDate(item));

            this.replaceWrongEndDate(item, startDate, endDate);

            return item;
        });
    }

    replaceWrongEndDate(appointment, startDate, endDate) {
        if(this._isEndDateWrong(startDate, endDate)) {
            const isAllDay = this._dataAccessors.getter.allDay(appointment);

            const calculatedEndDate = this._calculateAppointmentEndDate(isAllDay, startDate);

            this._dataAccessors.setter.endDate(appointment, calculatedEndDate);
        }
    }

    filterLoadedVirtualAppointments(filterOptions, timeZoneCalculator, groupCount) {
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

    _trimDates(min, max) {
        const minCopy = dateUtils.trimTime(new Date(min));
        const maxCopy = dateUtils.trimTime(new Date(max));

        maxCopy.setDate(maxCopy.getDate() + 1);

        return {
            min: minCopy,
            max: maxCopy
        };
    }

    hasAllDayAppointments(items, startDayHour, endDayHour) {
        if(!items) {
            return false;
        }

        const that = this;

        let result = false;
        each(items, (index, item) => {
            if(that.appointmentTakesAllDay(item, startDayHour, endDayHour)) {
                result = true;
                return false;
            }
        });

        return result;
    }

    appointmentTakesAllDay(appointment, startDayHour, endDayHour) {
        const dataAccessors = this._dataAccessors;
        const startDate = dataAccessors.getter.startDate(appointment);
        const endDate = dataAccessors.getter.endDate(appointment);
        const allDay = dataAccessors.getter.allDay(appointment);

        return allDay || this._appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour);
    }

    _appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const dayDuration = 24;
        const appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate);

        return (appointmentDurationInHours >= dayDuration) || this._appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour);
    }

    _appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour) {
        const appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate);
        const shortDayDurationInHours = endDayHour - startDayHour;

        return (appointmentDurationInHours >= shortDayDurationInHours && startDate.getHours() === startDayHour && endDate.getHours() === endDayHour);
    }

    _getAppointmentDurationInHours(startDate, endDate) {
        return (endDate.getTime() - startDate.getTime()) / toMs('hour');
    }

    appointmentTakesSeveralDays(appointment) {
        const dataAccessors = this._dataAccessors;
        const startDate = new Date(dataAccessors.getter.startDate(appointment));
        const endDate = new Date(dataAccessors.getter.endDate(appointment));

        return !dateUtils.sameDate(startDate, endDate);
    }

    customizeDateFilter(dateFilter, timeZoneCalculator) {
        const currentFilter = extend(true, [], dateFilter);

        return ((appointment) => {
            const startDate = new Date(this._dataAccessors.getter.startDate(appointment));
            const endDate = new Date(this._dataAccessors.getter.endDate(appointment));

            appointment = extend(true, {}, appointment);

            const startDateTimeZone = this._dataAccessors.getter.startDateTimeZone(appointment);
            const endDateTimeZone = this._dataAccessors.getter.endDateTimeZone(appointment);

            const comparableStartDate = timeZoneCalculator.createDate(startDate, {
                appointmentTimeZone: startDateTimeZone,
                path: 'toGrid'
            });
            const comparableEndDate = timeZoneCalculator.createDate(endDate, {
                appointmentTimeZone: endDateTimeZone,
                path: 'toGrid'
            });

            this._dataAccessors.setter.startDate(appointment, comparableStartDate);
            this._dataAccessors.setter.endDate(appointment, comparableEndDate);

            return query([appointment]).filter(currentFilter).toArray().length > 0;
        }).bind(this);
    }

    _calculateAppointmentEndDate(isAllDay, startDate) {
        if(isAllDay) {
            return dateUtils.setToDayEnd(new Date(startDate));
        }

        return new Date(startDate.getTime() + this._baseAppointmentDuration * toMs('minute'));
    }

    _isEndDateWrong(startDate, endDate) {
        return !endDate || isNaN(endDate.getTime()) || startDate.getTime() > endDate.getTime();
    }

    add(data) {
        return this._dataSource.store().insert(data).done((() => {
            this._dataSource.load();
        }).bind(this));
    }

    update(target, data) {
        const key = this._getStoreKey(target);
        const d = new Deferred();

        this._dataSource.store().update(key, data)
            .done(() => {
                this._dataSource.load()
                    .done(d.resolve)
                    .fail(d.reject);
            })
            .fail(d.reject);

        return d.promise();
    }

    remove(target) {
        const key = this._getStoreKey(target);

        return this._dataSource.store().remove(key).done((() => {
            this._dataSource.load();
        }).bind(this));
    }
}

export default AppointmentModel;
