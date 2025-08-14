import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';

import { isAppointmentTakesAllDay, isDateAndTimeView } from '../../r1/utils/index';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { getResourcesByGroupIndex } from '../../utils/resource_manager/group_utils';
import { isAppointmentMatchedResources } from '../../view_model_new/filtration/is_appointment_matched_resources';
import { AppointmentFilterBaseStrategy } from './m_appointment_filter';
import {
  filterArray,
  getRawAppointments,
} from './utils/index';
import type { CombinedFilter, CompareOptions, FilterOptions } from './utils/type';

// TODO Vinogradov refactoring: this module should be refactored :)

const toMs = dateUtils.dateToMilliseconds;

export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
  public static readonly strategyName = 'virtual';

  protected getBasePanelFilterOptions(): FilterOptions[] {
    const viewOffset = this._resolveOption('viewOffset');
    const hourMs = toMs('hour');
    const isCalculateStartAndEndDayHour = isDateAndTimeView(this.viewType);
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
      const compareOptions: CompareOptions = {
        startDayHour,
        endDayHour,
        min: groupStartDate,
        max: groupEndDate,
      };

      filterOptions.push({
        ...compareOptions,
        ...this.getIntervals(compareOptions),
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
        allDayPanelFilter: false,
        allDayPanelMode: this.allDayPanelMode,
        supportAllDayRow: this.supportAllDayRow,
        viewOffset: this._resolveOption('viewOffset'),
      });
    });

    return filterOptions;
  }

  protected filterByResources(
    preparedItems: AppointmentDataItem[],
    filterOptions: FilterOptions[],
  ): AppointmentDataItem[] {
    if (!this.groupCount) {
      return preparedItems;
    }

    return preparedItems.filter(({ rawAppointment }) => filterOptions.some(
      ({ resources }) => isAppointmentMatchedResources(rawAppointment, resources),
    ));
  }

  protected getCombinedFilterOptions(basePanelFilterOptions: FilterOptions[]): (CombinedFilter | 'or')[] {
    const combinedFilters: (CombinedFilter | 'or')[] = [];

    basePanelFilterOptions.forEach((option) => {
      if (combinedFilters.length) {
        combinedFilters.push('or');
      }

      const filter = this.createCombinedFilter(option);
      combinedFilters.push(filter);
    });

    const filterOptions = this.getFilterOptions();
    if (filterOptions.allDayPanelFilter === undefined) {
      combinedFilters.push('or');
      combinedFilters.push(this.createCombinedFilter({
        ...filterOptions,
        allDayPanelFilter: true,
      }));
    }

    return combinedFilters;
  }

  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const basePanelFilterOptions = this.getBasePanelFilterOptions();
    const itemsToFilter = this.filterByResources(preparedItems, basePanelFilterOptions);
    const combinedFilters = this.getCombinedFilterOptions(basePanelFilterOptions);
    const filteredItems = filterArray(itemsToFilter, combinedFilters);

    return getRawAppointments(filteredItems);
  }

  hasAllDayAppointments(_, preparedItems: AppointmentDataItem[]): boolean {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }

  protected filterAllDayAppointments(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const combinedFilter = this.createAllDayAppointmentFilter();
    const filteredItems = filterArray(preparedItems, combinedFilter);

    return getRawAppointments(filteredItems);
  }

  protected createAllDayAppointmentFilter(): CombinedFilter {
    return [[
      (appointment: AppointmentDataItem): boolean => isAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      ),
    ]];
  }
}
