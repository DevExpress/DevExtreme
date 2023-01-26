import dateUtils from '../../../../core/utils/date';
import { getRecurrenceProcessor } from '../../recurrence';
import { wrapToArray } from '../../../../core/utils/array';
import { map, each } from '../../../../core/utils/iterator';
import { isFunction, isDefined } from '../../../../core/utils/type';
import query from '../../../../data/query';
import { createAppointmentAdapter } from '../../appointmentAdapter';
import { hasResourceValue } from '../../../../renovation/ui/scheduler/resources/hasResourceValue';

import {
    isDateAndTimeView as calculateIsDateAndTimeView,
    isTimelineView
} from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import {
    getResourcesDataByGroups,
} from '../../resources/utils';
import {
    compareDateWithStartDayHour,
    compareDateWithEndDayHour,
    getAppointmentTakesSeveralDays,
    _appointmentPartInInterval,
    getRecurrenceException,
} from './utils';
import getDatesWithoutTime from '../../../../renovation/ui/scheduler/utils/filtering/getDatesWithoutTime';
import { getAppointmentTakesAllDay } from '../../../../renovation/ui/scheduler/appointment/utils/getAppointmentTakesAllDay';

const toMs = dateUtils.dateToMilliseconds;

const FilterStrategies = {
    virtual: 'virtual',
    standard: 'standard'
};

export class AppointmentFilterBaseStrategy {
    constructor(options) {
        this.options = options;
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
    get allDayPanelMode() { return this._resolveOption('allDayPanelMode'); }

    _resolveOption(name) {
        const result = this.options[name];
        return typeof result === 'function'
            ? result()
            : result;
    }

    _init() {
        this.setDataAccessors(this.dataAccessors);
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
            supportMultiDayAppointments: isTimelineView(this.viewType),
            firstDayOfWeek: this.firstDayOfWeek,
        }, preparedItems);
    }

    hasAllDayAppointments(filteredItems, preparedItems) {
        const adapters = filteredItems.map((item) => createAppointmentAdapter(
            item,
            this.dataAccessors,
            this.timeZoneCalculator
        ));

        let result = false;

        each(adapters, (_, item) => {
            if(getAppointmentTakesAllDay(
                item,
                this.viewStartDayHour,
                this.viewEndDayHour,
                this.allDayPanelMode,
            )) {
                result = true;
                return false;
            }
        });

        return result;
    }

    setDataAccessors(dataAccessors) {
        this.dataAccessors = dataAccessors;
    }

    _createAllDayAppointmentFilter(filterOptions) {
        const {
            viewStartDayHour,
            viewEndDayHour
        } = filterOptions;

        return [[
            (appointment) => getAppointmentTakesAllDay(
                appointment,
                viewStartDayHour,
                viewEndDayHour,
                this.allDayPanelMode,
            )
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

        const [trimMin, trimMax] = getDatesWithoutTime(min, max);
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

            const appointmentTakesAllDay = getAppointmentTakesAllDay(
                appointment,
                viewStartDayHour,
                viewEndDayHour,
                this.allDayPanelMode,
            );
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
                    ...appointment,
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

    // TODO get rid of wrapper
    _createAppointmentFilter(filterOptions) {
        return this._createCombinedFilter(filterOptions);
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
            const [trimMin, trimMax] = getDatesWithoutTime(min, max);

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
                firstDayOfWeek: firstDayOfWeek,
                appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(
                    appointmentStartDate,
                    appointment.startDateTimeZone,
                    false,
                )
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

            const hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);

            const supportAllDayAppointment = isAllDayWorkspace || (!!showAllDayAppointments && hasAllDayPanel);

            filterOptions.push({
                isVirtualScrolling: true,
                startDayHour,
                endDayHour,
                viewStartDayHour: this.viewStartDayHour,
                viewEndDayHour: this.viewEndDayHour,
                min: groupStartDate,
                max: groupEndDate,
                supportMultiDayAppointments: isTimelineView(this.viewType),
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
