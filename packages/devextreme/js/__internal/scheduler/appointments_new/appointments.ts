import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as SchedulerProperties } from '@js/ui/scheduler';
import { domAdapter } from '@ts/core/m_dom_adapter';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type { SafeAppointment, TargetedAppointment, ViewType } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { AppointmentResource } from '../utils/resource_manager/appointment_groups_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import type {
  AppointmentAgendaViewModel,
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  BaseAppointmentViewModel,
} from '../view_model/types';
import { AgendaAppointment } from './appointment/agenda_appointment';
import type { BaseAppointmentProperties } from './appointment/base_appointment';
import { GridAppointment } from './appointment/grid_appointment';
import { AppointmentCollector } from './appointment_collector';
import { APPOINTMENTS_CONTAINER_CLASS } from './const';
import { getTargetedAppointment } from './utils/get_targeted_appointment';
import type { DiffItem } from './utils/get_view_model_diff';
import { getViewModelDiff } from './utils/get_view_model_diff';
import { isAgendaAppointmentViewModel, isCollectorViewModel as isAppointmentCollectorViewModel, isGridAppointmentViewModel } from './utils/type_helpers';

export interface AppointmentsProperties extends DOMComponentProperties<Appointments> {
  currentView: ViewType;
  viewModel: AppointmentViewModelPlain[];
  items: AppointmentViewModelPlain[]; // TODO: legacy compatibility
  $allDayContainer: dxElementWrapper | null;

  appointmentTemplate: SchedulerProperties['appointmentTemplate'];
  appointmentCollectorTemplate: SchedulerProperties['appointmentCollectorTemplate'];

  onAppointmentRendered: BaseAppointmentProperties['onAppointmentRendered'];

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

  override _init(): void {
    super._init();

    this._templateManager.addDefaultTemplates({
      appointment: new EmptyTemplate(),
      appointmentCollector: new EmptyTemplate(),
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.$element().addClass(APPOINTMENTS_CONTAINER_CLASS);
  }

  override _getDefaultOptions(): AppointmentsProperties {
    return {
      ...super._getDefaultOptions(),
      viewModel: [],
      $allDayContainer: null,
      appointmentTemplate: 'appointment',
      appointmentCollectorTemplate: 'appointmentCollector',
      onAppointmentRendered: (): void => {},
    };
  }

  override _optionChanged(args: OptionChanged<AppointmentsProperties>): void {
    switch (args.name) {
      case 'items': { // TODO: legacy compatibility
        this.option('viewModel', args.value);
        break;
      }
      case 'viewModel': {
        if (this.option().currentView === 'agenda') {
          this.renderAgendaAppointments(args.value as AppointmentAgendaViewModel[]);
          break;
        }

        const diff = this.getViewModelDiff(
          (args.value ?? []) as AppointmentItemViewModel[] | AppointmentCollectorViewModel[],
          args.previousValue ?? [],
        );
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
    newViewModel: AppointmentItemViewModel[] | AppointmentCollectorViewModel[],
    oldViewModel: AppointmentViewModelPlain[],
  ): DiffItem[] {
    const isPreviousAgenda = oldViewModel.length && isAgendaAppointmentViewModel(oldViewModel[0]);

    const normalizedOldViewModel = isPreviousAgenda
      ? []
      : oldViewModel as AppointmentItemViewModel[] | AppointmentCollectorViewModel[];

    return getViewModelDiff(
      normalizedOldViewModel,
      newViewModel,
      this.option().getAppointmentDataSource(),
    );
  }

  private renderAgendaAppointments(appointments: AppointmentViewModelPlain[]): void {
    const commonFragment = domAdapter.createDocumentFragment();

    this.$commonContainer.empty();

    appointments.forEach((appointmentViewModel) => {
      const appointment = this.renderAppointment(commonFragment, appointmentViewModel);
      this.appointmentBySortIndex[appointmentViewModel.sortedIndex] = appointment;
    });

    this.$commonContainer.get(0).appendChild(commonFragment);
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
          appointment.option('geometry', {
            height: diffItem.item.height,
            width: diffItem.item.width,
            top: diffItem.item.top,
            left: diffItem.item.left,
          });
          appointment.resize();

          newAppointmentBySortedIndex[sortedIndex] = this.appointmentBySortIndex[sortedIndex];
          break;
        }
        default:
          newAppointmentBySortedIndex[sortedIndex] = this.appointmentBySortIndex[sortedIndex];
      }
    });

    this.appointmentBySortIndex = newAppointmentBySortedIndex;

    if (this.$allDayContainer) {
      this.$allDayContainer.get(0).appendChild(allDayFragment);
    }
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
        appointmentsCount: appointmentViewModel.items.length,
        isCompact: appointmentViewModel.isCompact,
        geometry: {
          height: appointmentViewModel.height,
          width: appointmentViewModel.width,
          top: appointmentViewModel.top,
          left: appointmentViewModel.left,
        },
        targetedAppointmentData,
        appointmentCollectorTemplate: this._getTemplateByOption('appointmentCollectorTemplate'),
      });
    }

    const baseConfig: BaseAppointmentProperties = {
      appointmentTemplate: this._getTemplateByOption('appointmentTemplate'),
      appointmentData: appointmentViewModel.itemData,
      targetedAppointmentData,
      getResourceColor: this.getResourceColor.bind(this, appointmentViewModel),
      onAppointmentRendered: this.option().onAppointmentRendered,
      getDataAccessor: this.option().getDataAccessor,
    };

    if (isGridAppointmentViewModel(appointmentViewModel)) {
      return this._createComponent(
        $element,
        GridAppointment,
        {
          ...baseConfig,
          geometry: {
            height: appointmentViewModel.height,
            width: appointmentViewModel.width,
            top: appointmentViewModel.top,
            left: appointmentViewModel.left,
          },
          modifiers: {
            empty: appointmentViewModel.empty,
          },
        },
      );
    }

    return this._createComponent(
      $element,
      AgendaAppointment,
      {
        ...baseConfig,
        modifiers: {
          isLastInGroup: appointmentViewModel.isLastInGroup,
        },
        getResourcesValues: this.getResourcesValues.bind(this),
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

  private getResourceColor(
    appointmentViewModel: BaseAppointmentViewModel,
  ): Promise<string | undefined> {
    const resourceManager = this.option().getResourceManager();

    return resourceManager.getAppointmentColor({
      itemData: appointmentViewModel.itemData,
      groupIndex: appointmentViewModel.groupIndex,
    });
  }

  private getResourcesValues(
    appointmentData: SafeAppointment,
  ): Promise<AppointmentResource[]> {
    const resourceManager = this.option().getResourceManager();

    return resourceManager.getAppointmentResourcesValues(appointmentData);
  }
}

// TODO<Appointments>: rename to dxSchedulerAppointments when old impl is removed
// eslint-disable-next-line
registerComponent('dxSchedulerNewAppointments', Appointments as any);
