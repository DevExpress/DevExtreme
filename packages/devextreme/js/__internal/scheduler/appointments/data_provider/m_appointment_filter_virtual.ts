import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';

import { isAppointmentTakesAllDay, isDateAndTimeView } from '../../r1/utils/index';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { getResourcesByGroupIndex } from '../../utils/resource_manager/group_utils';
import { AppointmentFilterBaseStrategy } from './m_appointment_filter';
import { isAppointmentMatchedResources } from './utils/get_appointment_filter/is_appointment_matched_resources';
import {
  filterArray,
  getRawAppointments,
  getVisibleDateTimeIntervals,
} from './utils/index';
import type { CompareOptions, FilterOptions } from './utils/type';

// TODO Vinogradov refactoring: this module should be refactored :)

const toMs = dateUtils.dateToMilliseconds;

export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
  public static readonly strategyName = 'virtual';

  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const viewOffset = this._resolveOption('viewOffset');
    const hourMs = toMs('hour');
    const isCalculateStartAndEndDayHour = isDateAndTimeView(this.viewType);

    const isAllDayWorkspace = !this.supportAllDayRow;
    const showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;

    const endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
    const shiftedEndViewDate = dateUtilsTs.addOffsets(endViewDate, [viewOffset]);
    const filterOptions: FilterOptions[] = [];

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
        ? startDayHour
          + groupStartDate.getMinutes() / 60
          + (groupEndDate.getTime() - groupStartDate.getTime()) / hourMs
        : this.viewEndDayHour;

      const resourceManager = this.options.getResourceManager();
      const resources = getResourcesByGroupIndex(
        resourceManager.groupsLeafs,
        resourceManager.resourceById,
        groupIndex,
      );
      const hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);
      const supportAllDayPanel = isAllDayWorkspace || (!!showAllDayAppointments && hasAllDayPanel);
      const compareOptions: CompareOptions = {
        startDayHour,
        endDayHour,
        min: dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
      };

      filterOptions.push({
        ...compareOptions,
        viewOffset,
        supportAllDayPanel,
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
        allDayPanelMode: this.allDayPanelMode,
        visibleDateIntervals: getVisibleDateTimeIntervals(compareOptions, true),
        visibleTimeIntervals: getVisibleDateTimeIntervals(compareOptions, false),
      });
    });
    const filteredItems = this.filterPreparedItems(filterOptions, this.groupCount, preparedItems);

    return getRawAppointments(filteredItems);
  }

  filterPreparedItems(
    filterOptions: FilterOptions[],
    groupCount: number,
    preparedItems: AppointmentDataItem[],
  ): AppointmentDataItem[] {
    const combinedFilters: any[] = [];

    let itemsToFilter = preparedItems;
    if (groupCount > 0) {
      itemsToFilter = itemsToFilter.filter(({ rawAppointment }) => filterOptions.some(
        ({ resources }) => isAppointmentMatchedResources(rawAppointment, resources),
      ));
    }

    filterOptions.forEach((option) => {
      if (combinedFilters.length) {
        combinedFilters.push('or');
      }

      const filter = this.createCombinedFilter(option);
      combinedFilters.push(filter);
    });

    return filterArray(itemsToFilter, combinedFilters);
  }

  hasAllDayAppointments(_, preparedItems: AppointmentDataItem[]): boolean {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }

  protected filterAllDayAppointments(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const combinedFilter = this.createAllDayAppointmentFilter();
    const filteredItems = filterArray(preparedItems, combinedFilter);

    return getRawAppointments(filteredItems);
  }

  protected createAllDayAppointmentFilter(): ((appointment: AppointmentDataItem) => boolean)[][] {
    return [[
      (appointment: AppointmentDataItem): boolean => isAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      ),
    ]];
  }
}
