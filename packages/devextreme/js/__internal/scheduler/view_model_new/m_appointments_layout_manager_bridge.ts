import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import type { RenderStrategyName, SafeAppointment } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import type { AppointmentViewModelPlain } from '../view_model/generate_view_model/types';
import AppointmentLayoutManagerDeprecated from '../view_model/m_appointments_layout_manager';
import { filterAppointments } from './filtration/filter_appointments';
import { generateAgendaViewModel } from './generate_view_model/generate_agenda_view_model';
import { prepareAppointments } from './preparation/prepare_appointments';

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
    return this.schedulerStore.currentView.type === 'agenda';
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
      if (this.schedulerStore.currentView.type === 'agenda') {
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
