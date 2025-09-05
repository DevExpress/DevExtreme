import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import type { RenderStrategyName } from '../types';
import type {
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/generate_view_model/types';
import AppointmentLayoutManagerDeprecated from '../view_model/m_appointments_layout_manager';
import { filterAppointments } from './filtration/filter_appointments';
import { generateAgendaViewModel } from './generate_view_model/generate_agenda_view_model';
import { generateGridViewModel } from './generate_view_model/generate_grid_view_model';
import type { RealSize } from './generate_view_model/steps/add_geometry/types';
import { getAppointmentInfo } from './get_appointment_info';
import { prepareAppointments } from './preparation/prepare_appointments';
import type { AppointmentEntity, DatesBeforeSplit, ListEntity } from './types';

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
    return this.schedulerStore.currentView.type === 'agenda' || (
      !this.schedulerStore.isVirtualScrolling()
      && this.schedulerStore.resourceManager.groupCount() === 0
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
      return this.filteredItems.filter((item: ListEntity) => item.isAllDayPanelOccupied).length > 0;
    }

    return this.oldLayoutManager.hasAllDayAppointments();
  }

  public generateViewModel(): AppointmentViewModelPlain[] {
    if (this.useNewViewModel()) {
      const viewType = this.schedulerStore.currentView.type;
      const isSkipResizing = (appointment: ListEntity) => appointment.isAllDayPanelOccupied
        && viewType === 'day'
        && this.schedulerStore.currentView.intervalCount === 1;
      switch (viewType) {
        case 'agenda': {
          const viewModel = generateAgendaViewModel(this.schedulerStore, this.filteredItems);
          return viewModel.map((item) => ({
            ...item,
            isAgendaModel: true,
            info: {
              ...getAppointmentInfo(item),
              partialDates: {
                allDay: item.allDay,
                startDate: new Date(item.datesAfterSplit.startDate),
                endDate: new Date(item.datesAfterSplit.endDate),
              },
            },
          }));
        }
        default: {
          const viewModel = generateGridViewModel(this.schedulerStore, this.filteredItems);
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
            item: ListEntity & DatesBeforeSplit & RealSize,
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
