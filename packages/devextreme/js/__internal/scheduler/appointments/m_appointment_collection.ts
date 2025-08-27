/* eslint-disable spellcheck/spell-checker */
import { locate, move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dblclickEvent } from '@js/common/core/events/double_click';
import { addNamespace, isFakeClickEvent } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error
import { grep, normalizeKey } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import { getBoundingRect } from '@js/core/utils/position';
import { setOuterHeight, setOuterWidth } from '@js/core/utils/size';
import {
  isDeferred, isDefined, isPlainObject, isString,
} from '@js/core/utils/type';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import { dateUtilsTs } from '@ts/core/utils/date';

import { APPOINTMENT_SETTINGS_KEY } from '../constants';
import {
  AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS,
  APPOINTMENT_CONTENT_CLASSES,
  APPOINTMENT_DRAG_SOURCE_CLASS,
  APPOINTMENT_ITEM_CLASS,
} from '../m_classes';
import { getRecurrenceProcessor } from '../m_recurrence';
import timeZoneUtils from '../m_utils_time_zone';
import type { CompactAppointmentOptions } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import {
  getTargetedAppointment,
  getTargetedAppointmentFromInfo,
} from '../utils/get_targeted_appointment';
import { getAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import { getGroupTexts } from '../utils/resource_manager/group_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type {
  AppointmentAgendaViewModel,
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/generate_view_model/types';
import { AgendaAppointment } from './appointment/agenda_appointment';
import { Appointment } from './appointment/m_appointment';
import { createAgendaAppointmentLayout, createAppointmentLayout } from './m_appointment_layout';
import { getAppointmentDateRange } from './resizing/m_core';
import { countVisibleAppointments } from './utils/count_visible_appointments';
import { isNeedToAdd } from './utils/get_arrays_diff';
import { getViewModelDiff } from './utils/get_view_model_diff';
import { getAppointmentTakesSeveralDays, sortAppointmentsByStartDate } from './utils/m_utils';
import { getNextElement, getPrevElement } from './utils/sorted_index_utils';

const COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';

const DBLCLICK_EVENT_NAME = addNamespace(dblclickEvent, 'dxSchedulerAppointment');

const toMs = dateUtils.dateToMilliseconds;

interface ViewModelDiff {
  item: AppointmentViewModelPlain;
  element?: dxElementWrapper;
  needToAdd?: true;
  needToRemove?: true;
}

// @ts-expect-error
class SchedulerAppointments extends CollectionWidget {
  // NOTE: The key of this array is `sortedIndex` of appointment rendered in Element
  renderedElementsBySortedIndex: dxElementWrapper[] = [];

  _appointmentClickTimeout: any;

  _$currentAppointment: any;

  _currentAppointmentSettings?: AppointmentViewModelPlain;

  _preventSingleAppointmentClick: any;

  _initialSize: any;

  _initialCoordinates: any;

  get isAgendaView() {
    return this.invoke('isCurrentViewAgenda');
  }

  get isVirtualScrolling() {
    return this.invoke('isVirtualScrolling');
  }

  get appointmentDataSource() {
    return this.option('getAppointmentDataSource')();
  }

  get dataAccessors(): AppointmentDataAccessor {
    return this.option('dataAccessors') as AppointmentDataAccessor;
  }

  get appointmentsCount(): number {
    return countVisibleAppointments(this.option('items') ?? []);
  }

  getResourceManager(): ResourceManager {
    return this.option('getResourceManager')();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  option(optionName?: string, value?: any) {
    return super.option(...arguments);
  }

  notifyObserver(subject, args) {
    const notifyScheduler: any = this.option('notifyScheduler');
    if (notifyScheduler) {
      notifyScheduler.invoke(subject, args);
    }
  }

  invoke(funcName: string, ...args) {
    const notifyScheduler: any = this.option('notifyScheduler');

    if (notifyScheduler) {
      return notifyScheduler.invoke(funcName, ...args);
    }
  }

  _dispose() {
    clearTimeout(this._appointmentClickTimeout);

    super._dispose();
  }

  _supportedKeys() {
    const parent = super._supportedKeys();

    const tabHandler = function (e) {
      const navigatableItems = this._getNavigatableItems();
      const focusedItem = navigatableItems.filter('.dx-state-focused');
      let index = focusedItem.data(APPOINTMENT_SETTINGS_KEY).sortedIndex;
      let $nextAppointment = e.shiftKey
        ? getPrevElement(index, this.renderedElementsBySortedIndex)
        : getNextElement(index, this.renderedElementsBySortedIndex);
      const lastIndex = navigatableItems.length - 1;

      if ($nextAppointment || (index > 0 && e.shiftKey) || (index < lastIndex && !e.shiftKey)) {
        e.preventDefault();

        if (!$nextAppointment) {
          e.shiftKey ? index-- : index++;
          $nextAppointment = this._getNavigatableItemByIndex(index);
        }

        this._resetTabIndex($nextAppointment);
        // @ts-expect-error
        eventsEngine.trigger($nextAppointment, 'focus');
      }
    };

    const currentAppointment = this._$currentAppointment;

    return extend(parent, {
      escape: function () {
        if (this.resizeOccur) {
          this.moveAppointmentBack();
          this.resizeOccur = false;
          currentAppointment.dxResizable('instance')?._detachEventHandlers();
          currentAppointment.dxResizable('instance')?._attachEventHandlers();
          currentAppointment.dxResizable('instance')?._toggleResizingClass(false);
        }
      }.bind(this),
      del: function (e) {
        if (this.option('allowDelete')) {
          e.preventDefault();
          const data = this._getItemData(e.target);
          this.notifyObserver('onDeleteButtonPress', { data, target: e.target });
        }
      }.bind(this),
      tab: tabHandler,
    });
  }

  private _getNavigatableItemByIndex(sortedIndex) {
    const appointments = this._getNavigatableItems();
    return appointments.filter(
      // @ts-expect-error
      (_, $item) => elementData($item, APPOINTMENT_SETTINGS_KEY).sortedIndex === sortedIndex,
    ).eq(0);
  }

  private _getNavigatableItems(): dxElementWrapper {
    // @ts-expect-error
    const appts = this._itemElements().not('.dx-state-disabled');
    // @ts-expect-error
    const apptCollectors = this.$element().find('.dx-scheduler-appointment-collector');
    return appts.add(apptCollectors);
  }

  _resetTabIndex($appointment) {
    this._focusTarget().attr('tabIndex', -1);
    $appointment.attr('tabIndex', this.option('tabIndex'));
  }

  _moveFocus() {}

  _focusTarget() {
    return this._getNavigatableItems();
  }

  _renderFocusTarget() {
    const $appointment = this._getNavigatableItemByIndex(0);

    this._resetTabIndex($appointment);
  }

  _focusInHandler(e) {
    super._focusInHandler(e);
    this._$currentAppointment = $(e.target);
    this.option('focusedElement', getPublicElement($(e.target)));
  }

  _focusOutHandler(e) {
    const $appointment = this._getNavigatableItemByIndex(0);
    this.option('focusedElement', getPublicElement($appointment));
    super._focusOutHandler(e);
  }

  _eventBindingTarget() {
    return this._itemContainer();
  }

  _getDefaultOptions() {
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
      resources: [],
    });
  }

  protected getItemsDiff(
    previousValue: AppointmentViewModelPlain[] = [],
    value: AppointmentViewModelPlain[] = [],
  ): ViewModelDiff[] {
    const elementsInRenderOrder = previousValue
      .map(({ sortedIndex }) => this.renderedElementsBySortedIndex[sortedIndex]);
    const diff = getViewModelDiff(previousValue, value, this.appointmentDataSource);
    diff
      .filter((item) => !isNeedToAdd(item))
      .forEach((item, index) => {
        (item as ViewModelDiff).element = elementsInRenderOrder[index];
      });

    return diff;
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'items':
        (this as any)._cleanFocusState();

        if (this.isAgendaView) {
          this.forceRepaintAllAppointments(args.value || []);
        } else {
          const diff = this.getItemsDiff(args.previousValue, args.value);
          this.repaintAppointments(diff);
        }

        this._attachAppointmentsEvents();
        break;
      case 'fixedContainer':
      case 'allDayContainer':
      case 'onAppointmentDblClick':
        break;
      case 'allowDrag':
      case 'allowResize':
      case 'allowAllDayResize':
        (this as any)._cleanFocusState();
        this.forceRepaintAllAppointments(this.option('items') || []);
        this._attachAppointmentsEvents();
        break;
      case 'focusedElement':
        this._resetTabIndex($(args.value));
        super._optionChanged(args);
        break;
      case 'allowDelete':
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
    this.renderedElementsBySortedIndex = [];
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
    this.renderedElementsBySortedIndex = [];
    this._renderByFragments(($commonFragment, $allDayFragment) => {
      const isRepaintAll = this.isAgendaView
        || !diff.some((item) => item.needToAdd === undefined && item.needToRemove === undefined);

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
          item.element?.detach();
          item.element?.remove();
          return;
        }

        if (item.needToAdd) {
          const container = item.item.allDay
            ? $allDayFragment
            : $commonFragment;
          this._renderItem(index, item.item, container);
          return;
        }

        if (item.element) {
          item.element.data(APPOINTMENT_SETTINGS_KEY, item.item);
          this.renderedElementsBySortedIndex[item.item.sortedIndex] = item.element;
        }
      });
    });
  }

  _renderByFragments(renderFunction: (
    $commonFragment: dxElementWrapper,
    $allDayFragment: dxElementWrapper,
  ) => void): void {
    if (this.isVirtualScrolling) {
      const $commonFragment = $(domAdapter.createDocumentFragment() as any);
      const $allDayFragment = $(domAdapter.createDocumentFragment() as any);

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

  _refreshActiveDescendant() {
    // override to do nothing
  }

  _attachAppointmentsEvents() {
    (this as any)._attachClickEvent();
    (this as any)._attachHoldEvent();
    (this as any)._attachContextMenuEvent();
    (this as any)._attachAppointmentDblClick();

    (this as any)._renderFocusState();
    (this as any)._attachFeedbackEvents();
    (this as any)._attachHoverEvents();
  }

  _clearDropDownItemsElements() {
    this.invoke('clearCompactAppointments');
  }

  _findItemElementByItem(item) {
    const result: any = [];
    const that: any = this;

    (this as any).itemElements().each(function () {
      const $item = $(this);
      if ($item.data(that._itemDataKey()) === item) {
        result.push($item);
      }
    });

    return result;
  }

  _itemClass() {
    return APPOINTMENT_ITEM_CLASS;
  }

  _itemContainer() {
    const $container = super._itemContainer();
    let $result = $container;
    const $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $result = $container.add($allDayContainer);
    }

    return $result;
  }

  _cleanItemContainer() {
    super._cleanItemContainer();
    const $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $allDayContainer.empty();
    }
  }

  _clean() {
    super._clean();
    delete this._$currentAppointment;
    delete this._initialSize;
    delete this._initialCoordinates;
  }

  _init() {
    super._init();
    (this as any).$element().addClass(COMPONENT_CLASS);
    this._preventSingleAppointmentClick = false;
  }

  _renderAppointmentTemplate($container, appointment, model) {
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
      );
    }

    const formatText = this.invoke(
      'createFormattedDateText',
      appointment,
      targetedAppointmentData,
      'TIME',
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

  _executeItemRenderAction(index, itemData, itemElement) {
    const action = (this as any)._getItemRenderAction();
    if (action) {
      action(this.invoke('mapAppointmentFields', { itemData, itemElement }));
    }
    delete this._currentAppointmentSettings;
  }

  _itemClickHandler(e) {
    super._itemClickHandler(e, {}, {
      afterExecute: function (e) {
        this._processItemClick(e.args[0].event);
      }.bind(this),
    });
  }

  _processItemClick(e) {
    const $target = $(e.currentTarget);
    const data = (this as any)._getItemData($target);

    if ($target.is('.dx-scheduler-appointment-collector')) {
      return;
    }

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

  _extendActionArgs($itemElement) {
    const args = super._extendActionArgs($itemElement);

    return this.invoke('mapAppointmentFields', args);
  }

  _render() {
    super._render();
    this._attachAppointmentDblClick();
  }

  _attachAppointmentDblClick() {
    const that: any = this;
    const itemSelector = that._itemSelector();
    const itemContainer = this._itemContainer();

    eventsEngine.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);
    eventsEngine.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, (e) => {
      that._itemDXEventHandler(e, 'onAppointmentDblClick', {}, {
        afterExecute(e) {
          that._dblClickHandler(e.args[0].event);
        },
      });
    });
  }

  _dblClickHandler(e) {
    const $targetAppointment = $(e.currentTarget);
    const appointmentData = (this as any)._getItemData($targetAppointment);

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
      // NOTE: fallback for integration testing
      if (!this.renderedElementsBySortedIndex) {
        this.renderedElementsBySortedIndex = [];
      }
      this.renderedElementsBySortedIndex[item.sortedIndex] = $item;
    }

    return $item;
  }

  _getItemContent($itemFrame) {
    $itemFrame.data(APPOINTMENT_SETTINGS_KEY, this._currentAppointmentSettings);
    const $itemContent = super._getItemContent($itemFrame);
    return $itemContent;
  }

  _createItemByTemplate(itemTemplate, renderArgs) {
    const { itemData, container, index } = renderArgs;
    const parent = $(container).parent();

    parent.prepend(
      $('<span>')
        .addClass(APPOINTMENT_CONTENT_CLASSES.ARIA_DESCRIPTION)
        .attr('hidden', true),
    );

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
    const $container = (this as any).itemsContainer().not($allDayContainer);

    return allDay && $allDayContainer ? $allDayContainer : $container;
  }

  _postprocessRenderItem(args) {
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
    const config: any = {
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

    (this as any)._createComponent(element, AgendaAppointment, config);
  }

  renderGeneralAppointment(
    element: dxElementWrapper,
    settings: AppointmentItemViewModel,
  ): void {
    const allowResize = this.option('allowResize') && (!isDefined(settings.skipResizing) || isString(settings.skipResizing));
    const allowDrag = this.option('allowDrag');
    const { allDay } = settings;
    const { groups, groupsLeafs, resourceById } = this.getResourceManager();
    const config: any = {
      data: settings.itemData,
      groupIndex: settings.groupIndex,
      groupTexts: getGroupTexts(groups, groupsLeafs, resourceById, settings.groupIndex),
      notifyScheduler: this.option('notifyScheduler'),
      geometry: settings,
      direction: settings.direction || 'vertical',
      allowResize,
      allowDrag,
      allDay,
      reduced: settings.reduced,
      isCompact: settings.isCompact,
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

    (this as any)._createComponent(element, Appointment, config);
  }

  _applyResourceDataAttr($appointment) {
    const { resources } = this.getResourceManager();
    const rawAppointment = (this as any)._getItemData($appointment);
    const appointmentGroups = getAppointmentGroupValues(rawAppointment, resources);

    Object.entries(appointmentGroups).forEach(([resourceIndex, resourceIds]) => {
      if (resourceIds.length) {
        const prefix = `data-${normalizeKey(resourceIndex.toLowerCase())}-`;

        resourceIds.forEach((value) => $appointment.attr(prefix + normalizeKey(value), true));
      }
    });
  }

  _resizableConfig(appointmentData, itemSetting) {
    return {
      area: this._calculateResizableArea(itemSetting, appointmentData),
      onResizeStart: function (e) {
        this.resizeOccur = true;
        this._$currentAppointment = $(e.element);

        if (this.invoke('needRecalculateResizableArea')) {
          const updatedArea = this._calculateResizableArea(this._$currentAppointment.data(APPOINTMENT_SETTINGS_KEY), this._$currentAppointment.data('dxItemData'));

          e.component.option('area', updatedArea);
          e.component._renderDragOffsets(e.event);
        }

        this._initialSize = { width: e.width, height: e.height };
        this._initialCoordinates = locate(this._$currentAppointment);
      }.bind(this),
      onResizeEnd: function (e) {
        this.resizeOccur = false;
        this._resizeEndHandler(e);
      }.bind(this),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _calculateResizableArea(itemSetting, appointmentData) {
    const area = (this as any).$element().closest('.dx-scrollable-content');

    return this.invoke('getResizableAppointmentArea', {
      coordinates: {
        left: itemSetting.left,
        top: 0,
        groupIndex: itemSetting.groupIndex,
      },
      allDay: itemSetting.allDay,
    }) || area;
  }

  _resizeEndHandler(e) {
    const $element = $(e.element);

    const { allDay, info } = $element.data(APPOINTMENT_SETTINGS_KEY) as any;
    const sourceAppointment = (this as any)._getItemData($element);
    const viewOffset = this.invoke('getViewOffsetMs');
    let dateRange: { startDate: Date; endDate: Date };

    if (allDay) {
      dateRange = this.resizeAllDay(e);
    } else {
      const startDate = this._getEndResizeAppointmentStartDate(e, sourceAppointment, info.appointment);
      const { endDate } = info.appointment;
      const shiftedStartDate = dateUtilsTs.addOffsets(startDate, -viewOffset);
      const shiftedEndDate = dateUtilsTs.addOffsets(endDate, -viewOffset);

      dateRange = this._getDateRange(e, shiftedStartDate, shiftedEndDate);
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

  resizeAllDay(e) {
    const $element = $(e.element);
    const timeZoneCalculator = this.option('timeZoneCalculator');

    return getAppointmentDateRange({
      handles: e.handles,
      appointmentSettings: $element.data(APPOINTMENT_SETTINGS_KEY) as any,
      isVerticalGroupedWorkSpace: this.option('isVerticalGroupedWorkSpace')(),
      appointmentRect: getBoundingRect($element[0]),
      parentAppointmentRect: getBoundingRect($element.parent()[0]),
      viewDataProvider: this.option('getViewDataProvider')(),
      isDateAndTimeView: this.option('isDateAndTimeView')(),
      startDayHour: this.invoke('getStartDayHour'),
      endDayHour: this.invoke('getEndDayHour'),
      timeZoneCalculator,
      dataAccessors: this.dataAccessors,
      rtlEnabled: this.option('rtlEnabled'),
      DOMMetaData: this.option('getDOMElementsMetaData')(),
      viewOffset: this.invoke('getViewOffsetMs'),
    });
  }

  updateResizedAppointment(
    $element,
    dateRange: { startDate: Date; endDate: Date },
    dataAccessors: AppointmentDataAccessor,
    timeZoneCalculator,
  ) {
    const sourceAppointment = (this as any)._getItemData($element);
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

    const startDateDelta = gridAdapter.startDate.getTime() - convertedBackAdapter.startDate.getTime();
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

  _getEndResizeAppointmentStartDate(e, rawAppointment, appointmentInfo) {
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

  _getDateRange(e, startDate, endDate) {
    const itemData = (this as any)._getItemData(e.element);
    const deltaTime = this.invoke('getDeltaTime', e, this._initialSize, itemData);
    const renderingStrategyDirection = this.invoke('getRenderingStrategyDirection');
    let isStartDateChanged = false;
    const isAllDay = this.invoke('isAllDay', itemData);
    const needCorrectDates = this.invoke('needCorrectAppointmentDates') && !isAllDay;
    let startTime;
    let endTime;

    if (renderingStrategyDirection !== 'vertical' || isAllDay) {
      isStartDateChanged = this.option('rtlEnabled') ? e.handles.right : e.handles.left;
    } else {
      isStartDateChanged = e.handles.top;
    }

    if (isStartDateChanged) {
      startTime = needCorrectDates
        ? this._correctStartDateByDelta(startDate, deltaTime)
        : startDate.getTime() - deltaTime;
      startTime += timeZoneUtils.getTimezoneOffsetChangeInMs(startDate, endDate, startTime, endDate);
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

  _correctEndDateByDelta(endDate, deltaTime) {
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
      const correctedEndDate = new Date(correctEndDate).setDate(correctEndDate.getDate() + daysCount);
      const lastDay = new Date(correctedEndDate);
      lastDay.setHours(startDayHour, 0, 0, 0);

      result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
    }
    return result;
  }

  _correctStartDateByDelta(startDate, deltaTime) {
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
    const virtualItems = appointment.items;
    const items: CompactAppointmentOptions['items'] = [];
    virtualItems.forEach((item) => {
      const appointmentConfig = {
        itemData: item.itemData,
        groupIndex: appointment.groupIndex,
        groups: this.option('groups'),
      };
      const resourceManager = this.getResourceManager();

      items.push({
        appointment: item.itemData,
        targetedAppointment: getTargetedAppointment(
          item.itemData,
          item,
          this.dataAccessors,
          this.option('timeZoneCalculator'),
          resourceManager,
        ),
        color: resourceManager.getAppointmentColor(appointmentConfig),
        settings: item,
      });
    });

    const $item = this.invoke('renderCompactAppointments', {
      $container: $fragment,
      coordinates: {
        top: appointment.top,
        left: appointment.left,
      },
      items,
      buttonColor: items[0].color,
      sortedIndex: appointment.sortedIndex,
      width: appointment.width,
      height: appointment.height,
      onAppointmentClick: this.option('onItemClick'),
      allowDrag: this.option('allowDrag'),
      isCompact: appointment.isCompact,
    });
    this.renderedElementsBySortedIndex[appointment.sortedIndex] = $item;

    return $item;
  }

  _sortAppointmentsByStartDate(appointments) {
    return sortAppointmentsByStartDate(appointments, this.dataAccessors);
  }

  _processRecurrenceAppointment(appointment, index, skipLongAppointments) {
    // NOTE: this method is actual only for agenda
    const recurrenceRule = this.dataAccessors.get('recurrenceRule', appointment);
    const result: any = {
      parts: [],
      indexes: [],
    };

    if (recurrenceRule) {
      const dates = appointment.settings || appointment;

      const startDate = this.dataAccessors.get('startDate', dates);
      const startDateTimeZone = this.dataAccessors.get('startDateTimeZone', appointment);
      const endDate = this.dataAccessors.get('endDate', dates);
      const appointmentDuration = endDate.getTime() - startDate.getTime();
      const recurrenceException = this.dataAccessors.get('recurrenceException', appointment);
      const startViewDate = this.invoke('getStartViewDate');
      const endViewDate = this.invoke('getEndViewDate');

      const timezoneCalculator = this.option('timeZoneCalculator');

      const recurrentDates = getRecurrenceProcessor().generateDates({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: startDate,
        end: endDate,
        min: startViewDate,
        max: endViewDate,
        appointmentTimezoneOffset: timezoneCalculator.getOriginStartDateOffsetInMs(
          startDate,
          startDateTimeZone,
          false,
        ),
      });
      const recurrentDateCount = appointment.settings ? 1 : recurrentDates.length;

      for (let i = 0; i < recurrentDateCount; i++) {
        const appointmentPart = extend({}, appointment, true);

        if (recurrentDates[i]) {
          const appointmentSettings = this._applyStartDateToObj(recurrentDates[i], {});
          this._applyEndDateToObj(new Date(recurrentDates[i].getTime() + appointmentDuration), appointmentSettings);
          appointmentPart.settings = appointmentSettings;
        } else {
          appointmentPart.settings = dates;
        }

        result.parts.push(appointmentPart);

        if (!skipLongAppointments) {
          this._processLongAppointment(appointmentPart, result);
        }
      }

      result.indexes.push(index);
    }

    return result;
  }

  _processLongAppointment(appointment, result) {
    const parts = this.splitAppointmentByDay(appointment);
    const partCount = parts.length;
    const endViewDate = this.invoke('getEndViewDate').getTime();
    const startViewDate = this.invoke('getStartViewDate').getTime();

    const timeZoneCalculator = this.option('timeZoneCalculator');

    result = result || {
      parts: [],
    };

    if (partCount > 1) {
      extend(appointment, parts[0]);

      for (let i = 1; i < partCount; i++) {
        let startDate = this.dataAccessors.get('startDate', parts[i].settings);
        startDate = timeZoneCalculator.createDate(startDate.getTime(), 'toGrid');

        if (startDate < endViewDate && startDate > startViewDate) {
          result.parts.push(parts[i]);
        }
      }
    }

    return result;
  }

  _reduceRecurrenceAppointments(recurrenceIndexes, appointments) {
    each(recurrenceIndexes, (i: number, index: number) => {
      appointments.splice(index - i, 1);
    });
  }

  _combineAppointments(appointments, additionalAppointments) {
    if (additionalAppointments.length) {
      appointments.push(...additionalAppointments);
    }
    this._sortAppointmentsByStartDate(appointments);
  }

  _applyStartDateToObj(startDate, obj) {
    this.dataAccessors.set('startDate', obj, startDate);
    return obj;
  }

  _applyEndDateToObj(endDate, obj) {
    this.dataAccessors.set('endDate', obj, endDate);
    return obj;
  }

  moveAppointmentBack(dragEvent) {
    const $appointment = this._$currentAppointment;
    const size = this._initialSize;
    const coords = this._initialCoordinates;

    if (dragEvent) {
      this._removeDragSourceClassFromDraggedAppointment();

      if (isDeferred(dragEvent.cancel)) {
        dragEvent.cancel.resolve(true);
      } else {
        dragEvent.cancel = true;
      }
    }

    if ($appointment && !dragEvent) {
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

  focus() {
    if (this._$currentAppointment) {
      const focusedElement = getPublicElement(this._$currentAppointment);

      this.option('focusedElement', focusedElement);
      (eventsEngine as any).trigger(focusedElement, 'focus');
    }
  }

  splitAppointmentByDay(appointment) {
    const dates = appointment.settings || appointment;
    const originalStartDate = this.dataAccessors.get('startDate', dates);
    let startDate = dateUtils.makeDate(originalStartDate);
    let endDate = dateUtils.makeDate(this.dataAccessors.get('endDate', dates));
    const maxAllowedDate = this.invoke('getEndViewDate');
    const startDayHour = this.invoke('getStartDayHour');
    const endDayHour = this.invoke('getEndDayHour');
    const timeZoneCalculator = this.option('timeZoneCalculator');

    const adapter = new AppointmentAdapter(appointment, this.dataAccessors);
    const appointmentIsLong = getAppointmentTakesSeveralDays(adapter);
    const result: any = [];

    startDate = timeZoneCalculator.createDate(startDate, 'toGrid');
    endDate = timeZoneCalculator.createDate(endDate, 'toGrid');

    if (startDate.getHours() <= endDayHour && startDate.getHours() >= startDayHour && !appointmentIsLong) {
      result.push(this._applyStartDateToObj(new Date(startDate), {
        appointmentData: appointment,
      }));

      startDate.setDate(startDate.getDate() + 1);
    }

    while (appointmentIsLong && startDate.getTime() < endDate.getTime() && startDate < maxAllowedDate) {
      const currentStartDate = new Date(startDate);
      const currentEndDate = new Date(startDate);

      this._checkStartDate(currentStartDate, originalStartDate, startDayHour);
      this._checkEndDate(currentEndDate, endDate, endDayHour);

      const appointmentData = deepExtendArraySafe({}, appointment, true);
      const appointmentSettings = {};
      this._applyStartDateToObj(currentStartDate, appointmentSettings);
      this._applyEndDateToObj(currentEndDate, appointmentSettings);
      appointmentData.settings = appointmentSettings;
      result.push(appointmentData);

      startDate = dateUtils.trimTime(startDate);
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(startDayHour);
    }

    return result;
  }

  _checkStartDate(currentDate, originalDate, startDayHour) {
    if (!dateUtils.sameDate(currentDate, originalDate) || currentDate.getHours() <= startDayHour) {
      currentDate.setHours(startDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  }

  _checkEndDate(currentDate, originalDate, endDayHour) {
    if (!dateUtils.sameDate(currentDate, originalDate) || currentDate.getHours() > endDayHour) {
      currentDate.setHours(endDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  }

  _removeDragSourceClassFromDraggedAppointment() {
    const $appointments = (this as any)._itemElements().filter(`.${APPOINTMENT_DRAG_SOURCE_CLASS}`);

    $appointments.each((_, element) => {
      const appointmentInstance = ($(element) as any).dxSchedulerAppointment('instance');

      appointmentInstance.option('isDragSource', false);
    });
  }

  _setDragSourceAppointment(appointment, settings) {
    const $appointments = this._findItemElementByItem(appointment);
    const { startDate, endDate } = settings.info.sourceAppointment;
    const { groupIndex } = settings;

    $appointments.forEach(($item) => {
      const { info: itemInfo, groupIndex: itemGroupIndex } = $item.data(APPOINTMENT_SETTINGS_KEY);

      const {
        startDate: itemStartDate,
        endDate: itemEndDate,
      } = itemInfo.sourceAppointment;

      const appointmentInstance = $item.dxSchedulerAppointment('instance');
      const isDragSource = startDate.getTime() === itemStartDate.getTime()
                && endDate.getTime() === itemEndDate.getTime()
                && groupIndex === itemGroupIndex;

      appointmentInstance.option('isDragSource', isDragSource);
    });
  }

  updateResizableArea() {
    const $allResizableElements = (this as any).$element().find('.dx-scheduler-appointment.dx-resizable');

    const horizontalResizables = grep($allResizableElements, (el) => {
      const $el: any = $(el);
      const resizableInst = $el.dxResizable('instance');
      const { area, handles } = resizableInst.option();

      return (handles === 'right left' || handles === 'left right') && isPlainObject(area);
    });

    each(horizontalResizables, (_, el) => {
      const $el: any = $(el);
      const position = locate($el);
      const appointmentData = (this as any)._getItemData($el);

      const area = this._calculateResizableArea({
        left: position.left,
      }, appointmentData);

      $el.dxResizable('instance').option('area', area);
    });
  }
}

registerComponent('dxSchedulerAppointments', SchedulerAppointments as any);

export default SchedulerAppointments;
