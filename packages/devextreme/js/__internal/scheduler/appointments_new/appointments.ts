import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Cancelable, DxEvent } from '@js/events';
import type {
  AppointmentClickEvent,
  AppointmentContextMenuEvent,
  AppointmentDblClickEvent,
  AppointmentRenderedEvent,
  Properties as SchedulerProperties,
} from '@js/ui/scheduler';
import { domAdapter } from '@ts/core/m_dom_adapter';
import { getPublicElement } from '@ts/core/m_element';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import { isElementInDom } from '@ts/core/utils/m_dom';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type { AppointmentTooltipExtraOptions } from '../tooltip_strategies/tooltip_strategy_base';
import type {
  AppointmentTooltipItem,
  SafeAppointment, ScrollToOptions, TargetedAppointment, ViewType,
} from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { AppointmentResource } from '../utils/resource_manager/appointment_groups_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import type {
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  BaseAppointmentViewModel,
  SortedEntity,
} from '../view_model/types';
import { AgendaAppointmentView } from './appointment/agenda_appointment';
import { BaseAppointmentView, type BaseAppointmentViewProperties } from './appointment/base_appointment';
import { GridAppointmentView } from './appointment/grid_appointment';
import { AppointmentCollector } from './appointment_collector';
import { AppointmentsFocusController } from './appointments.focus_controller';
import { APPOINTMENTS_CONTAINER_CLASS } from './const';
import { getTargetedAppointment } from './utils/get_targeted_appointment';
import type { DiffItem } from './utils/get_view_model_diff';
import { getViewModelDiff } from './utils/get_view_model_diff';
import { isAgendaAppointmentViewModel, isCollectorViewModel as isAppointmentCollectorViewModel, isGridAppointmentViewModel } from './utils/type_helpers';
import type { ViewItem } from './view_item';

const SHOW_TOOLTIP_TIMEOUT = 300;

export interface AppointmentsProperties extends DOMComponentProperties<Appointments> {
  currentView: ViewType;
  tabIndex: number;
  viewModel: AppointmentViewModelPlain[];
  items: AppointmentViewModelPlain[]; // TODO: legacy compatibility
  $allDayContainer: dxElementWrapper | null;

  appointmentTemplate: SchedulerProperties['appointmentTemplate'];
  appointmentCollectorTemplate: SchedulerProperties['appointmentCollectorTemplate'];

  onAppointmentRendered: (e: AppointmentRenderedEvent) => void;
  onAppointmentClick: (e: AppointmentClickEvent) => void;
  onAppointmentDblClick: (e: AppointmentDblClickEvent) => void;
  onAppointmentContextMenu: (e: AppointmentContextMenuEvent) => void;

  getAppointmentDataSource: () => AppointmentDataSource;
  getResourceManager: () => ResourceManager;
  getDataAccessor: () => AppointmentDataAccessor;
  getStartViewDate: () => Date;
  getSortedItems: () => SortedEntity[];
  isVirtualScrolling: () => boolean;

  scrollTo: (date: Date, options?: ScrollToOptions) => void;
  showAppointmentTooltip: (
    target: dxElementWrapper,
    data: AppointmentTooltipItem[],
    options?: AppointmentTooltipExtraOptions,
  ) => void;
  showEditAppointmentPopup: (
    appointmentData: SafeAppointment,
    targetedAppointmentData: TargetedAppointment,
  ) => void;

  allowDelete: boolean;
  onDeleteKeyPress: (options: {
    appointmentData: SafeAppointment;
    targetedAppointmentData: TargetedAppointment;
  }) => void;
}

export class Appointments extends DOMComponent<Appointments, AppointmentsProperties> {
  private focusController!: AppointmentsFocusController;

  private appointmentClickTimeout: number | null = null;

  private viewItemBySortedIndex: Record<number, ViewItem> = {};

  private viewItems: ViewItem[] = [];

  public getViewItemByIndex(index: number): ViewItem | undefined {
    return this.viewItems[index];
  }

  public getViewItemBySortedIndex(sortedIndex: number): ViewItem | undefined {
    return this.viewItemBySortedIndex[sortedIndex];
  }

  public getViewModelBySortedIndex(sortedIndex: number): AppointmentViewModelPlain {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = this.option().viewModel.find(
      (viewModel) => viewModel.sortedIndex === sortedIndex,
    )!;
    return result;
  }

  public getAppointmentData($element: dxElementWrapper): {
    appointmentData: SafeAppointment,
    targetedAppointmentData: TargetedAppointment,
  } {
    const viewItem = this.viewItems.find(
      (item: ViewItem) => item.$element().is($element),
    ) as BaseAppointmentView;

    return {
      appointmentData: viewItem.appointmentData,
      targetedAppointmentData: viewItem.targetedAppointmentData,
    };
  }

  public get $allDayContainer(): dxElementWrapper | null {
    return this.option().$allDayContainer;
  }

  public get $commonContainer(): dxElementWrapper {
    return this.$element();
  }

