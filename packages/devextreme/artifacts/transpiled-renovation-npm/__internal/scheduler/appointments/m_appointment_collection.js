"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _element_data = require("../../../core/element_data");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _array = require("../../../core/utils/array");
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _dom = require("../../../core/utils/dom");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _object = require("../../../core/utils/object");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _double_click = require("../../../events/double_click");
var _index = require("../../../events/utils/index");
var _uiCollection_widget = _interopRequireDefault(require("../../../ui/collection/ui.collection_widget.edit"));
var _date2 = require("../../core/utils/date");
var _m_appointment_adapter = require("../m_appointment_adapter");
var _m_classes = require("../m_classes");
var _m_constants = require("../m_constants");
var _m_expression_utils = require("../m_expression_utils");
var _m_recurrence = require("../m_recurrence");
var _m_utils_time_zone = _interopRequireDefault(require("../m_utils_time_zone"));
var _m_utils = require("./data_provider/m_utils");
var _m_appointment = require("./m_appointment");
var _m_appointment_layout = require("./m_appointment_layout");
var _m_core = require("./resizing/m_core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
const COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';
const DBLCLICK_EVENT_NAME = (0, _index.addNamespace)(_double_click.name, 'dxSchedulerAppointment');
const toMs = _date.default.dateToMilliseconds;
class SchedulerAppointments extends _uiCollection_widget.default {
  get isAgendaView() {
    return this.invoke('isCurrentViewAgenda');
  }
  get isVirtualScrolling() {
    return this.invoke('isVirtualScrolling');
  }
  get appointmentDataProvider() {
    return this.option('getAppointmentDataProvider')();
  }
  constructor(element, options) {
    super(element, options);
    this._virtualAppointments = {};
  }
  // TODO: remove when Collection moved to TS
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  option(optionName, value) {
    return super.option(...arguments);
  }
  notifyObserver(subject, args) {
    const observer = this.option('observer');
    if (observer) {
      observer.fire(subject, args);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invoke(funcName) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    const observer = this.option('observer');
    if (observer) {
      return observer.fire.apply(observer, arguments);
    }
  }
  _dispose() {
    clearTimeout(this._appointmentClickTimeout);
    super._dispose();
  }
  _supportedKeys() {
    const parent = super._supportedKeys();
    const tabHandler = function (e) {
      const appointments = this._getAccessAppointments();
      const focusedAppointment = appointments.filter('.dx-state-focused');
      let index = focusedAppointment.data(_m_constants.APPOINTMENT_SETTINGS_KEY).sortedIndex;
      const lastIndex = appointments.length - 1;
      if (index > 0 && e.shiftKey || index < lastIndex && !e.shiftKey) {
        e.preventDefault();
        e.shiftKey ? index-- : index++;
        const $nextAppointment = this._getAppointmentByIndex(index);
        this._resetTabIndex($nextAppointment);
        // @ts-expect-error
        _events_engine.default.trigger($nextAppointment, 'focus');
      }
    };
    const currentAppointment = this._$currentAppointment;
    return (0, _extend.extend)(parent, {
      escape: function () {
        if (this.resizeOccur) {
          var _currentAppointment$d, _currentAppointment$d2, _currentAppointment$d3;
          this.moveAppointmentBack();
          this.resizeOccur = false;
          (_currentAppointment$d = currentAppointment.dxResizable('instance')) === null || _currentAppointment$d === void 0 || _currentAppointment$d._detachEventHandlers();
          (_currentAppointment$d2 = currentAppointment.dxResizable('instance')) === null || _currentAppointment$d2 === void 0 || _currentAppointment$d2._attachEventHandlers();
          (_currentAppointment$d3 = currentAppointment.dxResizable('instance')) === null || _currentAppointment$d3 === void 0 || _currentAppointment$d3._toggleResizingClass(false);
        }
      }.bind(this),
      del: function (e) {
        if (this.option('allowDelete')) {
          e.preventDefault();
          const data = this._getItemData(e.target);
          this.notifyObserver('onDeleteButtonPress', {
            data,
            target: e.target
          });
        }
      }.bind(this),
      tab: tabHandler
    });
  }
  _getAppointmentByIndex(sortedIndex) {
    const appointments = this._getAccessAppointments();
    return appointments.filter((_, $item) => (0, _element_data.data)($item, _m_constants.APPOINTMENT_SETTINGS_KEY).sortedIndex === sortedIndex).eq(0);
  }
  _getAccessAppointments() {
    return this._itemElements().filter(':visible').not('.dx-state-disabled');
  }
  _resetTabIndex($appointment) {
    this._focusTarget().attr('tabIndex', -1);
    $appointment.attr('tabIndex', this.option('tabIndex'));
  }
  _moveFocus() {}
  _focusTarget() {
    return this._itemElements();
  }
  _renderFocusTarget() {
    const $appointment = this._getAppointmentByIndex(0);
    this._resetTabIndex($appointment);
  }
  _focusInHandler(e) {
    super._focusInHandler(e);
    this._$currentAppointment = (0, _renderer.default)(e.target);
    this.option('focusedElement', (0, _element.getPublicElement)((0, _renderer.default)(e.target)));
  }
  _focusOutHandler(e) {
    const $appointment = this._getAppointmentByIndex(0);
    this.option('focusedElement', (0, _element.getPublicElement)($appointment));
    super._focusOutHandler(e);
  }
  _eventBindingTarget() {
    return this._itemContainer();
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
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
      _collectorOffset: 0,
      groups: [],
      resources: []
    });
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'items':
        this._cleanFocusState();
        this._clearDropDownItems();
        this._clearDropDownItemsElements();
        this._repaintAppointments(args.value);
        this._renderDropDownAppointments();
        this._attachAppointmentsEvents();
        break;
      case 'fixedContainer':
      case 'allDayContainer':
      case 'onAppointmentDblClick':
        break;
      case 'allowDrag':
      case 'allowResize':
      case 'allowAllDayResize':
        this._invalidate();
        break;
      case 'focusedElement':
        this._resetTabIndex((0, _renderer.default)(args.value));
        super._optionChanged(args);
        break;
      case 'allowDelete':
        break;
      case 'focusStateEnabled':
        this._clearDropDownItemsElements();
        this._renderDropDownAppointments();
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _isAllDayAppointment(appointment) {
    return appointment.settings.length && appointment.settings[0].allDay || false;
  }
  _isRepaintAppointment(appointment) {
    return !(0, _type.isDefined)(appointment.needRepaint) || appointment.needRepaint === true;
  }
  _isRepaintAll(appointments) {
    if (this.isAgendaView) {
      return true;
    }
    for (let i = 0; i < appointments.length; i++) {
      if (!this._isRepaintAppointment(appointments[i])) {
        return false;
      }
    }
    return true;
  }
  _applyFragment(fragment, allDay) {
    if (fragment.children().length > 0) {
      this._getAppointmentContainer(allDay).append(fragment);
    }
  }
  _onEachAppointment(appointment, index, container, isRepaintAll) {
    const repaintAppointment = () => {
      appointment.needRepaint = false;
      this._clearItem(appointment);
      this._renderItem(index, appointment, container);
    };
    if ((appointment === null || appointment === void 0 ? void 0 : appointment.needRemove) === true) {
      this._clearItem(appointment);
    } else if (isRepaintAll || this._isRepaintAppointment(appointment)) {
      repaintAppointment();
    }
  }
  _repaintAppointments(appointments) {
    this._renderByFragments(($commonFragment, $allDayFragment) => {
      const isRepaintAll = this._isRepaintAll(appointments);
      if (isRepaintAll) {
        this._getAppointmentContainer(true).html('');
        this._getAppointmentContainer(false).html('');
      }
      !appointments.length && this._cleanItemContainer();
      appointments.forEach((appointment, index) => {
        const container = this._isAllDayAppointment(appointment) ? $allDayFragment : $commonFragment;
        this._onEachAppointment(appointment, index, container, isRepaintAll);
      });
    });
  }
  _renderByFragments(renderFunction) {
    if (this.isVirtualScrolling) {
      const $commonFragment = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
      const $allDayFragment = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
      renderFunction($commonFragment, $allDayFragment);
      this._applyFragment($commonFragment, false);
      this._applyFragment($allDayFragment, true);
    } else {
      renderFunction(this._getAppointmentContainer(false), this._getAppointmentContainer(true));
    }
  }
  _attachAppointmentsEvents() {
    this._attachClickEvent();
    this._attachHoldEvent();
    this._attachContextMenuEvent();
    this._attachAppointmentDblClick();
    this._renderFocusState();
    this._attachFeedbackEvents();
    this._attachHoverEvents();
  }
  _clearItem(item) {
    const $items = this._findItemElementByItem(item.itemData);
    if (!$items.length) {
      return;
    }
    (0, _iterator.each)($items, (_, $item) => {
      $item.detach();
      $item.remove();
    });
  }
  _clearDropDownItems() {
    this._virtualAppointments = {};
  }
  _clearDropDownItemsElements() {
    this.invoke('clearCompactAppointments');
  }
  _findItemElementByItem(item) {
    const result = [];
    const that = this;
    this.itemElements().each(function () {
      const $item = (0, _renderer.default)(this);
      if ($item.data(that._itemDataKey()) === item) {
        result.push($item);
      }
    });
    return result;
  }
  _itemClass() {
    return _m_classes.APPOINTMENT_ITEM_CLASS;
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
    this._virtualAppointments = {};
  }
  _clean() {
    super._clean();
    delete this._$currentAppointment;
    delete this._initialSize;
    delete this._initialCoordinates;
  }
  _init() {
    super._init();
    this.$element().addClass(COMPONENT_CLASS);
    this._preventSingleAppointmentClick = false;
  }
  _renderAppointmentTemplate($container, appointment, model) {
    var _this$_currentAppoint;
    const config = {
      isAllDay: appointment.allDay,
      isRecurrence: appointment.recurrenceRule,
      // TODO
      html: (0, _type.isPlainObject)(appointment) && appointment.html ? appointment.html : undefined
    };
    const formatText = this.invoke('getTextAndFormatDate', model.appointmentData, ((_this$_currentAppoint = this._currentAppointmentSettings) === null || _this$_currentAppoint === void 0 ? void 0 : _this$_currentAppoint.agendaSettings) || model.targetedAppointmentData, 'TIME');
    $container.append(this.isAgendaView ? (0, _m_appointment_layout.createAgendaAppointmentLayout)(formatText, config) : (0, _m_appointment_layout.createAppointmentLayout)(formatText, config));
    if (!this.isAgendaView) {
      $container.parent().prepend((0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.STRIP));
    }
  }
  _executeItemRenderAction(index, itemData, itemElement) {
    const action = this._getItemRenderAction();
    if (action) {
      action(this.invoke('mapAppointmentFields', {
        itemData,
        itemElement
      }));
    }
    delete this._currentAppointmentSettings;
  }
  _itemClickHandler(e) {
    super._itemClickHandler(e, {}, {
      afterExecute: function (e) {
        this._processItemClick(e.args[0].event);
      }.bind(this)
    });
  }
  _processItemClick(e) {
    const $target = (0, _renderer.default)(e.currentTarget);
    const data = this._getItemData($target);
    if (e.type === 'keydown' || (0, _index.isFakeClickEvent)(e)) {
      this.notifyObserver('showEditAppointmentPopup', {
        data,
        target: $target
      });
      return;
    }
    this._appointmentClickTimeout = setTimeout(() => {
      if (!this._preventSingleAppointmentClick && (0, _dom.isElementInDom)($target)) {
        this.notifyObserver('showAppointmentTooltip', {
          data,
          target: $target
        });
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
    const that = this;
    const itemSelector = that._itemSelector();
    const itemContainer = this._itemContainer();
    _events_engine.default.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);
    _events_engine.default.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, e => {
      that._itemDXEventHandler(e, 'onAppointmentDblClick', {}, {
        afterExecute(e) {
          that._dblClickHandler(e.args[0].event);
        }
      });
    });
  }
  _dblClickHandler(e) {
    const $targetAppointment = (0, _renderer.default)(e.currentTarget);
    const appointmentData = this._getItemData($targetAppointment);
    clearTimeout(this._appointmentClickTimeout);
    this._preventSingleAppointmentClick = true;
    this.notifyObserver('showEditAppointmentPopup', {
      data: appointmentData,
      target: $targetAppointment
    });
  }
  _renderItem(index, item, container) {
    const {
      itemData
    } = item;
    const $items = [];
    for (let i = 0; i < item.settings.length; i++) {
      const setting = item.settings[i];
      this._currentAppointmentSettings = setting;
      const $item = super._renderItem(index, itemData, container);
      $item.data(_m_constants.APPOINTMENT_SETTINGS_KEY, setting);
      $items.push($item);
    }
    return $items;
  }
  _getItemContent($itemFrame) {
    $itemFrame.data(_m_constants.APPOINTMENT_SETTINGS_KEY, this._currentAppointmentSettings);
    const $itemContent = super._getItemContent($itemFrame);
    return $itemContent;
  }
  _createItemByTemplate(itemTemplate, renderArgs) {
    const {
      itemData,
      container,
      index
    } = renderArgs;
    return itemTemplate.render({
      model: {
        appointmentData: itemData,
        targetedAppointmentData: this.invoke('getTargetedAppointmentData', itemData, (0, _renderer.default)(container).parent())
      },
      container,
      index
    });
  }
  _getAppointmentContainer(allDay) {
    const $allDayContainer = this.option('allDayContainer');
    let $container = this.itemsContainer().not($allDayContainer);
    if (allDay && $allDayContainer) {
      $container = $allDayContainer;
    }
    return $container;
  }
  _postprocessRenderItem(args) {
    this._renderAppointment(args.itemElement, this._currentAppointmentSettings);
  }
  _renderAppointment(element, settings) {
    element.data(_m_constants.APPOINTMENT_SETTINGS_KEY, settings);
    this._applyResourceDataAttr(element);
    const rawAppointment = this._getItemData(element);
    const geometry = this.invoke('getAppointmentGeometry', settings);
    const allowResize = this.option('allowResize') && (!(0, _type.isDefined)(settings.skipResizing) || (0, _type.isString)(settings.skipResizing));
    const allowDrag = this.option('allowDrag');
    const {
      allDay
    } = settings;
    this.invoke('setCellDataCacheAlias', this._currentAppointmentSettings, geometry);
    if (settings.virtual) {
      const appointmentConfig = {
        itemData: rawAppointment,
        groupIndex: settings.groupIndex,
        groups: this.option('groups')
      };
      const deferredColor = this.option('getAppointmentColor')(appointmentConfig);
      this._processVirtualAppointment(settings, element, rawAppointment, deferredColor);
    } else {
      var _settings$info;
      const config = {
        data: rawAppointment,
        groupIndex: settings.groupIndex,
        observer: this.option('observer'),
        geometry,
        direction: settings.direction || 'vertical',
        allowResize,
        allowDrag,
        allDay,
        reduced: settings.appointmentReduced,
        isCompact: settings.isCompact,
        startDate: new Date((_settings$info = settings.info) === null || _settings$info === void 0 ? void 0 : _settings$info.appointment.startDate),
        cellWidth: this.invoke('getCellWidth'),
        cellHeight: this.invoke('getCellHeight'),
        resizableConfig: this._resizableConfig(rawAppointment, settings),
        groups: this.option('groups'),
        getAppointmentColor: this.option('getAppointmentColor'),
        getResourceDataAccessors: this.option('getResourceDataAccessors')
      };
      if (this.isAgendaView) {
        const agendaResourceProcessor = this.option('getAgendaResourceProcessor')();
        config.createPlainResourceListAsync = rawAppointment => agendaResourceProcessor.createListAsync(rawAppointment);
      }
      this._createComponent(element, this.isAgendaView ? _m_appointment.AgendaAppointment : _m_appointment.Appointment, _extends({}, config, {
        dataAccessors: this.option('dataAccessors'),
        getResizableStep: this.option('getResizableStep')
      }));
    }
  }
  _applyResourceDataAttr($appointment) {
    const dataAccessors = this.option('getResourceDataAccessors')();
    const rawAppointment = this._getItemData($appointment);
    (0, _iterator.each)(dataAccessors.getter, key => {
      const value = dataAccessors.getter[key](rawAppointment);
      if ((0, _type.isDefined)(value)) {
        const prefix = `data-${(0, _common.normalizeKey)(key.toLowerCase())}-`;
        (0, _array.wrapToArray)(value).forEach(value => $appointment.attr(prefix + (0, _common.normalizeKey)(value), true));
      }
    });
  }
  _resizableConfig(appointmentData, itemSetting) {
    return {
      area: this._calculateResizableArea(itemSetting, appointmentData),
      onResizeStart: function (e) {
        this.resizeOccur = true;
        this._$currentAppointment = (0, _renderer.default)(e.element);
        if (this.invoke('needRecalculateResizableArea')) {
          const updatedArea = this._calculateResizableArea(this._$currentAppointment.data(_m_constants.APPOINTMENT_SETTINGS_KEY), this._$currentAppointment.data('dxItemData'));
          e.component.option('area', updatedArea);
          e.component._renderDragOffsets(e.event);
        }
        this._initialSize = {
          width: e.width,
          height: e.height
        };
        this._initialCoordinates = (0, _translator.locate)(this._$currentAppointment);
      }.bind(this),
      onResizeEnd: function (e) {
        this.resizeOccur = false;
        this._resizeEndHandler(e);
      }.bind(this)
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _calculateResizableArea(itemSetting, appointmentData) {
    const area = this.$element().closest('.dx-scrollable-content');
    return this.invoke('getResizableAppointmentArea', {
      coordinates: {
        left: itemSetting.left,
        top: 0,
        groupIndex: itemSetting.groupIndex
      },
      allDay: itemSetting.allDay
    }) || area;
  }
  _resizeEndHandler(e) {
    const $element = (0, _renderer.default)(e.element);
    const {
      allDay,
      info
    } = $element.data('dxAppointmentSettings');
    const sourceAppointment = this._getItemData($element);
    const viewOffset = this.invoke('getViewOffsetMs');
    let dateRange;
    if (allDay) {
      dateRange = this.resizeAllDay(e);
    } else {
      const startDate = this._getEndResizeAppointmentStartDate(e, sourceAppointment, info.appointment);
      const {
        endDate
      } = info.appointment;
      const shiftedStartDate = _date2.dateUtilsTs.addOffsets(startDate, [-viewOffset]);
      const shiftedEndDate = _date2.dateUtilsTs.addOffsets(endDate, [-viewOffset]);
      dateRange = this._getDateRange(e, shiftedStartDate, shiftedEndDate);
      dateRange.startDate = _date2.dateUtilsTs.addOffsets(dateRange.startDate, [viewOffset]);
      dateRange.endDate = _date2.dateUtilsTs.addOffsets(dateRange.endDate, [viewOffset]);
    }
    this.updateResizedAppointment($element, dateRange, this.option('dataAccessors'), this.option('timeZoneCalculator'));
  }
  resizeAllDay(e) {
    const $element = (0, _renderer.default)(e.element);
    const timeZoneCalculator = this.option('timeZoneCalculator');
    const dataAccessors = this.option('dataAccessors');
    return (0, _m_core.getAppointmentDateRange)({
      handles: e.handles,
      appointmentSettings: $element.data('dxAppointmentSettings'),
      isVerticalViewDirection: this.option('isVerticalViewDirection')(),
      isVerticalGroupedWorkSpace: this.option('isVerticalGroupedWorkSpace')(),
      appointmentRect: (0, _position.getBoundingRect)($element[0]),
      parentAppointmentRect: (0, _position.getBoundingRect)($element.parent()[0]),
      viewDataProvider: this.option('getViewDataProvider')(),
      isDateAndTimeView: this.option('isDateAndTimeView')(),
      startDayHour: this.invoke('getStartDayHour'),
      endDayHour: this.invoke('getEndDayHour'),
      timeZoneCalculator,
      dataAccessors,
      rtlEnabled: this.option('rtlEnabled'),
      DOMMetaData: this.option('getDOMElementsMetaData')(),
      viewOffset: this.invoke('getViewOffsetMs')
    });
  }
  updateResizedAppointment($element, dateRange, dataAccessors, timeZoneCalculator) {
    const sourceAppointment = this._getItemData($element);
    const modifiedAppointmentAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(sourceAppointment, dataAccessors, timeZoneCalculator).clone();
    modifiedAppointmentAdapter.startDate = new Date(dateRange.startDate);
    modifiedAppointmentAdapter.endDate = new Date(dateRange.endDate);
    this.notifyObserver('updateAppointmentAfterResize', {
      target: sourceAppointment,
      data: modifiedAppointmentAdapter.clone({
        pathTimeZone: 'fromGrid'
      }).source(),
      $appointment: $element
    });
  }
  _getEndResizeAppointmentStartDate(e, rawAppointment, appointmentInfo) {
    const timeZoneCalculator = this.option('timeZoneCalculator');
    const appointmentAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this.option('dataAccessors'), timeZoneCalculator);
    let {
      startDate
    } = appointmentInfo;
    const recurrenceProcessor = (0, _m_recurrence.getRecurrenceProcessor)();
    const {
      recurrenceRule,
      startDateTimeZone
    } = appointmentAdapter;
    const isAllDay = this.invoke('isAllDay', rawAppointment);
    const isRecurrent = recurrenceProcessor.isValidRecurrenceRule(recurrenceRule);
    if (!e.handles.top && !isRecurrent && !isAllDay) {
      startDate = timeZoneCalculator.createDate(appointmentAdapter.startDate, {
        appointmentTimeZone: startDateTimeZone,
        path: 'toGrid'
      });
    }
    return startDate;
  }
  _getDateRange(e, startDate, endDate) {
    const itemData = this._getItemData(e.element);
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
      startTime = needCorrectDates ? this._correctStartDateByDelta(startDate, deltaTime) : startDate.getTime() - deltaTime;
      startTime += _m_utils_time_zone.default.getTimezoneOffsetChangeInMs(startDate, endDate, startTime, endDate);
      endTime = endDate.getTime();
    } else {
      startTime = startDate.getTime();
      endTime = needCorrectDates ? this._correctEndDateByDelta(endDate, deltaTime) : endDate.getTime() + deltaTime;
      endTime -= _m_utils_time_zone.default.getTimezoneOffsetChangeInMs(startDate, endDate, startDate, endTime);
    }
    return {
      startDate: new Date(startTime),
      endDate: new Date(endTime)
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
    const daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
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
    const daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
    if (result < minDate.getTime() || result >= maxDate.getTime()) {
      const tailOfCurrentDay = correctStartDate.getTime() - minDate.getTime();
      const tailOfPrevDays = deltaTime - tailOfCurrentDay;
      const firstDay = new Date(correctStartDate.setDate(correctStartDate.getDate() - daysCount));
      firstDay.setHours(endDayHour, 0, 0, 0);
      result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
    }
    return result;
  }
  _processVirtualAppointment(appointmentSetting, $appointment, appointmentData, color) {
    const virtualAppointment = appointmentSetting.virtual;
    const virtualGroupIndex = virtualAppointment.index;
    if (!(0, _type.isDefined)(this._virtualAppointments[virtualGroupIndex])) {
      this._virtualAppointments[virtualGroupIndex] = {
        coordinates: {
          top: virtualAppointment.top,
          left: virtualAppointment.left
        },
        items: {
          data: [],
          colors: [],
          settings: []
        },
        isAllDay: !!virtualAppointment.isAllDay,
        buttonColor: color
      };
    }
    appointmentSetting.targetedAppointmentData = this.invoke('getTargetedAppointmentData', appointmentData, $appointment);
    this._virtualAppointments[virtualGroupIndex].items.settings.push(appointmentSetting);
    this._virtualAppointments[virtualGroupIndex].items.data.push(appointmentData);
    this._virtualAppointments[virtualGroupIndex].items.colors.push(color);
    $appointment.remove();
  }
  _renderContentImpl() {
    super._renderContentImpl();
    this._renderDropDownAppointments();
  }
  _renderDropDownAppointments() {
    this._renderByFragments(($commonFragment, $allDayFragment) => {
      (0, _iterator.each)(this._virtualAppointments, groupIndex => {
        const virtualGroup = this._virtualAppointments[groupIndex];
        const virtualItems = virtualGroup.items;
        const virtualCoordinates = virtualGroup.coordinates;
        const $fragment = virtualGroup.isAllDay ? $allDayFragment : $commonFragment;
        const {
          left
        } = virtualCoordinates;
        const buttonWidth = this.invoke('getDropDownAppointmentWidth', virtualGroup.isAllDay);
        const buttonHeight = this.invoke('getDropDownAppointmentHeight');
        const rtlOffset = this.option('rtlEnabled') ? buttonWidth : 0;
        this.notifyObserver('renderCompactAppointments', {
          $container: $fragment,
          coordinates: {
            top: virtualCoordinates.top,
            left: left + rtlOffset
          },
          items: virtualItems,
          buttonColor: virtualGroup.buttonColor,
          width: buttonWidth - this.option('_collectorOffset'),
          height: buttonHeight,
          onAppointmentClick: this.option('onItemClick'),
          allowDrag: this.option('allowDrag'),
          cellWidth: this.invoke('getCellWidth'),
          isCompact: this.invoke('isAdaptive') || this._isGroupCompact(virtualGroup)
        });
      });
    });
  }
  _isGroupCompact(virtualGroup) {
    return !virtualGroup.isAllDay && this.invoke('supportCompactDropDownAppointments');
  }
  _sortAppointmentsByStartDate(appointments) {
    return (0, _m_utils.sortAppointmentsByStartDate)(appointments, this.option('dataAccessors'));
  }
  _processRecurrenceAppointment(appointment, index, skipLongAppointments) {
    // NOTE: this method is actual only for agenda
    const recurrenceRule = _m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'recurrenceRule', appointment);
    const result = {
      parts: [],
      indexes: []
    };
    if (recurrenceRule) {
      const dates = appointment.settings || appointment;
      const startDate = new Date(_m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'startDate', dates));
      const startDateTimeZone = _m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'startDateTimeZone', appointment);
      const endDate = new Date(_m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'endDate', dates));
      const appointmentDuration = endDate.getTime() - startDate.getTime();
      const recurrenceException = _m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'recurrenceException', appointment);
      const startViewDate = this.invoke('getStartViewDate');
      const endViewDate = this.invoke('getEndViewDate');
      const timezoneCalculator = this.option('timeZoneCalculator');
      const recurrentDates = (0, _m_recurrence.getRecurrenceProcessor)().generateDates({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: startDate,
        end: endDate,
        min: startViewDate,
        max: endViewDate,
        appointmentTimezoneOffset: timezoneCalculator.getOriginStartDateOffsetInMs(startDate, startDateTimeZone, false)
      });
      const recurrentDateCount = appointment.settings ? 1 : recurrentDates.length;
      for (let i = 0; i < recurrentDateCount; i++) {
        const appointmentPart = (0, _extend.extend)({}, appointment, true);
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
      parts: []
    };
    if (partCount > 1) {
      (0, _extend.extend)(appointment, parts[0]);
      for (let i = 1; i < partCount; i++) {
        let startDate = _m_expression_utils.ExpressionUtils.getField(this.option('dataAccessors'), 'startDate', parts[i].settings).getTime();
        startDate = timeZoneCalculator.createDate(startDate, {
          path: 'toGrid'
        });
        if (startDate < endViewDate && startDate > startViewDate) {
          result.parts.push(parts[i]);
        }
      }
    }
    return result;
  }
  _reduceRecurrenceAppointments(recurrenceIndexes, appointments) {
    (0, _iterator.each)(recurrenceIndexes, (i, index) => {
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
    _m_expression_utils.ExpressionUtils.setField(this.option('dataAccessors'), 'startDate', obj, startDate);
    return obj;
  }
  _applyEndDateToObj(endDate, obj) {
    _m_expression_utils.ExpressionUtils.setField(this.option('dataAccessors'), 'endDate', obj, endDate);
    return obj;
  }
  moveAppointmentBack(dragEvent) {
    const $appointment = this._$currentAppointment;
    const size = this._initialSize;
    const coords = this._initialCoordinates;
    if (dragEvent) {
      this._removeDragSourceClassFromDraggedAppointment();
      if ((0, _type.isDeferred)(dragEvent.cancel)) {
        dragEvent.cancel.resolve(true);
      } else {
        dragEvent.cancel = true;
      }
    }
    if ($appointment && !dragEvent) {
      if (coords) {
        (0, _translator.move)($appointment, coords);
        delete this._initialSize;
      }
      if (size) {
        (0, _size.setOuterWidth)($appointment, size.width);
        (0, _size.setOuterHeight)($appointment, size.height);
        delete this._initialCoordinates;
      }
    }
  }
  focus() {
    if (this._$currentAppointment) {
      const focusedElement = (0, _element.getPublicElement)(this._$currentAppointment);
      this.option('focusedElement', focusedElement);
      _events_engine.default.trigger(focusedElement, 'focus');
    }
  }
  splitAppointmentByDay(appointment) {
    const dates = appointment.settings || appointment;
    const dataAccessors = this.option('dataAccessors');
    const originalStartDate = new Date(_m_expression_utils.ExpressionUtils.getField(dataAccessors, 'startDate', dates));
    let startDate = _date.default.makeDate(originalStartDate);
    let endDate = _date.default.makeDate(_m_expression_utils.ExpressionUtils.getField(dataAccessors, 'endDate', dates));
    const maxAllowedDate = this.invoke('getEndViewDate');
    const startDayHour = this.invoke('getStartDayHour');
    const endDayHour = this.invoke('getEndDayHour');
    const timeZoneCalculator = this.option('timeZoneCalculator');
    const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(appointment, dataAccessors, timeZoneCalculator);
    const appointmentIsLong = (0, _m_utils.getAppointmentTakesSeveralDays)(adapter);
    const result = [];
    startDate = timeZoneCalculator.createDate(startDate, {
      path: 'toGrid'
    });
    endDate = timeZoneCalculator.createDate(endDate, {
      path: 'toGrid'
    });
    if (startDate.getHours() <= endDayHour && startDate.getHours() >= startDayHour && !appointmentIsLong) {
      result.push(this._applyStartDateToObj(new Date(startDate), {
        appointmentData: appointment
      }));
      startDate.setDate(startDate.getDate() + 1);
    }
    while (appointmentIsLong && startDate.getTime() < endDate.getTime() && startDate < maxAllowedDate) {
      const currentStartDate = new Date(startDate);
      const currentEndDate = new Date(startDate);
      this._checkStartDate(currentStartDate, originalStartDate, startDayHour);
      this._checkEndDate(currentEndDate, endDate, endDayHour);
      const appointmentData = (0, _object.deepExtendArraySafe)({}, appointment, true);
      const appointmentSettings = {};
      this._applyStartDateToObj(currentStartDate, appointmentSettings);
      this._applyEndDateToObj(currentEndDate, appointmentSettings);
      appointmentData.settings = appointmentSettings;
      result.push(appointmentData);
      startDate = _date.default.trimTime(startDate);
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(startDayHour);
    }
    return result;
  }
  _checkStartDate(currentDate, originalDate, startDayHour) {
    if (!_date.default.sameDate(currentDate, originalDate) || currentDate.getHours() <= startDayHour) {
      currentDate.setHours(startDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  }
  _checkEndDate(currentDate, originalDate, endDayHour) {
    if (!_date.default.sameDate(currentDate, originalDate) || currentDate.getHours() > endDayHour) {
      currentDate.setHours(endDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  }
  _removeDragSourceClassFromDraggedAppointment() {
    const $appointments = this._itemElements().filter(`.${_m_classes.APPOINTMENT_DRAG_SOURCE_CLASS}`);
    $appointments.each((_, element) => {
      const appointmentInstance = (0, _renderer.default)(element).dxSchedulerAppointment('instance');
      appointmentInstance.option('isDragSource', false);
    });
  }
  _setDragSourceAppointment(appointment, settings) {
    const $appointments = this._findItemElementByItem(appointment);
    const {
      startDate,
      endDate
    } = settings.info.sourceAppointment;
    const {
      groupIndex
    } = settings;
    $appointments.forEach($item => {
      const {
        info: itemInfo,
        groupIndex: itemGroupIndex
      } = $item.data(_m_constants.APPOINTMENT_SETTINGS_KEY);
      const {
        startDate: itemStartDate,
        endDate: itemEndDate
      } = itemInfo.sourceAppointment;
      const appointmentInstance = $item.dxSchedulerAppointment('instance');
      const isDragSource = startDate.getTime() === itemStartDate.getTime() && endDate.getTime() === itemEndDate.getTime() && groupIndex === itemGroupIndex;
      appointmentInstance.option('isDragSource', isDragSource);
    });
  }
  updateResizableArea() {
    const $allResizableElements = this.$element().find('.dx-scheduler-appointment.dx-resizable');
    const horizontalResizables = (0, _common.grep)($allResizableElements, el => {
      const $el = (0, _renderer.default)(el);
      const resizableInst = $el.dxResizable('instance');
      const {
        area,
        handles
      } = resizableInst.option();
      return (handles === 'right left' || handles === 'left right') && (0, _type.isPlainObject)(area);
    });
    (0, _iterator.each)(horizontalResizables, (_, el) => {
      const $el = (0, _renderer.default)(el);
      const position = (0, _translator.locate)($el);
      const appointmentData = this._getItemData($el);
      const area = this._calculateResizableArea({
        left: position.left
      }, appointmentData);
      $el.dxResizable('instance').option('area', area);
    });
  }
}
(0, _component_registrator.default)('dxSchedulerAppointments', SchedulerAppointments);
var _default = exports.default = SchedulerAppointments;