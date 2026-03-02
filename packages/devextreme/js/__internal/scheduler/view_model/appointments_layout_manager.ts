import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import { filterAppointments } from './filtration/filter_appointments';
import type { Occurrence } from './filtration/get_occurrences';
import { getOccurrences } from './filtration/get_occurrences';
import { generateAgendaViewModel } from './generate_view_model/generate_agenda_view_model';
import { generateGridViewModel, sortAppointments } from './generate_view_model/generate_grid_view_model';
import type { RealSize } from './generate_view_model/steps/add_geometry/types';
import { getAgendaAppointmentInfo, getAppointmentInfo } from './get_appointment_info';
import { prepareAppointments } from './preparation/prepare_appointments';
import type {
  AppointmentCollectorViewModel,
  AppointmentEntity,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  ListEntity,
  MinimalAppointmentEntity,
  SortedEntity,
  UTCDatesBeforeSplit,
} from './types';

class AppointmentLayoutManager {
  preparedItems: MinimalAppointmentEntity[] = [];

  filteredItems: ListEntity[] = [];

  private _sortedItems: SortedEntity[] = [];

  public get sortedItems(): SortedEntity[] { return this._sortedItems; }

  viewModel: AppointmentViewModelPlain[] = [];

  // NOTE: Here we should pass global store. But right now scheduler component is global store
  constructor(public schedulerStore: Scheduler) {}

  public prepareAppointments(items?: Appointment[]): void {
    this.preparedItems = prepareAppointments(this.schedulerStore, items);
  }

  public filterAppointments(): void {
    this.filteredItems = filterAppointments(this.schedulerStore, this.preparedItems);
  }

  private sortAppointments(): void {
    this._sortedItems = sortAppointments(this.schedulerStore, this.filteredItems);
  }

  public getOccurrences(
    startDate: Date,
    endDate: Date,
    rawAppointments: Appointment[],
  ): Occurrence[] {
    const preparedAppointments = prepareAppointments(this.schedulerStore, rawAppointments);
    const occurrences = getOccurrences(
      this.schedulerStore,
      startDate,
      endDate,
      preparedAppointments,
    );

    return occurrences;
  }

  public hasAllDayAppointments(): boolean {
    return this.filteredItems.filter((item: ListEntity) => item.isAllDayPanelOccupied).length > 0;
  }

  public generateViewModel(): AppointmentViewModelPlain[] {
    const viewType = this.schedulerStore.currentView.type;
    if (viewType === 'agenda') {
      const viewModel = generateAgendaViewModel(this.schedulerStore, this.filteredItems);
      return viewModel.map((item) => ({
        ...item,
        isAgendaModel: true,
        info: getAgendaAppointmentInfo(item),
      }));
    }

    this.sortAppointments();
    const isSkipResizing = (appointment: ListEntity): boolean => appointment.isAllDayPanelOccupied
      && viewType === 'day'
      && this.schedulerStore.currentView.intervalCount === 1;
    const viewModel = generateGridViewModel(this.schedulerStore, this._sortedItems);
    const toItem = (item: AppointmentEntity): AppointmentItemViewModel => ({
      itemData: item.itemData,
      allDay: item.isAllDayPanelOccupied,
      groupIndex: item.groupIndex,
      sortedIndex: item.sortedIndex,
      direction: item.direction,
      level: item.level,
      maxLevel: item.maxLevel,
      empty: item.empty,
      top: item.top,
      left: item.left,
      height: item.height,
      width: item.width,
      reduced: item.reduced,
      partIndex: item.partIndex,
      partTotalCount: item.partCount,
      rowIndex: item.rowIndex,
      columnIndex: item.columnIndex,
      skipResizing: isSkipResizing(item),
      info: getAppointmentInfo(item),
    });
    const toCollectedItem = (
      item: ListEntity & UTCDatesBeforeSplit & RealSize,
    ): AppointmentItemViewModel => ({
      itemData: item.itemData,
      allDay: item.isAllDayPanelOccupied,
      groupIndex: item.groupIndex,
      width: item.width,
      height: item.height,
      info: getAppointmentInfo(item),
    } as unknown as AppointmentItemViewModel);
    return viewModel.map((item) => {
      if (item.items.length) {
        return {
          itemData: item.itemData,
          allDay: item.isAllDayPanelOccupied,
          groupIndex: item.groupIndex,
          sortedIndex: item.sortedIndex,
          top: item.top,
          left: item.left,
          width: item.width,
          height: item.height,
          isCompact: item.isCompact,
          items: item.items.map(toCollectedItem),
        } as AppointmentCollectorViewModel;
      }

      return toItem(item);
    });
  }
}

export default AppointmentLayoutManager;
