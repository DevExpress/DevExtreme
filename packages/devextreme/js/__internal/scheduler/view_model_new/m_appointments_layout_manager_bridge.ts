import type { Appointment } from '@js/ui/scheduler';
import { AppointmentAdapter } from '@ts/scheduler/utils/appointment_adapter/appointment_adapter';

import type Scheduler from '../m_scheduler';
import type { RenderStrategyName, SafeAppointment } from '../types';
import type { AppointmentViewModelPlain } from '../view_model/generate_view_model/types';
import AppointmentLayoutManagerDeprecated from '../view_model/m_appointments_layout_manager';
import { AgendaAppointmentLayoutManager } from './agenda_view/agenda_appointment_layout_manager';

class AppointmentLayoutManagerBridge {
  preparedItems: any[] = [];

  filteredItems: any[] = [];

  agendaLayoutManager: AgendaAppointmentLayoutManager;

  oldLayoutManager: AppointmentLayoutManagerDeprecated;

  get _positionMap() {
    return this.oldLayoutManager._positionMap;
  }

  constructor(public instance: Scheduler) {
    this.agendaLayoutManager = new AgendaAppointmentLayoutManager(instance);
    this.oldLayoutManager = new AppointmentLayoutManagerDeprecated(instance);
  }

  protected useNewViewModel(): boolean {
    return this.instance.currentView.type === 'agenda';
  }

  public getLayoutManager(): AgendaAppointmentLayoutManager {
    return this.agendaLayoutManager;
  }

  public prepareAppointments(items?: Appointment[]): void {
    if (this.useNewViewModel()) {
      this.preparedItems = this.getLayoutManager().prepareAppointments(items);
    } else {
      this.oldLayoutManager.prepareAppointments(items);
      this.preparedItems = this.oldLayoutManager.preparedItems;
    }
  }

  public filterAppointments(): void {
    if (this.useNewViewModel()) {
      this.filteredItems = this.getLayoutManager().filterAppointments(this.preparedItems);
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
      if (this.instance.currentView.type === 'agenda') {
        const viewModel = this.agendaLayoutManager.generateViewModel(this.filteredItems);
        return viewModel.map((item) => {
          const adapter = new AppointmentAdapter(
            item.itemData,
            this.instance._dataAccessors,
          ).clone();

          adapter.startDate = new Date(item.startDate);
          adapter.endDate = new Date(item.endDate);
          adapter.calculateDates(this.instance.timeZoneCalculator, 'fromGrid');

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
