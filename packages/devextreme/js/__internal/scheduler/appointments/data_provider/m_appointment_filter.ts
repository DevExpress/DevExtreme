/* eslint-disable max-classes-per-file */
import query from '@js/common/data/query';
import { wrapToArray } from '@js/core/utils/array';
import dateUtils from '@js/core/utils/date';
import { each, map } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';
import {
  getAppointmentTakesAllDay, getDatesWithoutTime, hasResourceValue, isDateAndTimeView,
  isTimelineView,
} from '@ts/scheduler/r1/utils/index';

import { createAppointmentAdapter } from '../../m_appointment_adapter';
import { getRecurrenceProcessor } from '../../m_recurrence';
import {
  getResourcesDataByGroups,
} from '../../resources/m_utils';
import {
  _appointmentPartInInterval,
  compareDateWithEndDayHour,
  compareDateWithStartDayHour,
  getAppointmentTakesSeveralDays,
  getRecurrenceException,
} from './m_utils';

// TODO Vinogradov refactoring: this module should be refactored :)

const toMs = dateUtils.dateToMilliseconds;

const FilterStrategies = {
  virtual: 'virtual',
  standard: 'standard',
};

export class AppointmentFilterBaseStrategy {
  options: any;

  dataAccessors: any;

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
    const [min, max] = this.dateRange;
    const { viewOffset } = this.options;
    const allDay = !this.showAllDayPanel && this.supportAllDayRow
      ? false
      : undefined;

