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
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  BaseAppointmentViewModel,
} from '../view_model/types';
import { AgendaAppointmentView } from './appointment/agenda_appointment';
import type { BaseAppointmentViewProperties } from './appointment/base_appointment';
import { GridAppointmentView } from './appointment/grid_appointment';
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

  onAppointmentRendered: BaseAppointmentViewProperties['onRendered'];

  getAppointmentDataSource: () => AppointmentDataSource;
  getResourceManager: () => ResourceManager;
  getDataAccessor: () => AppointmentDataAccessor;
}

type ViewItem = GridAppointmentView | AgendaAppointmentView | AppointmentCollector;

export class Appointments extends DOMComponent<Appointments, AppointmentsProperties> {
  private viewItemBySortedIndex: Record<number, ViewItem> = {};

  private viewItems: ViewItem[] = [];

  public getViewItemByIndex(index: number): ViewItem | undefined {
    return this.viewItems[index];
  }

  public getViewItemBySortedIndex(sortedIndex: number): ViewItem | undefined {
    return this.viewItemBySortedIndex[sortedIndex];
  }

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

    // TODO: legacy compatibility
    if (this.option().appointmentTemplate === 'item') {
      this.option('appointmentTemplate', 'appointment');
    }
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
          this.renderViewModel(args.value);
          break;
        }

        const diff = this.getViewModelDiff(
          args.previousValue ?? [],
          (args.value ?? []) as AppointmentItemViewModel[] | AppointmentCollectorViewModel[],
        );
        this.renderViewModelDiff(diff);
        break;
      }
      case 'appointmentCollectorTemplate':
      case 'appointmentTemplate': {
        // TODO: legacy compatibility
        if (args.name === 'appointmentTemplate' && args.value === 'item') {
          this.option('appointmentTemplate', 'appointment');
          break;
        }

        this.renderViewModel(this.option().viewModel);
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

  private getViewModelDiff(
    oldViewModel: AppointmentViewModelPlain[],
    newViewModel: AppointmentItemViewModel[] | AppointmentCollectorViewModel[],
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

  private renderViewModel(viewModel: AppointmentViewModelPlain[] = []): void {
    const allDayFragment = domAdapter.createDocumentFragment();
    const commonFragment = domAdapter.createDocumentFragment();

    this.viewItemBySortedIndex = {};
    this.$allDayContainer?.empty();
    this.$commonContainer.empty();

    viewModel.forEach((viewModelItem, index) => {
      const container = this.option().currentView === 'agenda' || !viewModelItem.allDay
        ? commonFragment
        : allDayFragment;

      const viewItem = this.renderViewItem(container, viewModelItem, index);
      this.viewItemBySortedIndex[viewModelItem.sortedIndex] = viewItem;
    });

    this.$allDayContainer?.get(0).appendChild(allDayFragment);
    this.$commonContainer.get(0).appendChild(commonFragment);
  }

  private renderViewModelDiff(viewModelDiff: DiffItem[]): void {
    const allDayFragment = domAdapter.createDocumentFragment();
    const commonFragment = domAdapter.createDocumentFragment();

    const newViewItemBySortedIndex: Record<number, ViewItem> = {};

    const isRepaintAll = viewModelDiff.every(
      (item) => Boolean(item.needToAdd ?? item.needToRemove),
    );

    if (isRepaintAll) {
      this.$allDayContainer?.empty();
      this.$commonContainer.empty();
    }

    // TODO: remove passing index to appointmentTemplate, need only to avoid BC
    viewModelDiff.forEach((diffItem, index) => {
      const { allDay, sortedIndex } = diffItem.item;
      const lookupIndex = diffItem.oldSortedIndex ?? sortedIndex;
      const viewItem = this.viewItemBySortedIndex[lookupIndex];

      switch (true) {
        case diffItem.needToRemove: {
          if (isRepaintAll) {
            break;
          }

          viewItem.$element().remove();
          break;
        }
        case diffItem.needToAdd: {
          const fragment = allDay ? allDayFragment : commonFragment;
          const newViewItem = this.renderViewItem(fragment, diffItem.item, index);

          newViewItemBySortedIndex[sortedIndex] = newViewItem;
          break;
        }
        case diffItem.needToResize: {
          viewItem.resize({
            height: diffItem.item.height,
            width: diffItem.item.width,
            top: diffItem.item.top,
            left: diffItem.item.left,
          });

          newViewItemBySortedIndex[sortedIndex] = viewItem;
          break;
        }
        default:
          newViewItemBySortedIndex[sortedIndex] = viewItem;
      }
    });

    this.viewItemBySortedIndex = newViewItemBySortedIndex;
    this.viewItems = Object.values(this.viewItemBySortedIndex);

    this.$allDayContainer?.get(0).appendChild(allDayFragment);
    this.$commonContainer.get(0).appendChild(commonFragment);
  }

  private renderViewItem(
    fragment: DocumentFragment,
    appointmentViewModel: AppointmentViewModelPlain,
    index: number,
  ): ViewItem {
    const $element = $('<div>');

    fragment.appendChild($element.get(0));

    const targetedAppointmentData = this.getTargetedAppointmentData(appointmentViewModel);

    if (isAppointmentCollectorViewModel(appointmentViewModel)) {
      return this._createComponent($element, AppointmentCollector, {
        appointmentsData: appointmentViewModel.items.map((item) => item.itemData),
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

    const baseConfig: BaseAppointmentViewProperties = {
      index,
      appointmentTemplate: this._getTemplateByOption('appointmentTemplate'),
      appointmentData: appointmentViewModel.itemData,
      targetedAppointmentData,
      getResourceColor: this.getResourceColor.bind(this, appointmentViewModel),
      onRendered: this.option().onAppointmentRendered,
      getDataAccessor: this.option().getDataAccessor,
    };

    if (isGridAppointmentViewModel(appointmentViewModel)) {
      return this._createComponent(
        $element,
        GridAppointmentView,
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
      AgendaAppointmentView,
      {
        ...baseConfig,
        modifiers: {
          isLastInGroup: appointmentViewModel.isLastInGroup,
        },
        geometry: {
          height: appointmentViewModel.height,
          width: appointmentViewModel.width,
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
