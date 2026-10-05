/* eslint-disable spellcheck/spell-checker */
import { locate, move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dblclickEvent } from '@js/common/core/events/double_click';
import { addNamespace, isFakeClickEvent } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error
import { grep, normalizeKey } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import type { DeferredObj } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { setOuterHeight, setOuterWidth } from '@js/core/utils/size';
import { isDeferred, isPlainObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events/events.types';
import type { AppointmentDblClickEvent } from '@js/ui/scheduler';
import type { TemplateBase } from '@ts/core/templates/template_base';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { ItemRenderInfo, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type Resizable from '@ts/ui/resizable/resizable';
import type { ResizeActionArgs } from '@ts/ui/resizable/types';

import type NotifyScheduler from '../base/widget_notify_scheduler';
import {
  AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS,
  APPOINTMENT_CONTENT_CLASSES,
  APPOINTMENT_DRAG_SOURCE_CLASS,
  APPOINTMENT_ITEM_CLASS,
} from '../classes';
import { APPOINTMENT_SETTINGS_KEY } from '../constants';
import type { TimeZoneCalculator } from '../r1/timezone_calculator/index';
import type { SubscribeKey, SubscribeMethods } from '../subscribes';
import type { DesktopTooltipStrategy } from '../tooltip_strategies/desktop_tooltip_strategy';
import type { MobileTooltipStrategy } from '../tooltip_strategies/mobile_tooltip_strategy';
import type {
  CompactAppointmentOptions,
  DOMMetaData,
  SafeAppointment,
  ScrollToGroupValuesOrOptions,
  TargetedAppointment,
} from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import { DateFormatType } from '../utils/get_date_text';
import {
  getTargetedAppointment,
  getTargetedAppointmentFromInfo,
} from '../utils/get_targeted_appointment';
import { getAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import { getGroupTexts } from '../utils/resource_manager/group_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import timeZoneUtils from '../utils_time_zone';
import type { AppointmentDataSource } from '../view_model/appointment_data_source';
import type {
  AppointmentAgendaViewModel,
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  SortedEntity,
} from '../view_model/types';
import type ViewDataProvider from '../workspaces/view_model/view_data_provider';
import { AgendaAppointment } from './appointment/agenda_appointment';
import { Appointment } from './appointment/appointment';
import type { AppointmentProperties } from './appointment/types';
import { createAgendaAppointmentLayout, createAppointmentLayout } from './appointment_layout';
import { AppointmentsKeyboardNavigation } from './appointments_kbn';
import { getAppointmentDateRange } from './resizing/core';
import type { DateRange } from './resizing/types';
import { isNeedToAdd } from './utils/get_arrays_diff';
import { getViewModelDiff } from './utils/get_view_model_diff';

type CollectionItemAction<K extends 'onItemRendered' | 'onItemClick' | 'onItemContextMenu'> = Exclude<
  CollectionWidgetEditProperties<SchedulerAppointments>[K],
  string | null | undefined
>;

export interface AppointmentCollectionOptions {
  getResourceManager: () => ResourceManager;
  getAppointmentDataSource: () => AppointmentDataSource;
  getSortedAppointments: () => SortedEntity[];
  scrollTo: (
    date: Date,
    groupValuesOrOptions?: ScrollToGroupValuesOrOptions,
    allDay?: boolean,
  ) => void;
  appointmentTooltip: MobileTooltipStrategy | DesktopTooltipStrategy;
  dataAccessors: AppointmentDataAccessor;
  notifyScheduler: NotifyScheduler;
  onItemRendered: CollectionItemAction<'onItemRendered'>;
  onItemClick: CollectionItemAction<'onItemClick'>;
  onItemContextMenu: CollectionItemAction<'onItemContextMenu'>;
  onAppointmentDblClick: (args: AppointmentDblClickEvent) => void;
  tabIndex: number;
  focusStateEnabled: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  allowResize: boolean;
  allowAllDayResize: boolean;
  rtlEnabled: boolean;
  groups: string[];
  groupByDate: boolean;
  timeZoneCalculator: TimeZoneCalculator;
  getResizableStep: () => number;
  getDOMElementsMetaData: () => DOMMetaData | undefined;
  getViewDataProvider: () => ViewDataProvider | undefined;
  isVerticalGroupedWorkSpace: () => boolean;
  isDateAndTimeView: () => boolean;
  onContentReady: () => void;
}

export interface AppointmentCollectionProperties
  extends Omit<
    CollectionWidgetEditProperties<SchedulerAppointments>,
    keyof AppointmentCollectionOptions | 'items'
  >,
  AppointmentCollectionOptions {
  items?: AppointmentViewModelPlain[];
  fixedContainer?: dxElementWrapper | null;
  allDayContainer?: dxElementWrapper | null;
}

const COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';

const DBLCLICK_EVENT_NAME = addNamespace(dblclickEvent, 'dxSchedulerAppointment');

const toMs = dateUtils.dateToMilliseconds;

type AppointmentResizeEvent = ResizeActionArgs & {
  element: Element;
  component: Resizable;
};

type ResizableArea = NonNullable<ReturnType<SubscribeMethods['getResizableAppointmentArea']>>
| dxElementWrapper;

interface AppointmentResizableConfig {
  area: ResizableArea;
  onResizeStart: (e: AppointmentResizeEvent) => void;
  onResizeEnd: (e: AppointmentResizeEvent) => void;
}

interface ViewModelDiff {
  item: AppointmentViewModelPlain;
  element?: dxElementWrapper;
  needToAdd?: true;
  needToRemove?: true;
  needToUpdateItems?: true;
}

class SchedulerAppointments extends CollectionWidget<AppointmentCollectionProperties> {
  // NOTE: The key of this array is `sortedIndex` of appointment rendered in Element
  $itemBySortedIndex!: dxElementWrapper[];

  _appointmentClickTimeout?: ReturnType<typeof setTimeout>;

  _currentAppointmentSettings?: AppointmentViewModelPlain;

  _preventSingleAppointmentClick!: boolean;

  _initialSize?: { width: number; height: number };

  _initialCoordinates?: { left: number; top: number };

  private _kbn!: AppointmentsKeyboardNavigation;

  private _focusedItemIndexBeforeRender!: number;

  private _isResizing = false;

  public get isResizing(): boolean {
    return this._isResizing;
  }

  get isAgendaView(): boolean {
    return this.invoke('isCurrentViewAgenda');
  }

  get isVirtualScrolling(): boolean {
    return this.invoke('isVirtualScrolling');
  }

  get appointmentDataSource(): AppointmentDataSource {
    return this.option('getAppointmentDataSource')();
  }

  get dataAccessors(): AppointmentDataAccessor {
    return this.option('dataAccessors');
  }

  get sortedItems(): SortedEntity[] {
    return this.option('getSortedAppointments')();
  }

  getResourceManager(): ResourceManager {
    return this.option('getResourceManager')();
  }

  notifyObserver<Subject extends SubscribeKey>(
    subject: Subject,
    args?: Parameters<SubscribeMethods[Subject]>[0] | Record<string, never>,
  ): void {
    const notifyScheduler = this.option('notifyScheduler');
    if (notifyScheduler) {
      // @ts-expect-error the subscribes that are notified take a single argument object
      notifyScheduler.invoke(subject, args);
    }
  }

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]>;

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> | undefined {
    const notifyScheduler = this.option('notifyScheduler');

    if (notifyScheduler) {
      return notifyScheduler.invoke(funcName, ...args);
    }

    return undefined;
  }

  _dispose(): void {
    clearTimeout(this._appointmentClickTimeout);

    super._dispose();
  }

  _supportedKeys(): SupportedKeys {
    const parentValue = super._supportedKeys();
    const kbnValue = this._kbn.getSupportedKeys();

    return {
      enter: parentValue.enter,
      space: parentValue.space,
      ...kbnValue,
    };
  }

  public getAppointmentSettings($item: dxElementWrapper): AppointmentViewModelPlain {
    return $($item).data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain;
  }

  _moveFocus(): void {}

  _focusTarget(): dxElementWrapper {
    return this._kbn.getFocusableItems();
  }

  _renderFocusTarget(): void {
    if (this.$itemBySortedIndex?.length) {
      this._kbn.resetTabIndex(this._kbn.getFirstVisibleItem());
    }
  }

  _cleanFocusState(): void {
    this._focusedItemIndexBeforeRender = this._kbn.isNavigating
      ? this._kbn.focusedItemSortIndex
      : -1;

    super._cleanFocusState();
  }

  _renderFocusState(): void {
    super._renderFocusState();

    if (this._focusedItemIndexBeforeRender !== -1) {
      this._kbn.focusedItemSortIndex = this._focusedItemIndexBeforeRender;
      this._kbn.isNavigating = false;
      this._kbn.focus();
      this._focusedItemIndexBeforeRender = -1;
    } else {
      this._kbn.focusedItemSortIndex = -1;
    }
  }

  _focusInHandler(e: DxEvent): void {
    super._focusInHandler(e);
    this._kbn.focusInHandler(e);
  }

  _focusOutHandler(e: DxEvent): void {
    this._kbn.focusOutHandler();
    super._focusOutHandler(e);
  }

  _eventBindingTarget(): dxElementWrapper {
    return this._itemContainer();
  }

  _getDefaultOptions(): AppointmentCollectionProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      noDataText: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      tabIndex: 0,
      fixedContainer: null,
      allDayContainer: null,
      allowDrag: true,
      allowResize: true,
      allowAllDayResize: true,
      onAppointmentDblClick: null,
      groups: [],
    });
  }

  protected getItemsDiff(
    previousValue: AppointmentViewModelPlain[] = [],
    value: AppointmentViewModelPlain[] = [],
  ): ViewModelDiff[] {
    const elementsInRenderOrder = previousValue
      .map(({ sortedIndex }) => this.$itemBySortedIndex[sortedIndex]);
    const diff = getViewModelDiff(previousValue, value, this.appointmentDataSource);
    diff
      .filter((item) => !isNeedToAdd(item))
      .forEach((item, index) => {
        (item as ViewModelDiff).element = elementsInRenderOrder[index];
      });

    return diff;
  }

  _optionChanged(args: OptionChanged<AppointmentCollectionProperties>): void {
    switch (args.name) {
      case 'items':
        this._cleanFocusState();

        if (this.isAgendaView) {
          this.forceRepaintAllAppointments(args.value || []);
        } else {
          const diff = this.getItemsDiff(args.previousValue, args.value);
          this.repaintAppointments(diff);
        }

        this._attachAppointmentsEvents();
        this._kbn.onItemsRendered();
        break;
      case 'fixedContainer':
      case 'allDayContainer':
      case 'onAppointmentDblClick':
        break;
      case 'allowDrag':
      case 'allowResize':
      case 'allowDelete':
      case 'allowAllDayResize':
        this._cleanFocusState();
        this.forceRepaintAllAppointments(this.option('items') || []);
        this._attachAppointmentsEvents();
        break;
      case 'focusedElement':
        this._kbn.resetTabIndex($(args.value));
        super._optionChanged(args);
        break;
      case 'focusStateEnabled':
        this._clearDropDownItemsElements();
        this.renderDropDownAppointments();

        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _applyFragment(fragment: dxElementWrapper, allDay: boolean): void {
    if (fragment.children().length > 0) {
      this._getAppointmentContainer(allDay).append(fragment);
    }
  }

  protected forceRepaintAllAppointments(items: AppointmentViewModelPlain[]): void {
    this.$itemBySortedIndex = [];
    this._renderByFragments(($commonFragment, $allDayFragment) => {
      this._getAppointmentContainer(true).html('');
      this._getAppointmentContainer(false).html('');
      if (items.length === 0) {
        this._cleanItemContainer();
      }

      items.forEach((item, index) => {
        const container = item.allDay
          ? $allDayFragment
          : $commonFragment;
        this._renderItem(index, item, container);
      });
    });
  }

  protected repaintAppointments(diff: ViewModelDiff[]): void {
    this.$itemBySortedIndex = [];

    const { appointmentTooltip } = this.option();
    let $newTooltipTarget: dxElementWrapper | null = null;
    let targetViewModel: AppointmentCollectorViewModel | null = null;

    this._renderByFragments(($commonFragment, $allDayFragment) => {
      const isRepaintAll = diff.every(
        (item) => Boolean(item.needToAdd ?? item.needToRemove),
      );

      if (isRepaintAll) {
        this._getAppointmentContainer(true).html('');
        this._getAppointmentContainer(false).html('');
      }
      if (diff.length === 0) {
        this._cleanItemContainer();
      }

      diff.forEach((item, index) => {
        if (isRepaintAll && item.needToRemove) {
          return;
        }

        if (item.needToRemove) {
          item.element?.remove();
          return;
        }

        const container = item.item.allDay
          ? $allDayFragment
          : $commonFragment;

        if (item.needToAdd) {
          this._renderItem(index, item.item, container);
          return;
        }

        if (item.needToUpdateItems) {
          const $oldElement = item.element as dxElementWrapper;
          $oldElement.detach();

          const $newElement = this._renderItem(index, item.item, container);

          if (appointmentTooltip.isShownForTarget($oldElement)) {
            $newTooltipTarget = $newElement;
            targetViewModel = item.item as AppointmentCollectorViewModel;
          }

          $oldElement.remove();

          return;
        }

        if (item.element) {
          item.element.data(APPOINTMENT_SETTINGS_KEY, item.item);
          this.$itemBySortedIndex[item.item.sortedIndex] = item.element;
        }
      });
    });

    this.updateTooltip($newTooltipTarget, targetViewModel);
  }

  private updateTooltip(
    $newTarget: dxElementWrapper | null,
    collectorViewModel: AppointmentCollectorViewModel | null,
  ): void {
    const { appointmentTooltip } = this.option();

    if (!appointmentTooltip) {
      return;
    }

    if ($newTarget !== null && collectorViewModel !== null) {
      const dataList = this.getCompactAppointmentItems(collectorViewModel);

      appointmentTooltip.setTarget($newTarget);
      appointmentTooltip.setListItems(dataList);
    } else {
      const targetElement = appointmentTooltip.getTarget()?.[0];

      if (targetElement && !targetElement.isConnected) {
        appointmentTooltip.hide();
      }
    }
  }

  _renderByFragments(renderFunction: (
    $commonFragment: dxElementWrapper,
    $allDayFragment: dxElementWrapper,
  ) => void): void {
    if (this.isVirtualScrolling) {
      const $commonFragment = $(domAdapter.createDocumentFragment());
      const $allDayFragment = $(domAdapter.createDocumentFragment());

      renderFunction($commonFragment, $allDayFragment);

      this._applyFragment($commonFragment, false);
      this._applyFragment($allDayFragment, true);
    } else {
      renderFunction(
        this._getAppointmentContainer(false),
        this._getAppointmentContainer(true),
      );
    }
  }

  _refreshActiveDescendant(): void {
    // override to do nothing
  }

  _attachAppointmentsEvents(): void {
    this._attachClickEvent();
    this._attachHoldEvent();
    this._attachContextMenuEvent();
    this._attachAppointmentDblClick();

    this._renderFocusState();
    this._attachFeedbackEvents();
    this._attachHoverEvents();
  }

  _clearDropDownItemsElements(): void {
    this.invoke('clearCompactAppointments');
  }

  // @ts-expect-error returns every element of the item, the base returns one element
  _findItemElementByItem(item: unknown): dxElementWrapper[] {
    const result: dxElementWrapper[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // @ts-expect-error the each() callback may return nothing, the d.ts requires a boolean
    this.itemElements().each(function () {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const $item = $(this);
      if ($item.data(that._itemDataKey()) === item) {
        result.push($item);
      }
    });

    return result;
  }

  _itemClass(): string {
    return APPOINTMENT_ITEM_CLASS;
  }

  _itemContainer(): dxElementWrapper {
    const $container = super._itemContainer();
    let $result = $container;
    const $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $result = $container.add($allDayContainer);
    }

    return $result;
  }

  _cleanItemContainer(): void {
    super._cleanItemContainer();
    const $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $allDayContainer.empty();
    }
  }

  _init(): void {
    super._init();
    this.$itemBySortedIndex = [];
    this._kbn = new AppointmentsKeyboardNavigation(this);
    this._focusedItemIndexBeforeRender = -1;
    this.$element().addClass(COMPONENT_CLASS);
    this._preventSingleAppointmentClick = false;
  }

  // TODO: used externally in scheduler.ts
  _renderAppointmentTemplate(
    $container: dxElementWrapper,
    appointment: SafeAppointment,
    model: { targetedAppointmentData: TargetedAppointment },
  ): void {
    const config = {
      isAllDay: appointment.allDay,
      isRecurrence: appointment.recurrenceRule,

      // TODO
      html: isPlainObject(appointment) && appointment.html
        ? appointment.html : undefined,
    };

    let { targetedAppointmentData } = model;
    if (this._currentAppointmentSettings && 'isAgendaModel' in this._currentAppointmentSettings) {
      targetedAppointmentData = getTargetedAppointmentFromInfo(
        this._currentAppointmentSettings.itemData,
        this._currentAppointmentSettings,
        this.dataAccessors,
        this.getResourceManager(),
        true,
      );
    }

    const formatText = this.invoke(
      'createFormattedDateText',
      appointment,
      targetedAppointmentData,
      appointment.allDay ? DateFormatType.DATE : DateFormatType.TIME,
    );

    $container.append(this.isAgendaView
      ? createAgendaAppointmentLayout(formatText, config)
      : createAppointmentLayout(formatText, config));

    if (!this.isAgendaView) {
      $container.parent().prepend(
        $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.STRIP),
      );
    }
  }

  _executeItemRenderAction(
    index: number,
    itemData: SafeAppointment,
    itemElement: HTMLElement,
  ): void {
    const action = this._getItemRenderAction();
    if (action) {
      // @ts-expect-error the scheduler maps the item info to the appointment event fields
      action(this.invoke('mapAppointmentFields', { itemData, itemElement }));
    }
    delete this._currentAppointmentSettings;
  }

  _itemClickHandler(e: DxEvent): void {
    super._itemClickHandler(e, {}, {
      afterExecute: function (actionInfo): void {
        this._processItemClick(actionInfo.args[0].event);
      }.bind(this),
    });
  }

  _processItemClick(e: DxEvent): void {
    const $target = $(e.currentTarget);
    const data = this._getItemData($target);

    if ($target.is('.dx-scheduler-appointment-collector')) {
      return;
    }

    // @ts-expect-error a keydown event returns before isFakeClickEvent reads the mouse fields
    if (e.type === 'keydown' || isFakeClickEvent(e)) {
      this.notifyObserver('showEditAppointmentPopup', { data, target: $target });
      return;
    }

    this._appointmentClickTimeout = setTimeout(() => {
      if (!this._preventSingleAppointmentClick && isElementInDom($target)) {
        this.notifyObserver('showAppointmentTooltip', { data, target: $target });
      }

      this._preventSingleAppointmentClick = false;
    }, 300);
  }

  // @ts-expect-error the scheduler maps the item info to the appointment event fields
  _extendActionArgs($itemElement: dxElementWrapper): ReturnType<SubscribeMethods['mapAppointmentFields']> {
    const args = super._extendActionArgs($itemElement);

    return this.invoke('mapAppointmentFields', args);
  }

  _render(): void {
    super._render();
    this._attachAppointmentDblClick();
  }

  _attachAppointmentDblClick(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const itemSelector = that._itemSelector();
    const itemContainer = this._itemContainer();

    eventsEngine.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);
    eventsEngine.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, (e) => {
      that._itemDXEventHandler(e, 'onAppointmentDblClick', {}, {
        afterExecute(actionInfo): void {
          // @ts-expect-error args holds the arguments of the dblclick action
          that._dblClickHandler(actionInfo.args[0].event);
        },
      });
    });
  }

  _dblClickHandler(e: DxEvent): void {
    const $targetAppointment = $(e.currentTarget);
    const appointmentData = this._getItemData($targetAppointment);

    clearTimeout(this._appointmentClickTimeout);
    this._preventSingleAppointmentClick = true;
    this.notifyObserver('showEditAppointmentPopup', { data: appointmentData, target: $targetAppointment });
  }

  _renderItem(
    index: number,
    item: AppointmentViewModelPlain,
    container: dxElementWrapper,
  ): dxElementWrapper {
    if ('items' in item) {
      return this.renderDropDownAppointment(container, item);
    }

    this._currentAppointmentSettings = item;
    const $item = super._renderItem(index, item.itemData, container);

    $item.data(APPOINTMENT_SETTINGS_KEY, item);

    if (item.sortedIndex !== -1) {
      this.$itemBySortedIndex[item.sortedIndex] = $item;
    }

    return $item;
  }

  _getItemContent($itemFrame: dxElementWrapper): dxElementWrapper {
    $itemFrame.data(APPOINTMENT_SETTINGS_KEY, this._currentAppointmentSettings);
    const $itemContent = super._getItemContent($itemFrame);
    return $itemContent;
  }

  _createItemByTemplate(
    itemTemplate: TemplateBase,
    renderArgs: ItemRenderInfo<SafeAppointment>,
  ): dxElementWrapper {
    const { itemData, container, index } = renderArgs;
    const parent = $(container).parent();

    parent.prepend(
      $('<span>')
        .addClass(APPOINTMENT_CONTENT_CLASSES.ARIA_DESCRIPTION)
        .attr('hidden', true),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemTemplate.render({
      model: {
        appointmentData: itemData,
        targetedAppointmentData: this.invoke('getTargetedAppointmentData', itemData, parent),
      },
      container,
      index,
    });
  }

  _getAppointmentContainer(allDay: boolean): dxElementWrapper {
    const $allDayContainer = this.option('allDayContainer');
    // @ts-expect-error not() also takes an element, the d.ts declares a selector only
    const $container = this.itemsContainer().not($allDayContainer);

    return allDay && $allDayContainer ? $allDayContainer : $container;
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<SafeAppointment>): void {
    this.renderAppointment(
      args.itemElement,
      this._currentAppointmentSettings as AppointmentAgendaViewModel | AppointmentItemViewModel,
    );
  }

  renderAppointment(
    element: dxElementWrapper,
    settings: AppointmentAgendaViewModel | AppointmentItemViewModel,
  ): void {
    element.data(APPOINTMENT_SETTINGS_KEY, settings);
    this._applyResourceDataAttr(element);

    if (this.isAgendaView) {
      this.renderAgendaAppointment(element, settings as AppointmentAgendaViewModel);
      return;
    }

    this.renderGeneralAppointment(element, settings as AppointmentItemViewModel);
  }

  renderAgendaAppointment(
    element: dxElementWrapper,
    settings: AppointmentAgendaViewModel,
  ): void {
    if (settings.isLastInGroup) {
      element.addClass(AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS);
    }

    const { groups, groupsLeafs, resourceById } = this.getResourceManager();
    const config: Partial<AppointmentProperties> = {
      data: settings.itemData,
      groupIndex: settings.groupIndex,
      groupTexts: getGroupTexts(groups, groupsLeafs, resourceById, settings.groupIndex),
      notifyScheduler: this.option('notifyScheduler'),
      geometry: settings,
      allowResize: false,
      allowDrag: false,
      groups: this.option('groups'),

      dataAccessors: this.option('dataAccessors'),
      timeZoneCalculator: this.option('timeZoneCalculator'),
      getResourceManager: this.option('getResourceManager'),
    };

    this._createComponent(element, AgendaAppointment, config);
  }

  renderGeneralAppointment(
    element: dxElementWrapper,
    settings: AppointmentItemViewModel,
  ): void {
    const allowResize = this.option('allowResize') && !settings.skipResizing;
    const allowDrag = this.option('allowDrag');
    const allowDelete = this.option('allowDelete');
    const { allDay } = settings;
    const { groups, groupsLeafs, resourceById } = this.getResourceManager();
    const isGroupByDate = this.option('groupByDate');
    const config: Partial<AppointmentProperties> = {
      data: settings.itemData,
      groupIndex: settings.groupIndex,
      groupTexts: getGroupTexts(groups, groupsLeafs, resourceById, settings.groupIndex),
      notifyScheduler: this.option('notifyScheduler'),
      geometry: settings,
      direction: settings.direction || 'vertical',
      allowResize,
      allowDrag,
      allowDelete,
      allDay,
      reduced: settings.reduced,
      hideReducedIcon: isGroupByDate,
      startDate: new Date(settings.info?.appointment.startDate),
      cellWidth: this.invoke('getCellWidth'),
      cellHeight: this.invoke('getCellHeight'),
      resizableConfig: this._resizableConfig(settings.itemData, settings),
      groups: this.option('groups'),
      partIndex: settings.partIndex,
      partTotalCount: settings.partTotalCount,

      dataAccessors: this.option('dataAccessors'),
      timeZoneCalculator: this.option('timeZoneCalculator'),
      getResizableStep: this.option('getResizableStep'),
      getResourceManager: this.option('getResourceManager'),
    };

    this._createComponent(element, Appointment, config);
  }

  _applyResourceDataAttr($appointment: dxElementWrapper): void {
    const { resources } = this.getResourceManager();
    const rawAppointment = this._getItemData($appointment);
    const appointmentGroups = getAppointmentGroupValues(rawAppointment, resources);

    Object.entries(appointmentGroups).forEach(([resourceIndex, resourceIds]) => {
      if (resourceIds.length) {
        const prefix = `data-${normalizeKey(resourceIndex.toLowerCase())}-`;

        resourceIds.forEach((value) => $appointment.attr(prefix + normalizeKey(value), true));
      }
    });
  }

  _resizableConfig(
    appointmentData: SafeAppointment,
    itemSetting: AppointmentItemViewModel,
  ): AppointmentResizableConfig {
    return {
      area: this._calculateResizableArea(itemSetting, appointmentData),
      onResizeStart: (e): void => {
        const $appointment = $(e.element);

        this._isResizing = true;
        this._kbn.focus($appointment);

        if (this.invoke('needRecalculateResizableArea')) {
          const updatedArea = this._calculateResizableArea(
            this.getAppointmentSettings($appointment),
            $appointment.data('dxItemData'),
          );

          e.component.option('area', updatedArea);
          // @ts-expect-error the resize start action passes the original drag event
          e.component._renderDragOffsets(e.event);
        }

        this._initialSize = { width: e.width, height: e.height };
        this._initialCoordinates = locate($appointment);
      },
      onResizeEnd: (e): void => {
        this._isResizing = false;
        this._resizeEndHandler(e);
      },
    };
  }

  _calculateResizableArea(
    itemSetting: { left?: number; groupIndex?: number; allDay?: boolean },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    appointmentData: unknown,
  ): ResizableArea {
    const area = this.$element().closest('.dx-scrollable-content');

    return this.invoke('getResizableAppointmentArea', {
      coordinates: {
        left: itemSetting.left,
        top: 0,
        groupIndex: itemSetting.groupIndex,
      },
      allDay: itemSetting.allDay,
    }) || area;
  }

  _resizeEndHandler(e: AppointmentResizeEvent): void {
    const $element = $(e.element);

    const { allDay, info } = $element
      .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentItemViewModel;
    const sourceAppointment = this._getItemData($element);
    const viewOffset = this.invoke('getViewOffsetMs');
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dateRange: { startDate: Date; endDate: Date };

    if (allDay) {
      dateRange = this.resizeAllDay(e);
    } else {
      const startDate = this._getEndResizeAppointmentStartDate(
        e,
        sourceAppointment,
        info.appointment,
      );
      const { endDate } = info.appointment;
      const shiftedStartDate = dateUtilsTs.addOffsets(startDate, -viewOffset);
      const shiftedEndDate = dateUtilsTs.addOffsets(endDate, -viewOffset);

      dateRange = this.getDateRange(e, shiftedStartDate, shiftedEndDate);
      dateRange.startDate = dateUtilsTs.addOffsets(dateRange.startDate, viewOffset);
      dateRange.endDate = dateUtilsTs.addOffsets(dateRange.endDate, viewOffset);
    }

    this.updateResizedAppointment(
      $element,
      dateRange,
      this.dataAccessors,
      this.option('timeZoneCalculator'),
    );
  }

  resizeAllDay(e: AppointmentResizeEvent): DateRange {
    const $element = $(e.element);
    const timeZoneCalculator = this.option('timeZoneCalculator');

    return getAppointmentDateRange({
      handles: e.handles,
      appointmentSettings: $element
        .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentItemViewModel,
      isVerticalGroupedWorkSpace: this.option('isVerticalGroupedWorkSpace')(),
      appointmentRect: getBoundingRect($element[0]),
      parentAppointmentRect: getBoundingRect($element.parent()[0]),
      // @ts-expect-error the work space exists while an appointment is resized
      viewDataProvider: this.option('getViewDataProvider')(),
      isDateAndTimeView: this.option('isDateAndTimeView')(),
      startDayHour: this.invoke('getStartDayHour'),
      endDayHour: this.invoke('getEndDayHour'),
      timeZoneCalculator,
      dataAccessors: this.dataAccessors,
      rtlEnabled: this.option('rtlEnabled'),
      // @ts-expect-error the work space exists while an appointment is resized
      DOMMetaData: this.option('getDOMElementsMetaData')(),
      viewOffset: this.invoke('getViewOffsetMs'),
    });
  }

  updateResizedAppointment(
    $element: dxElementWrapper,
    dateRange: { startDate: Date; endDate: Date },
    dataAccessors: AppointmentDataAccessor,
    timeZoneCalculator: TimeZoneCalculator,
  ): void {
    const sourceAppointment = this._getItemData($element);
    const gridAdapter = new AppointmentAdapter(
      sourceAppointment,
      dataAccessors,
    ).clone();

    gridAdapter.startDate = new Date(dateRange.startDate);
    gridAdapter.endDate = new Date(dateRange.endDate);

    /*
     * T1255474. `dateRange` has dates with 00:00 local time.
     * If we transform dates fromGrid and back through DST then we'll lose one hour.
     * TODO(1): refactor computation around DST globally
     */
    const convertedBackAdapter = gridAdapter
      .clone()
      .calculateDates(timeZoneCalculator, 'fromGrid')
      .calculateDates(timeZoneCalculator, 'toGrid');

    const startDateDelta = gridAdapter.startDate.getTime()
      - convertedBackAdapter.startDate.getTime();
    const endDateDelta = gridAdapter.endDate.getTime() - convertedBackAdapter.endDate.getTime();

    gridAdapter.startDate = dateUtilsTs.addOffsets(gridAdapter.startDate, startDateDelta);
    gridAdapter.endDate = dateUtilsTs.addOffsets(gridAdapter.endDate, endDateDelta);

    const data = gridAdapter
      .calculateDates(timeZoneCalculator, 'fromGrid')
      .source;

    this.notifyObserver('updateAppointmentAfterResize', {
      target: sourceAppointment,
      data,
      $appointment: $element,
    });
  }

  _getEndResizeAppointmentStartDate(
    e: AppointmentResizeEvent,
    rawAppointment: SafeAppointment,
    appointmentInfo: AppointmentItemViewModel['info']['appointment'],
  ): Date {
    const timeZoneCalculator = this.option('timeZoneCalculator');
    const appointmentAdapter = new AppointmentAdapter(
      rawAppointment,
      this.dataAccessors,
    );

    let { startDate } = appointmentInfo;
    const { startDateTimeZone, isRecurrent } = appointmentAdapter;
    const isAllDay = this.invoke('isAllDay', rawAppointment);

    if (!e.handles.top && !isRecurrent && !isAllDay) {
      startDate = timeZoneCalculator.createDate(
        appointmentAdapter.startDate,
        'toGrid',
        startDateTimeZone,
      );
    }

    return startDate;
  }

  private getDateRange(
    e: AppointmentResizeEvent,
    startDate: Date,
    endDate: Date,
  ): { startDate: Date; endDate: Date } {
    const itemData = this._getItemData(e.element);
    const deltaTime = this.invoke('getDeltaTime', e, this._initialSize, itemData);
    const renderingStrategyDirection = this.invoke('getRenderingStrategyDirection');
    let isStartDateChanged = false;
    const isAllDay = this.invoke('isAllDay', itemData);
    const needCorrectDates = this.invoke('needCorrectAppointmentDates') && !isAllDay;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let startTime: number;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let endTime: number;

    if (renderingStrategyDirection !== 'vertical' || isAllDay) {
      isStartDateChanged = this.option('rtlEnabled') ? e.handles.right : e.handles.left;
    } else {
      isStartDateChanged = e.handles.top;
    }

    if (isStartDateChanged) {
      startTime = needCorrectDates
        ? this._correctStartDateByDelta(startDate, deltaTime)
        : startDate.getTime() - deltaTime;
      startTime += timeZoneUtils
        .getTimezoneOffsetChangeInMs(startDate, endDate, startTime, endDate);
      endTime = endDate.getTime();
    } else {
      startTime = startDate.getTime();
      endTime = needCorrectDates
        ? this._correctEndDateByDelta(endDate, deltaTime)
        : endDate.getTime() + deltaTime;
      endTime -= timeZoneUtils.getTimezoneOffsetChangeInMs(startDate, endDate, startDate, endTime);
    }

    return {
      startDate: new Date(startTime),
      endDate: new Date(endTime),
    };
  }

  _correctEndDateByDelta(endDate: Date, deltaTime: number): number {
    const endDayHour = this.invoke('getEndDayHour');
    const startDayHour = this.invoke('getStartDayHour');

    const maxDate = new Date(endDate);
    const minDate = new Date(endDate);
    const correctEndDate = new Date(endDate);

    minDate.setHours(startDayHour, 0, 0, 0);
    maxDate.setHours(endDayHour, 0, 0, 0);

    if (correctEndDate > maxDate) {
      correctEndDate.setHours(endDayHour, 0, 0, 0);
    }

    let result = correctEndDate.getTime() + deltaTime;
    const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

    const daysCount = deltaTime > 0
      ? Math.ceil(deltaTime / visibleDayDuration)
      : Math.floor(deltaTime / visibleDayDuration);

    if (result > maxDate.getTime() || result <= minDate.getTime()) {
      const tailOfCurrentDay = maxDate.getTime() - correctEndDate.getTime();
      const tailOfPrevDays = deltaTime - tailOfCurrentDay;
      const correctedEndDate = new Date(correctEndDate)
        .setDate(correctEndDate.getDate() + daysCount);
      const lastDay = new Date(correctedEndDate);
      lastDay.setHours(startDayHour, 0, 0, 0);

      result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
    }
    return result;
  }

  _correctStartDateByDelta(startDate: Date, deltaTime: number): number {
    const endDayHour = this.invoke('getEndDayHour');
    const startDayHour = this.invoke('getStartDayHour');

    const maxDate = new Date(startDate);
    const minDate = new Date(startDate);
    const correctStartDate = new Date(startDate);

    minDate.setHours(startDayHour, 0, 0, 0);
    maxDate.setHours(endDayHour, 0, 0, 0);

    if (correctStartDate < minDate) {
      correctStartDate.setHours(startDayHour, 0, 0, 0);
    }

    let result = correctStartDate.getTime() - deltaTime;

    const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

    const daysCount = deltaTime > 0
      ? Math.ceil(deltaTime / visibleDayDuration)
      : Math.floor(deltaTime / visibleDayDuration);

    if (result < minDate.getTime() || result >= maxDate.getTime()) {
      const tailOfCurrentDay = correctStartDate.getTime() - minDate.getTime();
      const tailOfPrevDays = deltaTime - tailOfCurrentDay;

      const firstDay = new Date(correctStartDate.setDate(correctStartDate.getDate() - daysCount));
      firstDay.setHours(endDayHour, 0, 0, 0);

      result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
    }
    return result;
  }

  protected renderDropDownAppointments(): void {
    this._renderByFragments(($commonFragment, $allDayFragment) => {
      const items: AppointmentViewModelPlain[] = this.option('items') || [];
      items.forEach((item) => {
        if ('items' in item) {
          const $fragment = item.allDay ? $allDayFragment : $commonFragment;
          this.renderDropDownAppointment($fragment, item);
        }
      });
    });
  }

  protected renderDropDownAppointment(
    $fragment: dxElementWrapper,
    appointment: AppointmentCollectorViewModel,
  ): dxElementWrapper {
    const compactAppointmentItems = this.getCompactAppointmentItems(appointment);

    const $item = this.invoke('renderCompactAppointments', {
      $container: $fragment,
      coordinates: {
        top: appointment.top,
        left: appointment.left,
      },
      items: compactAppointmentItems,
      buttonColor: compactAppointmentItems[0].color,
      sortedIndex: appointment.sortedIndex,
      width: appointment.width,
      height: appointment.height,
      // @ts-expect-error onItemClick holds the scheduler onAppointmentClick action
      onAppointmentClick: this.option('onItemClick'),
      allowDrag: this.option('allowDrag'),
      isCompact: appointment.isCompact,
    });
    this.$itemBySortedIndex[appointment.sortedIndex] = $item;

    return $item;
  }

  private getCompactAppointmentItems(
    appointment: AppointmentCollectorViewModel,
  ): CompactAppointmentOptions['items'] {
    const resourceManager = this.getResourceManager();

    const result = appointment.items.map((item) => {
      const appointmentConfig = {
        itemData: item.itemData,
        groupIndex: appointment.groupIndex,
      };

      return {
        appointment: item.itemData,
        targetedAppointment: getTargetedAppointment(
          item.itemData,
          item,
          this.dataAccessors,
          resourceManager,
        ),
        color: resourceManager.getAppointmentColor(appointmentConfig),
        settings: item,
      };
    });

    return result;
  }

  moveAppointmentBack(
    dragEvent?: { cancel?: boolean | PromiseLike<boolean> | DeferredObj<boolean> } | null,
  ): void {
    const $appointment = this._kbn.$focusTarget();
    const size = this._initialSize;
    const coords = this._initialCoordinates;

    this._isResizing = false;

    if (dragEvent) {
      this._removeDragSourceClassFromDraggedAppointment();

      if (isDeferred(dragEvent.cancel)) {
        // @ts-expect-error isDeferred() is not declared as a type guard
        dragEvent.cancel.resolve(true);
      } else {
        dragEvent.cancel = true;
      }
    }

    if ($appointment.get(0) && !dragEvent) {
      if (coords) {
        move($appointment, coords);
        delete this._initialSize;
      }
      if (size) {
        setOuterWidth($appointment, size.width);
        setOuterHeight($appointment, size.height);
        delete this._initialCoordinates;
      }
    }
  }

  focus(): void {
    this._kbn.focus();
  }

  _removeDragSourceClassFromDraggedAppointment(): void {
    const $appointments = this._itemElements().filter(`.${APPOINTMENT_DRAG_SOURCE_CLASS}`);

    // @ts-expect-error the each() callback may return nothing, the d.ts requires a boolean
    $appointments.each((_, element) => {
      // @ts-expect-error dxSchedulerAppointment is a jQuery plugin method
      const appointmentInstance = $(element).dxSchedulerAppointment('instance');

      appointmentInstance.option('isDragSource', false);
    });
  }

  _setDragSourceAppointment(appointment: unknown, settings: AppointmentViewModelPlain): void {
    const $appointments = this._findItemElementByItem(appointment);
    const { startDate, endDate } = (settings as AppointmentItemViewModel).info.sourceAppointment;
    const { groupIndex } = settings;

    $appointments.forEach(($item) => {
      const {
        info: itemInfo,
        groupIndex: itemGroupIndex,
      } = $item.data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentItemViewModel;

      const {
        startDate: itemStartDate,
        endDate: itemEndDate,
      } = itemInfo.sourceAppointment;

      // @ts-expect-error dxSchedulerAppointment is a jQuery plugin method
      const appointmentInstance = $item.dxSchedulerAppointment('instance');
      const isDragSource = startDate.getTime() === itemStartDate.getTime()
                && endDate.getTime() === itemEndDate.getTime()
                && groupIndex === itemGroupIndex;

      appointmentInstance.option('isDragSource', isDragSource);
    });
  }

  updateResizableArea(): void {
    const $allResizableElements = this.$element().find('.dx-scheduler-appointment.dx-resizable');

    const horizontalResizables = grep($allResizableElements, (el: Element): boolean => {
      const $el = $(el);
      // @ts-expect-error dxResizable is a jQuery plugin method
      const resizableInst = $el.dxResizable('instance');
      const { area, handles } = resizableInst.option();

      return (handles === 'right left' || handles === 'left right') && isPlainObject(area);
    });

    each(horizontalResizables, (_, el: Element): void => {
      const $el = $(el);
      const position = locate($el);
      const appointmentData = this._getItemData($el);

      const area = this._calculateResizableArea({
        left: position.left,
      }, appointmentData);

      // @ts-expect-error dxResizable is a jQuery plugin method
      $el.dxResizable('instance').option('area', area);
    });
  }
}

registerComponent('dxSchedulerAppointments', SchedulerAppointments);

export default SchedulerAppointments;
