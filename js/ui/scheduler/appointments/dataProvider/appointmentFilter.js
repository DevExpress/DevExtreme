import config from '../../../../core/config';
import dateUtils from '../../../../core/utils/date';
import { equalByValue } from '../../../../core/utils/common';
import dateSerialization from '../../../../core/utils/date_serialization';
import { getRecurrenceProcessor } from '../../recurrence';
import { wrapToArray } from '../../../../core/utils/array';
import { extend } from '../../../../core/utils/extend';
import { map, each } from '../../../../core/utils/iterator';
import { isFunction, isDefined, isString } from '../../../../core/utils/type';
import query from '../../../../data/query';
import { createAppointmentAdapter } from '../../appointmentAdapter';
import { hasResourceValue } from '../../../../renovation/ui/scheduler/resources/hasResourceValue';

import {
    isDateAndTimeView as calculateIsDateAndTimeView,
    isSupportMultiDayAppointments
} from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import {
    getResourcesDataByGroups,
} from '../../resources/utils';
import {
    compareDateWithStartDayHour,
    compareDateWithEndDayHour,
    getTrimDates,
    getAppointmentTakesSeveralDays,
    _appointmentPartInInterval,
    getRecurrenceException,
    getAppointmentTakesAllDay
} from './utils';

const toMs = dateUtils.dateToMilliseconds;
const DATE_FILTER_POSITION = 0;
const USER_FILTER_POSITION = 1;

const FilterStrategies = {
    virtual: 'virtual',
    standard: 'standard'
};

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
                        [endDate, '>=', min],
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
        return this._filterRegistry?.date;
    }
}

export class AppointmentFilterBaseStrategy {
    constructor(options) {
        this.options = options;
        this.dataSource = this.options.dataSource;
        this.dataAccessors = this.options.dataAccessors;

        this._init();
    }

    get strategyName() { return FilterStrategies.standard; }

    get timeZoneCalculator() { return this.options.timeZoneCalculator; }

    get viewStartDayHour() { return this.options.startDayHour; }
    get viewEndDayHour() { return this.options.endDayHour; }
    get timezone() { return this.options.timezone; }
    get firstDayOfWeek() { return this.options.firstDayOfWeek; }
    get showAllDayPanel() { return this.options.showAllDayPanel; }

    get loadedResources() { return this._resolveOption('loadedResources'); }
    get supportAllDayRow() { return this._resolveOption('supportAllDayRow'); }
    get viewType() { return this._resolveOption('viewType'); }
    get viewDirection() { return this._resolveOption('viewDirection'); }
    get dateRange() { return this._resolveOption('dateRange'); }
    get groupCount() { return this._resolveOption('groupCount'); }
    get viewDataProvider() { return this._resolveOption('viewDataProvider'); }

    _resolveOption(name) {
        const result = this.options[name];
        return typeof result === 'function'
            ? result()
            : result;
    }

    _init() {
        this.setDataAccessors(this.dataAccessors);
        this.setDataSource(this.dataSource);
    }

    filter(preparedItems) {
        const dateRange = this.dateRange;

        let allDay;

        if(!this.showAllDayPanel && this.supportAllDayRow) {
            allDay = false;
        }

        return this.filterLoadedAppointments({
            startDayHour: this.viewStartDayHour,
            endDayHour: this.viewEndDayHour,
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
            min: dateRange[0],
            max: dateRange[1],
            resources: this.loadedResources,
            allDay,
            supportMultiDayAppointments: isSupportMultiDayAppointments(this.viewType),
            firstDayOfWeek: this.firstDayOfWeek,
        }, preparedItems);
    }

    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        if(!this.dataSource) {
            return;
        }

        const [trimMin, trimMax] = getTrimDates(min, max);

