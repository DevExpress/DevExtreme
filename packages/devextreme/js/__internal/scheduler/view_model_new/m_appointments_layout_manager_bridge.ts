import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import type { RenderStrategyName, SafeAppointment } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import type {
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/generate_view_model/types';
import AppointmentLayoutManagerDeprecated from '../view_model/m_appointments_layout_manager';
import { filterAppointments } from './filtration/filter_appointments';
import { generateAgendaViewModel } from './generate_view_model/generate_agenda_view_model';
import { generateMonthViewModel } from './generate_view_model/generate_month_view_model';
import type { RealSize } from './generate_view_model/steps/add_geometry/types';
import { prepareAppointments } from './preparation/prepare_appointments';
import type { AppointmentEntity, ListEntity, OriginalAppointmentDates } from './types';

class AppointmentLayoutManagerBridge {
  preparedItems: any[] = [];

  filteredItems: any[] = [];

  oldLayoutManager: AppointmentLayoutManagerDeprecated;

  get _positionMap() {
    return this.oldLayoutManager._positionMap;
  }

  // NOTE: Here we should pass global store. But right now scheduler component is global store
  constructor(public schedulerStore: Scheduler) {
    this.oldLayoutManager = new AppointmentLayoutManagerDeprecated(schedulerStore);
  }

  protected useNewViewModel(): boolean {
    const viewType = this.schedulerStore.currentView.type;
    const isVirtualScrolling = this.schedulerStore.isVirtualScrolling();
    return viewType === 'agenda' || (
      !isVirtualScrolling
      && this.schedulerStore.resourceManager.groupCount() === 0
      && ['month'].includes(this.schedulerStore.currentView.type)
    );
  }

  public prepareAppointments(items?: Appointment[]): void {
    if (this.useNewViewModel()) {
      this.preparedItems = prepareAppointments(this.schedulerStore, items);
    } else {
      this.oldLayoutManager.prepareAppointments(items);
      this.preparedItems = this.oldLayoutManager.preparedItems;
    }
  }

  public filterAppointments(): void {
    if (this.useNewViewModel()) {
      this.filteredItems = filterAppointments(this.schedulerStore, this.preparedItems);
    } else {
      this.oldLayoutManager.filterAppointments();
      this.filteredItems = this.oldLayoutManager.filteredItems;
    }
  }

  public hasAllDayAppointments(): boolean {
    if (this.useNewViewModel()) {
      return false;
    }

    return this.oldLayoutManager.hasAllDayAppointments();
  }

  public generateViewModel(): AppointmentViewModelPlain[] {
    if (this.useNewViewModel()) {
      switch (this.schedulerStore.currentView.type) {
        case 'agenda': {
          const viewModel = generateAgendaViewModel(this.schedulerStore, this.filteredItems);
          return viewModel.map((item) => {
            const adapter = new AppointmentAdapter(
              item.itemData,
              this.schedulerStore._dataAccessors,
            ).clone();

            adapter.startDate = new Date(item.startDate);
            adapter.endDate = new Date(item.endDate);
            adapter.calculateDates(this.schedulerStore.timeZoneCalculator, 'fromGrid');

            return {
              ...item,
              agendaSettings: adapter.source as SafeAppointment,
            };
          });
        }
        case 'month': {
          const viewModel = generateMonthViewModel(this.schedulerStore, this.filteredItems);
          const getInfo = (item: ListEntity & OriginalAppointmentDates) => {
            const adapter = new AppointmentAdapter(
              item.itemData,
              this.schedulerStore._dataAccessors,
            ).clone();

            adapter.startDate = new Date(item.originalAppointmentDates.startDate);
            adapter.endDate = new Date(item.originalAppointmentDates.endDate);
            const dates = adapter.getCalculatedDates(this.schedulerStore.timeZoneCalculator, 'fromGrid');

            return {
              appointment: {
                allDay: item.allDay,
                startDate: adapter.startDate,
                endDate: adapter.endDate,
              },
              sourceAppointment: {
                allDay: item.allDay,
                startDate: dates.startDate,
                endDate: dates.endDate,
              },
            };
          };
          const toItem = (item: AppointmentEntity): AppointmentItemViewModel => ({
            itemData: item.itemData,
            allDay: false, // otherwise all day appointment will not render
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
            info: getInfo(item),
          });
          const toCollectedItem = (
            item: ListEntity & OriginalAppointmentDates & RealSize,
          ): AppointmentItemViewModel => ({
            itemData: item.itemData,
            allDay: false, // otherwise all day appointment will not render
            groupIndex: item.groupIndex,
            width: item.width,
            height: item.height,
            info: getInfo(item),
          } as unknown as AppointmentItemViewModel);
          return viewModel.map((item) => {
            if (item.items.length) {
              return {
                itemData: item.itemData,
                allDay: false, // otherwise all day appointment will not render
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
        default:
      }
    }

    const oldViewModel = this.oldLayoutManager.generateViewModel();
    return oldViewModel;
  }

  public get appointmentRenderingStrategyName(): RenderStrategyName {
    return this.oldLayoutManager.appointmentRenderingStrategyName;
  }

  public getRenderingStrategyInstance() {
    return this.oldLayoutManager.getRenderingStrategyInstance();
  }
}

export default AppointmentLayoutManagerBridge;