  override _init(): void {
    super._init();

    this.focusController = new AppointmentsFocusController(this, {
      onAppointmentEnterKeyDown: this.onAppointmentDblClick.bind(this),
    });

    this._templateManager.addDefaultTemplates({
      appointment: new EmptyTemplate(),
      appointmentCollector: new EmptyTemplate(),
    });

    // TODO: legacy compatibility
    if (this.option().appointmentTemplate === 'item') {
      this.option('appointmentTemplate', 'appointment');
    }
  }

  override _dispose(): void {
    super._dispose();

    if (this.appointmentClickTimeout) {
      clearTimeout(this.appointmentClickTimeout);
    }
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.$element().addClass(APPOINTMENTS_CONTAINER_CLASS);
  }

  override _getDefaultOptions(): AppointmentsProperties {
    const noop = (): void => {};

    return {
      ...super._getDefaultOptions(),
      tabIndex: 0,
      viewModel: [],
      $allDayContainer: null,
      appointmentTemplate: 'appointment',
      appointmentCollectorTemplate: 'appointmentCollector',
      onAppointmentRendered: noop,
      onAppointmentClick: noop,
      onAppointmentDblClick: noop,
      onAppointmentContextMenu: noop,
      allowDelete: false,
      onDeleteKeyPress: noop,
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

        const isRepaintAll = diff.every(
          (item) => Boolean(item.needToAdd ?? item.needToRemove),
        );

        if (isRepaintAll) {
          this.renderViewModel(args.value);
          break;
        }

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
      case 'tabIndex': {
        this.focusController.resetTabIndex();
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
      const viewItem = this.renderViewItem(viewModelItem, index);
      this.viewItemBySortedIndex[viewModelItem.sortedIndex] = viewItem;

      const container = this.option().currentView === 'agenda' || !viewModelItem.allDay
        ? commonFragment
        : allDayFragment;
      container.appendChild(viewItem.$element().get(0));
    });

    this.viewItems = Object.values(this.viewItemBySortedIndex);

    this.$allDayContainer?.get(0).appendChild(allDayFragment);
    this.$commonContainer.get(0).appendChild(commonFragment);

    this.focusController.resetTabIndex();
  }

  private renderViewModelDiff(viewModelDiff: DiffItem[]): void {
    const allDayFragment = domAdapter.createDocumentFragment();
    const commonFragment = domAdapter.createDocumentFragment();

    const newViewItemBySortedIndex: Record<number, ViewItem> = {};

    viewModelDiff.forEach((diffItem, index) => {
      const { allDay, sortedIndex } = diffItem.item;
      const lookupIndex = diffItem.oldSortedIndex ?? sortedIndex;
      const viewItem = this.viewItemBySortedIndex[lookupIndex];

      switch (true) {
        case diffItem.needToRemove: {
          viewItem.$element().remove();
          break;
        }
        case diffItem.needToAdd: {
          const newViewItem = this.renderViewItem(diffItem.item, index);
          newViewItemBySortedIndex[sortedIndex] = newViewItem;

          const fragment = allDay ? allDayFragment : commonFragment;
          fragment.appendChild(newViewItem.$element().get(0));
          break;
        }
        default:
          if (diffItem.needToResize) {
            viewItem.resize({
              height: diffItem.item.height,
              width: diffItem.item.width,
              top: diffItem.item.top,
              left: diffItem.item.left,
            });
          }

          viewItem.option('sortedIndex', sortedIndex);

          newViewItemBySortedIndex[sortedIndex] = viewItem;
      }
    });

    this.viewItemBySortedIndex = newViewItemBySortedIndex;
    this.viewItems = Object.values(this.viewItemBySortedIndex);

    this.$allDayContainer?.get(0).appendChild(allDayFragment);
    this.$commonContainer.get(0).appendChild(commonFragment);

    this.focusController.resetTabIndex();
  }