        if(!this.filterMaker.isRegistered()) {
            this._createFilter(trimMin, trimMax, remoteFiltering, dateSerializationFormat);
        } else {
            if(this.dataSource.filter()?.length > 1) {
                // TODO: serialize user filter value only necessary for case T838165(details in note)
                const userFilter = this._serializeRemoteFilter([this.dataSource.filter()[1]], dateSerializationFormat);
                this.filterMaker.make('user', userFilter);
            }
            if(remoteFiltering) {
                this.filterMaker.make('date', [trimMin, trimMax]);
                this.dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
            }
        }
    }

    hasAllDayAppointments(filteredItems, preparedItems) {
        const adapters = filteredItems.map((item) => createAppointmentAdapter(
            item,
            this.dataAccessors,
            this.timeZoneCalculator
        ));

        let result = false;

        each(adapters, (_, item) => {
            if(getAppointmentTakesAllDay(item, this.viewStartDayHour, this.viewEndDayHour)) {
                result = true;
                return false;
            }
        });

        return result;
    }

    setDataAccessors(dataAccessors) {
        this.dataAccessors = dataAccessors;

        this.filterMaker = new FilterMaker(this.dataAccessors);
    }

    setDataSource(dataSource) {
        this.dataSource = dataSource;

        this.filterMaker?.clearRegistry();
    }

    _createAllDayAppointmentFilter(filterOptions) {
        const {
            viewStartDayHour,
            viewEndDayHour
        } = filterOptions;

        return [[
            (appointment) => getAppointmentTakesAllDay(appointment, viewStartDayHour, viewEndDayHour)
        ]];
    }

    _createCombinedFilter(filterOptions) {
        const min = new Date(filterOptions.min);
        const max = new Date(filterOptions.max);

        const {
            startDayHour,
            endDayHour,
            viewStartDayHour,
            viewEndDayHour,
            resources,
            firstDayOfWeek,
            checkIntersectViewport,
            supportMultiDayAppointments
        } = filterOptions;

        const [trimMin, trimMax] = getTrimDates(min, max);
        const useRecurrence = isDefined(this.dataAccessors.getter.recurrenceRule);

        return [[appointment => {
            const appointmentVisible = appointment.visible ?? true;

            if(!appointmentVisible) {
                return false;
            }

            const {
                startDate,
                endDate,
                hasRecurrenceRule
            } = appointment;

            if(!hasRecurrenceRule) {
                if(!(endDate >= trimMin && startDate < trimMax ||
                    dateUtils.sameDate(endDate, trimMin) &&
                    dateUtils.sameDate(startDate, trimMin))
                ) {
                    return false;
                }
            }

            let recurrenceRule;
            if(useRecurrence) {
                recurrenceRule = appointment.recurrenceRule;
            }

            const appointmentTakesAllDay = getAppointmentTakesAllDay(appointment, viewStartDayHour, viewEndDayHour);
            const appointmentTakesSeveralDays = getAppointmentTakesSeveralDays(appointment);
            const isAllDay = appointment.allDay;
            const isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;

            if(resources?.length && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
                return false;
            }

            if(appointmentTakesAllDay && filterOptions.allDay === false) {
                return false;
            }

            if(hasRecurrenceRule) {
                const recurrenceException = getRecurrenceException(appointment, this.timeZoneCalculator, this.timezone);

                if(!this._filterAppointmentByRRule({
                    startDate,
                    endDate,
                    recurrenceRule,
                    recurrenceException,
                    allDay: appointmentTakesAllDay
                }, min, max, startDayHour, endDayHour, firstDayOfWeek)) {
                    return false;
                }
            }

            if(!isAllDay && supportMultiDayAppointments && isLongAppointment) {
                if(endDate < min && (!useRecurrence || (useRecurrence && !hasRecurrenceRule))) {
                    return false;
                }
            }

            if(isDefined(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
                if(!compareDateWithStartDayHour(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
                    return false;
                }
            }

            if(isDefined(endDayHour)) {
                if(!compareDateWithEndDayHour({
                    startDate: startDate,
                    endDate: endDate,
                    startDayHour,
                    endDayHour,
                    viewStartDayHour,
                    viewEndDayHour,
                    allDay: appointmentTakesAllDay,
                    severalDays: appointmentTakesSeveralDays,
                    min,
                    max,
                    checkIntersectViewport
                })) {
                    return false;
                }
            }

            if(!isAllDay && (!isLongAppointment || supportMultiDayAppointments)) {
                if(endDate < min && useRecurrence && !hasRecurrenceRule) {
                    return false;
                }
            }

            return true;
        }]];
    }

    _createAppointmentFilter(filterOptions) {
        if(this.filterMaker.isRegistered()) {
            this.filterMaker.make('user', undefined);
        }

        return this._createCombinedFilter(filterOptions);
    }

    _excessFiltering() {
        const dateFilter = this.filterMaker.dateFilter();
        const dataSourceFilter = this.dataSource.filter();

        return dateFilter && dataSourceFilter && (
            equalByValue(dataSourceFilter, dateFilter) ||
            (dataSourceFilter.length && equalByValue(dataSourceFilter[DATE_FILTER_POSITION], dateFilter))
        );
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
        if(remoteFiltering) {
            this.filterMaker.make('date', [min, max]);

            const userFilterPosition = this._excessFiltering()
                ? this.dataSource.filter()[USER_FILTER_POSITION]
                : this.dataSource.filter();

            this.filterMaker.make('user', [userFilterPosition]);

            this.dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
        }
    }

    _filterAppointmentByResources(appointment, resources) {
        const checkAppointmentResourceValues = (resourceName, resourceIndex) => {
            const resourceGetter = this.dataAccessors.resources.getter[resourceName];
            let resource;

            if(isFunction(resourceGetter)) {
                resource = resourceGetter(appointment);
            }

            const appointmentResourceValues = wrapToArray(resource);
            const resourceData = map(
                resources[resourceIndex].items,
                ({ id }) => id,
            );

            for(let i = 0; i < appointmentResourceValues.length; i++) {
                if(hasResourceValue(resourceData, appointmentResourceValues[i])) {
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

    _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
        const recurrenceRule = appointment.recurrenceRule;
        const recurrenceException = appointment.recurrenceException;
        const allDay = appointment.allDay;
        let result = true;
        const appointmentStartDate = appointment.startDate;
        const appointmentEndDate = appointment.endDate;
        const recurrenceProcessor = getRecurrenceProcessor();

        if(allDay || _appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
            const [trimMin, trimMax] = getTrimDates(min, max);

            min = trimMin;
            max = new Date(trimMax.getTime() - toMs('minute'));
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

    filterLoadedAppointments(filterOptions, preparedItems) {
        const filteredItems = this.filterPreparedItems(filterOptions, preparedItems);
        return filteredItems.map(({ rawAppointment }) => rawAppointment);
    }

    filterPreparedItems(filterOptions, preparedItems) {
        const combinedFilter = this._createAppointmentFilter(filterOptions);

        return query(preparedItems)
            .filter(combinedFilter)
            .toArray();
    }

    filterAllDayAppointments(filterOptions, preparedItems) {
        const combinedFilter = this._createAllDayAppointmentFilter(filterOptions);
        return query(preparedItems)
            .filter(combinedFilter)
            .toArray()
            .map(({ rawAppointment }) => rawAppointment);
    }
}

export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
    get strategyName() { return FilterStrategies.virtual; }
    get resources() { return this.options.resources; }

    filter(preparedItems) {
        const hourMs = toMs('hour');
        const isCalculateStartAndEndDayHour = calculateIsDateAndTimeView(this.viewType);
        const checkIntersectViewport = isCalculateStartAndEndDayHour && this.viewDirection === 'horizontal';

        const isAllDayWorkspace = !this.supportAllDayRow;
        const showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;

        const endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
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

            const supportAllDayAppointment = isAllDayWorkspace || (!!showAllDayAppointments && allDayPanel?.length > 0);

            filterOptions.push({
                isVirtualScrolling: true,
                startDayHour,
                endDayHour,
                viewStartDayHour: this.viewStartDayHour,
                viewEndDayHour: this.viewEndDayHour,
                min: groupStartDate,
                max: groupEndDate,
                supportMultiDayAppointments: isSupportMultiDayAppointments(this.viewType),
                allDay: supportAllDayAppointment,
                resources,
                firstDayOfWeek: this.firstDayOfWeek,
                checkIntersectViewport
            });
        });

        return this.filterLoadedAppointments({
            filterOptions,
            groupCount: this.groupCount
        }, preparedItems);
    }

    filterPreparedItems({ filterOptions, groupCount }, preparedItems) {
        const combinedFilters = [];

        let itemsToFilter = preparedItems;
        const needPreFilter = groupCount > 0;
        if(needPreFilter) {
            itemsToFilter = itemsToFilter.filter(({ rawAppointment }) => {
                for(let i = 0; i < filterOptions.length; ++i) {
                    const { resources } = filterOptions[i];
                    if(this._filterAppointmentByResources(rawAppointment, resources)) {
                        return true;
                    }
                }
            });
        }

        filterOptions.forEach((option) => {
            combinedFilters.length && combinedFilters.push('or');

            const filter = this._createAppointmentFilter(option);

            combinedFilters.push(filter);
        });

        return query(itemsToFilter)
            .filter(combinedFilters)
            .toArray();
    }

    hasAllDayAppointments(adapters, preparedItems) {
        return this.filterAllDayAppointments({
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
        }, preparedItems).length > 0;
    }

    _getPrerenderFilterResources(groupIndex) {
        const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);

        return getResourcesDataByGroups(
            this.loadedResources,
            this.resources,
            [cellGroup]
        );
    }
}
