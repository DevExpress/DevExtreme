import query from '@js/common/data/query';
import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';

import { isDateAndTimeView } from '../../r1/utils/index';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { getResourcesByGroupIndex } from '../../utils/resource_manager/group_utils';
import { AppointmentFilterBaseStrategy } from './m_appointment_filter';
import { isAppointmentMatchedResources } from './utils/isAppointmentMatchedResources';

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
        startDayHour,
        endDayHour,
        viewOffset,
        min: dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
        isTimeDateView: isDateAndTimeView(this.viewType),
        allDay: supportAllDayAppointment,
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
      });
    });

    return this.filterLoadedAppointments({
      filterOptions,
      groupCount: this.groupCount,
    }, preparedItems);
  }

  filterPreparedItems(
    { filterOptions, groupCount },
    preparedItems: AppointmentDataItem[],
  ): AppointmentDataItem[] {
    const combinedFilters: any = [];

    let itemsToFilter = preparedItems;
    const needPreFilter = groupCount > 0;
    if (needPreFilter) {
      // @ts-expect-error
      itemsToFilter = itemsToFilter.filter(({ rawAppointment }) => {
        for (let i = 0; i < filterOptions.length; ++i) {
          const { resources } = filterOptions[i];
          if (isAppointmentMatchedResources(rawAppointment, resources)) {
            return true;
          }
        }
      });
    }

    filterOptions.forEach((option) => {
      combinedFilters.length && combinedFilters.push('or');

      const filter = this._createCombinedFilter(option);

      combinedFilters.push(filter);
    });

    // @ts-expect-error
    return query(itemsToFilter)
      // @ts-expect-error
      .filter(combinedFilters)
      .toArray();
  }

  hasAllDayAppointments(filteredItems, preparedItems: AppointmentDataItem[]): boolean {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }

  _getPrerenderFilterResources(groupIndex) {
    const resourceManager = this.options.getResourceManager();

    return getResourcesByGroupIndex(
      resourceManager.groupsLeafs,
      resourceManager.resourceById,
      groupIndex,
    );
  }
}
