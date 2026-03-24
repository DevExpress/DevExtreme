import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as SchedulerProperties } from '@js/ui/scheduler';
import { domAdapter } from '@ts/core/m_dom_adapter';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type { TargetedAppointment } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import type { AppointmentViewModelPlain } from '../view_model/types';
import { AgendaAppointment } from './appointment/agenda_appointment';
import type { BaseAppointmentProperties } from './appointment/base_appointment';
import { GridAppointment } from './appointment/grid_appointment';
import { AppointmentCollector } from './appointment_collector';
import { APPOINTMENTS_CONTAINER_CLASS } from './const';
import type { DiffItem } from './get_view_model_diff';
import { getViewModelDiff } from './get_view_model_diff';
import { getTargetedAppointment } from './utils/get_targeted_appointment';
import { isCollectorViewModel as isAppointmentCollectorViewModel, isGridAppointmentViewModel } from './utils/type_helpers';

export interface AppointmentsProperties extends DOMComponentProperties<Appointments> {
  tabIndex: number;
  viewModel: AppointmentViewModelPlain[];
  items: AppointmentViewModelPlain[]; // TODO: legacy compatibility
  allowDrag: boolean;
  allowResize: boolean;
  $allDayContainer: dxElementWrapper | null;

  appointmentTemplate: SchedulerProperties['appointmentTemplate'];
  appointmentCollectorTemplate: SchedulerProperties['appointmentCollectorTemplate'];

  onAppointmentRendered: BaseAppointmentProperties['onAppointmentRendered'];
  onAppointmentClick: () => void;
  onAppointmentDblClick: () => void;
  onAppointmentContextMenu: () => void;

  getAppointmentDataSource: () => AppointmentDataSource;
  getResourceManager: () => ResourceManager;
  getDataAccessor: () => AppointmentDataAccessor;
}

type AppointmentComponent = GridAppointment | AgendaAppointment | AppointmentCollector;

export class Appointments extends DOMComponent<Appointments, AppointmentsProperties> {
  private appointmentBySortIndex: Record<number, AppointmentComponent> = {};

  private get $allDayContainer(): dxElementWrapper | null {
    return this.option().$allDayContainer;
  }

  private get $commonContainer(): dxElementWrapper {
    return this.$element();
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.$element().addClass(APPOINTMENTS_CONTAINER_CLASS);
  }

  override _getDefaultOptions(): AppointmentsProperties {
    return {
      ...super._getDefaultOptions(),
      tabIndex: 0,
      viewModel: [],
      allowDrag: false,
      allowResize: false,
      $allDayContainer: null,
      appointmentTemplate: 'appointment',
      appointmentCollectorTemplate: 'appointmentCollector',
      onAppointmentRendered: (): void => {},
      onAppointmentClick: (): void => {},
      onAppointmentDblClick: (): void => {},
      onAppointmentContextMenu: (): void => {},
    };
  }

  override _optionChanged(args: OptionChanged<AppointmentsProperties>): void {
    switch (args.name) {
      case 'items': { // TODO: legacy compatibility
        this.option('viewModel', args.value);
        break;
      }
      case 'viewModel': {
        const diff = this.getViewModelDiff(args.value ?? [], args.previousValue ?? []);
        this.renderViewModelDiff(diff);
        break;
      }
      default:
        break;
    }
  }

  public updateResizableArea(): void { /* TODO: legacy compatibility */ }

  public moveAppointmentBack(): void { /* TODO: legacy compatibility */ }

  public focus(): void { /* TODO: legacy compatibility */ }

  public _renderAppointmentTemplate(): void { /* TODO: legacy compatibility */ }

  private getAppointmentElement(sortedIndex: number): dxElementWrapper {
    return this.appointmentBySortIndex[sortedIndex].$element();
  }

  private getViewModelDiff(
    newViewModel: AppointmentViewModelPlain[],
    oldViewModel: AppointmentViewModelPlain[],
  ): DiffItem[] {
    return getViewModelDiff(oldViewModel, newViewModel, this.option().getAppointmentDataSource());
  }

  private renderViewModelDiff(viewModelDiff: DiffItem[]): void {
    const allDayFragment = domAdapter.createDocumentFragment();
    const commonFragment = domAdapter.createDocumentFragment();

    const newAppointmentBySortedIndex: Record<number, AppointmentComponent> = {};

    const isRepaintAll = viewModelDiff.every(
      (item) => Boolean(item.needToAdd ?? item.needToRemove),
    );

    if (isRepaintAll) {
      this.$allDayContainer?.empty();
      this.$commonContainer.empty();
    }

    viewModelDiff.forEach((diffItem) => {
      const { allDay, sortedIndex } = diffItem.item;

      switch (true) {
        case diffItem.needToRemove && !isRepaintAll: {
          this.getAppointmentElement(sortedIndex).remove();
          break;
        }
        case diffItem.needToAdd: {
          const fragment = allDay ? allDayFragment : commonFragment;
          const appointment = this.renderAppointment(fragment, diffItem.item);

          newAppointmentBySortedIndex[sortedIndex] = appointment;
          break;
        }
        case diffItem.needToResize: {
          const appointment = this.appointmentBySortIndex[sortedIndex];
          appointment.option('viewModel', diffItem.item);
          appointment.resize();

          newAppointmentBySortedIndex[sortedIndex] = this.appointmentBySortIndex[sortedIndex];
          break;
        }
        default:
          newAppointmentBySortedIndex[sortedIndex] = this.appointmentBySortIndex[sortedIndex];
      }
    });

    this.appointmentBySortIndex = newAppointmentBySortedIndex;

    this.$allDayContainer?.get(0).appendChild(allDayFragment);
    this.$commonContainer.get(0).appendChild(commonFragment);
  }

  private renderAppointment(
    fragment: DocumentFragment,
    appointmentViewModel: AppointmentViewModelPlain,
  ): AppointmentComponent {
    const $element = $('<div>');

    fragment.appendChild($element.get(0));

    const targetedAppointmentData = this.getTargetedAppointmentData(appointmentViewModel);

    if (isAppointmentCollectorViewModel(appointmentViewModel)) {
      return this._createComponent($element, AppointmentCollector, {
        viewModel: appointmentViewModel,
        targetedAppointmentData,
        appointmentCollectorTemplate: this.option().appointmentCollectorTemplate,
      });
    }

    const config = {
      appointmentTemplate: this.option().appointmentTemplate,
      targetedAppointmentData,
      onAppointmentRendered: this.option().onAppointmentRendered,
      getResourceManager: this.option().getResourceManager,
      getDataAccessor: this.option().getDataAccessor,
    };

    if (isGridAppointmentViewModel(appointmentViewModel)) {
      return this._createComponent(
        $element,
        GridAppointment,
        {
          ...config,
          viewModel: appointmentViewModel,
        },
      );
    }

    return this._createComponent(
      $element,
      AgendaAppointment,
      {
        ...config,
        viewModel: appointmentViewModel,
      },
    );
  }

  private getTargetedAppointmentData(
    appointmentViewModel: AppointmentViewModelPlain,
  ): TargetedAppointment {
    const normalizedAppointmentViewModel = isAppointmentCollectorViewModel(appointmentViewModel)
      ? appointmentViewModel.items[0]
      : appointmentViewModel;

    return getTargetedAppointment(
      normalizedAppointmentViewModel,
      this.option().getDataAccessor(),
      this.option().getResourceManager(),
    );
  }
}

// TODO<Appointments>: rename to dxSchedulerAppointments when old impl is removed
// eslint-disable-next-line
registerComponent('dxSchedulerNewAppointments', Appointments as any);