  // TODO: remove passing index to appointmentTemplate, need only to avoid BC
  private renderViewItem(
    appointmentViewModel: AppointmentViewModelPlain,
    index: number,
  ): ViewItem {
    const $element = $('<div>');
    const targetedAppointmentData = this.getTargetedAppointmentData(appointmentViewModel);
    const baseViewItemConfig = {
      tabIndex: -1,
      sortedIndex: appointmentViewModel.sortedIndex,
      onFocusIn: this.focusController.onViewItemFocusIn.bind(this.focusController),
      onFocusOut: this.focusController.onViewItemFocusOut.bind(this.focusController),
      onKeyDown: this.focusController.onViewItemKeyDown.bind(this.focusController),
    };

    if (isAppointmentCollectorViewModel(appointmentViewModel)) {
      return this._createComponent($element, AppointmentCollector, {
        ...baseViewItemConfig,
        items: appointmentViewModel.items,
        isCompact: appointmentViewModel.isCompact,
        geometry: {
          height: appointmentViewModel.height,
          width: appointmentViewModel.width,
          top: appointmentViewModel.top,
          left: appointmentViewModel.left,
        },
        targetedAppointmentData,
        appointmentCollectorTemplate: this._getTemplateByOption('appointmentCollectorTemplate'),
        onClick: this.onCollectorClick.bind(this),
      });
    }

    const baseAppointmentViewConfig: BaseAppointmentViewProperties = {
      ...baseViewItemConfig,
      index,
      appointmentTemplate: this._getTemplateByOption('appointmentTemplate'),
      appointmentData: appointmentViewModel.itemData,
      targetedAppointmentData,
      onRendered: this.option().onAppointmentRendered,
      getResourceColor: this.getResourceColor.bind(this, appointmentViewModel),
      getDataAccessor: this.option().getDataAccessor,
      onClick: this.onAppointmentClick.bind(this),
      onDblClick: this.onAppointmentDblClick.bind(this),
      onContextMenu: this.onAppointmentContextMenu.bind(this),
    };

    if (isGridAppointmentViewModel(appointmentViewModel)) {
      return this._createComponent(
        $element,
        GridAppointmentView,
        {
          ...baseAppointmentViewConfig,
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
        ...baseAppointmentViewConfig,
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

  public renderDragClone(appointmentViewModel: AppointmentViewModelPlain): dxElementWrapper {
    return this.renderViewItem(appointmentViewModel, this.viewItems.length).$element();
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

  private onAppointmentClick(
    appointmentView: BaseAppointmentView,
    event: DxEvent,
  ): void {
    this.focusController.onViewItemClick(appointmentView);

    const $target = appointmentView.$element();
    const e = {
      appointmentElement: getPublicElement($target),
      appointmentData: appointmentView.appointmentData,
      targetedAppointmentData: appointmentView.targetedAppointmentData,
      event,
    };

    // @ts-expect-error 'component' and 'element' are set by action
    this.option().onAppointmentClick(e);

    if ((e as Cancelable).cancel) {
      return;
    }

    if (this.appointmentClickTimeout != null) {
      clearTimeout(this.appointmentClickTimeout);
    }

    // setTimeout is used to prevent showing tooltip on double click
    this.appointmentClickTimeout = window.setTimeout(() => {
      this.appointmentClickTimeout = null;

      if (isElementInDom($target)) {
        this.option().showAppointmentTooltip(
          $target,
          this.getTooltipItems(appointmentView),
        );
      }
    }, SHOW_TOOLTIP_TIMEOUT);
  }

  private onAppointmentDblClick(
    appointmentView: BaseAppointmentView,
    event: DxEvent,
  ): void {
    const e = {
      appointmentElement: getPublicElement(appointmentView.$element()),
      appointmentData: appointmentView.appointmentData,
      targetedAppointmentData: appointmentView.targetedAppointmentData,
      event,
    };

    if (this.appointmentClickTimeout) {
      clearTimeout(this.appointmentClickTimeout);
      this.appointmentClickTimeout = null;
    }

    // @ts-expect-error 'component' and 'element' are set by action
    this.option().onAppointmentDblClick(e);

    if ((e as Cancelable).cancel) {
      return;
    }

    this.option().showEditAppointmentPopup(
      appointmentView.appointmentData,
      appointmentView.targetedAppointmentData,
    );
  }

  private onAppointmentContextMenu(
    appointmentView: BaseAppointmentView,
    event: DxEvent,
  ): void {
    const e = {
      appointmentElement: getPublicElement(appointmentView.$element()),
      appointmentData: appointmentView.appointmentData,
      targetedAppointmentData: appointmentView.targetedAppointmentData,
      event,
    };

    // @ts-expect-error 'component' and 'element' are set by action
    this.option().onAppointmentContextMenu(e);
  }

  private onCollectorClick(collector: AppointmentCollector): void {
    this.focusController.onViewItemClick(collector);

    this.option().showAppointmentTooltip(
      collector.$element(),
      this.getTooltipItems(collector),
      {
        isButtonClick: true,
        tabFocusLoopEnabled: true,
      },
    );
  }

  private getTooltipItems(viewItem: ViewItem): AppointmentTooltipItem[] {
    if (viewItem instanceof AppointmentCollector) {
      const tooltipItems: AppointmentTooltipItem[] = viewItem.option().items.map(
        (appointmentViewModel) => ({
          appointment: appointmentViewModel.itemData,
          targetedAppointment: this.getTargetedAppointmentData(appointmentViewModel),
          color: this.getResourceColor(appointmentViewModel),
          settings: appointmentViewModel,
        }),
      );

      return tooltipItems;
    }

    if (viewItem instanceof BaseAppointmentView) {
      const viewModel = this.getViewModelBySortedIndex(
        viewItem.option().sortedIndex,
      ) as AppointmentItemViewModel;

      return [{
        appointment: viewItem.appointmentData,
        targetedAppointment: viewItem.targetedAppointmentData,
        color: this.getResourceColor(viewItem.option()),
        settings: viewModel,
      }];
    }

    return [];
  }
}

// TODO<Appointments>: rename to dxSchedulerAppointments when old impl is removed
// eslint-disable-next-line
registerComponent('dxSchedulerNewAppointments', Appointments as any);