    return this.filterLoadedAppointments({
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      viewOffset,
      viewStartDayHour: this.viewStartDayHour,
      viewEndDayHour: this.viewEndDayHour,
      min,
      max,
      resources: this.loadedResources,
      allDay,
      supportMultiDayAppointments: isTimelineView(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek,
    }, preparedItems);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    const adapters = filteredItems.map((item) => createAppointmentAdapter(
      item,
      this.dataAccessors,
      this.timeZoneCalculator,
    ));

    let result = false;

    // @ts-expect-error
    each(adapters, (_, item) => {
      if (getAppointmentTakesAllDay(
        item,
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

  private _createAllDayAppointmentFilter() {
    return [[
      (appointment) => getAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      ),
    ]];
  }

  _createCombinedFilter(filterOptions) {
    const min = new Date(filterOptions.min);
    const max = new Date(filterOptions.max);
    const {
      startDayHour,
      endDayHour,
      viewOffset,
      viewStartDayHour,
      viewEndDayHour,
      resources,
      firstDayOfWeek,
      checkIntersectViewport,
      supportMultiDayAppointments,
    } = filterOptions;

    const [trimMin, trimMax] = getDatesWithoutTime(min, max);
    const useRecurrence = isDefined(this.dataAccessors.getter.recurrenceRule);

    return [[(appointment) => {
      const appointmentVisible = appointment.visible ?? true;

      if (!appointmentVisible) {
        return false;
      }

      const {
        allDay: isAllDay,
        hasRecurrenceRule,
      } = appointment;

      const startDate = dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
      const endDate = dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);

      const appointmentTakesAllDay = getAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      );

      if (!hasRecurrenceRule) {
        if (!(endDate >= trimMin && startDate < trimMax
                    || dateUtils.sameDate(endDate, trimMin)
                    && dateUtils.sameDate(startDate, trimMin))
        ) {
          return false;
        }
      }

      const appointmentTakesSeveralDays = getAppointmentTakesSeveralDays(appointment);
      const isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;

      if (resources?.length && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
        return false;
      }

      if (appointmentTakesAllDay && filterOptions.allDay === false) {
        return false;
      }

      if (hasRecurrenceRule) {
        const recurrenceException = getRecurrenceException(appointment, this.timeZoneCalculator, this.timezone);

        if (!this._filterAppointmentByRRule({
          ...appointment,
          recurrenceException,
          allDay: appointmentTakesAllDay,
        }, min, max, startDayHour, endDayHour, firstDayOfWeek)) {
          return false;
        }
      }

      if (!isAllDay && supportMultiDayAppointments && isLongAppointment) {
        if (endDate < min && (!useRecurrence || (useRecurrence && !hasRecurrenceRule))) {
          return false;
        }
      }

      if (!isAllDay && isDefined(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
        if (!compareDateWithStartDayHour(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
          return false;
        }
      }

      if (!isAllDay && isDefined(endDayHour)) {
        if (!compareDateWithEndDayHour({
          startDate,
          endDate,
          startDayHour,
          endDayHour,
          viewOffset,
          viewStartDayHour,
          viewEndDayHour,
          allDay: appointmentTakesAllDay,
          severalDays: appointmentTakesSeveralDays,
          min,
          max,
          checkIntersectViewport,
        })) {
          return false;
        }
      }

      if (!isAllDay && (!isLongAppointment || supportMultiDayAppointments)) {
        if (endDate < min && useRecurrence && !hasRecurrenceRule) {
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

      if (isFunction(resourceGetter)) {
        resource = resourceGetter(appointment);
      }

      const appointmentResourceValues = wrapToArray(resource);
      const resourceData: any[] = map(
        resources[resourceIndex].items,
        ({ id }) => id,
      );

      for (let i = 0; i < appointmentResourceValues.length; i++) {
        if (hasResourceValue(resourceData, appointmentResourceValues[i])) {
          return true;
        }
      }

      return false;
    };

    let result = false;

    for (let i = 0; i < resources.length; i++) {
      const resourceName = resources[i].name;

      result = checkAppointmentResourceValues(resourceName, i);

      if (!result) {
        return false;
      }
    }

    return result;
  }

  _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
    const { recurrenceRule } = appointment;
    const { recurrenceException } = appointment;
    const { allDay } = appointment;
    let result = true;
    const appointmentStartDate = appointment.startDate;
    const appointmentEndDate = appointment.endDate;
    const recurrenceProcessor = getRecurrenceProcessor();

    if (allDay || _appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
      const [trimMin, trimMax] = getDatesWithoutTime(min, max);

      min = trimMin;
      max = new Date(trimMax.getTime() - toMs('minute'));
    }

    if (recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      result = (appointmentEndDate > min) && (appointmentStartDate <= max);
    }

    if (result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      const { viewOffset } = this.options;
      result = recurrenceProcessor.hasRecurrence({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: appointmentStartDate,
        end: appointmentEndDate,
        min: dateUtilsTs.addOffsets(min, [viewOffset]),
        max: dateUtilsTs.addOffsets(max, [viewOffset]),
        firstDayOfWeek,
        appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(
          appointmentStartDate,
          appointment.startDateTimeZone,
          false,
        ),
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

    // @ts-expect-error
    return query(preparedItems)
      // @ts-expect-error
      .filter(combinedFilter)
      .toArray();
  }

  filterAllDayAppointments(preparedItems) {
    const combinedFilter = this._createAllDayAppointmentFilter();
    // @ts-expect-error
    return query(preparedItems)
      // @ts-expect-error
      .filter(combinedFilter)
      .toArray()
      .map(({ rawAppointment }) => rawAppointment);
  }
}

export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
  get strategyName() { return FilterStrategies.virtual; }

  get resources() { return this.options.resources; }

  filter(preparedItems) {
    const { viewOffset } = this.options;
    const hourMs = toMs('hour');
    const isCalculateStartAndEndDayHour = isDateAndTimeView(this.viewType);
    const checkIntersectViewport = isCalculateStartAndEndDayHour && this.viewDirection === 'horizontal';

    const isAllDayWorkspace = !this.supportAllDayRow;
    const showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;

    const endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
    const shiftedEndViewDate = dateUtilsTs.addOffsets(endViewDate, [viewOffset]);
    const filterOptions: any = [];

    const groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
    groupsInfo.forEach((item) => {
      const { groupIndex } = item;
      const groupStartDate: Date = item.startDate;
      const groupEndDate: Date = new Date(
        Math.min(
          item.endDate.getTime(),
          shiftedEndViewDate.getTime(),
        ),
      );

      const startDayHour = isCalculateStartAndEndDayHour
        ? groupStartDate.getHours()
        : this.viewStartDayHour;
      const endDayHour = isCalculateStartAndEndDayHour
        ? startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate.getTime() - groupStartDate.getTime()) / hourMs
        : this.viewEndDayHour;

      const resources = this._getPrerenderFilterResources(groupIndex);

      const hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);

      const supportAllDayAppointment = isAllDayWorkspace || (!!showAllDayAppointments && hasAllDayPanel);

      filterOptions.push({
        isVirtualScrolling: true,
        startDayHour,
        endDayHour,
        viewOffset,
        viewStartDayHour: this.viewStartDayHour,
        viewEndDayHour: this.viewEndDayHour,
        min: dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
        supportMultiDayAppointments: isTimelineView(this.viewType),
        allDay: supportAllDayAppointment,
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
        checkIntersectViewport,
      });
    });

    return this.filterLoadedAppointments({
      filterOptions,
      groupCount: this.groupCount,
    }, preparedItems);
  }

  filterPreparedItems({ filterOptions, groupCount }, preparedItems) {
    const combinedFilters: any = [];

    let itemsToFilter = preparedItems;
    const needPreFilter = groupCount > 0;
    if (needPreFilter) {
      // @ts-expect-error
      itemsToFilter = itemsToFilter.filter(({ rawAppointment }) => {
        for (let i = 0; i < filterOptions.length; ++i) {
          const { resources } = filterOptions[i];
          if (this._filterAppointmentByResources(rawAppointment, resources)) {
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

    // @ts-expect-error
    return query(itemsToFilter)
      // @ts-expect-error
      .filter(combinedFilters)
      .toArray();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }

  _getPrerenderFilterResources(groupIndex) {
    const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);

    return getResourcesDataByGroups(
      this.loadedResources,
      this.resources,
      [cellGroup],
    );
  }
}
