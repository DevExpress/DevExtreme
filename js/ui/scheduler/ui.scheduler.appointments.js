import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { data as elementData } from '../../core/element_data';
import { locate, move } from '../../animation/translator';
import dateUtils from '../../core/utils/date';
import { noop, normalizeKey } from '../../core/utils/common';
import { isDefined, isDeferred, isPlainObject, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { deepExtendArraySafe } from '../../core/utils/object';
import { merge } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { getPublicElement } from '../../core/element';
import { getRecurrenceProcessor } from './recurrence';
import registerComponent from '../../core/component_registrator';
import publisherMixin from './ui.scheduler.publisher_mixin';
import Appointment from './ui.scheduler.appointment';
import { addNamespace, isFakeClickEvent } from '../../events/utils/index';
import { name as dblclickEvent } from '../../events/double_click';
import messageLocalization from '../../localization/message';
import CollectionWidget from '../collection/ui.collection_widget.edit';
import { Deferred } from '../../core/utils/deferred';
import timeZoneUtils from './utils.timeZone.js';
import { APPOINTMENT_DRAG_SOURCE_CLASS, APPOINTMENT_SETTINGS_KEY } from './constants';

const COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';
const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';
const APPOINTMENT_TITLE_CLASS = 'dx-scheduler-appointment-title';
const APPOINTMENT_CONTENT_DETAILS_CLASS = 'dx-scheduler-appointment-content-details';
const APPOINTMENT_DATE_CLASS = 'dx-scheduler-appointment-content-date';
const RECURRING_ICON_CLASS = 'dx-scheduler-appointment-recurrence-icon';
const ALL_DAY_CONTENT_CLASS = 'dx-scheduler-appointment-content-allday';

const DBLCLICK_EVENT_NAME = addNamespace(dblclickEvent, 'dxSchedulerAppointment');

const toMs = dateUtils.dateToMilliseconds;

const SchedulerAppointments = CollectionWidget.inherit({
    ctor: function(element, options) {
        this.callBase(element, options);
    },

    _supportedKeys: function() {
        const parent = this.callBase();

        const tabHandler = function(e) {
            const appointments = this._getAccessAppointments();
            const focusedAppointment = appointments.filter('.dx-state-focused');
            let index = focusedAppointment.data(APPOINTMENT_SETTINGS_KEY).sortedIndex;
            const lastIndex = appointments.length - 1;

            if((index > 0 && e.shiftKey) || (index < lastIndex && !e.shiftKey)) {
                e.preventDefault();

                e.shiftKey ? index-- : index++;

                const $nextAppointment = this._getAppointmentByIndex(index);
                this._resetTabIndex($nextAppointment);
                eventsEngine.trigger($nextAppointment, 'focus');
            }
        };

        return extend(parent, {
            escape: (function() {
                this.moveAppointmentBack();
                this._escPressed = true;
            }).bind(this),
            del: (function(e) {
                if(this.option('allowDelete')) {
                    e.preventDefault();
                    const data = this._getItemData(e.target);
                    this.notifyObserver('onDeleteButtonPress', { data: data, target: e.target });
                }
            }).bind(this),
            tab: tabHandler
        });
    },

    _getAppointmentByIndex: function(sortedIndex) {
        const appointments = this._getAccessAppointments();

        return appointments.filter(function(_, $item) {
            return elementData($item, APPOINTMENT_SETTINGS_KEY).sortedIndex === sortedIndex;
        }).eq(0);
    },

    _getAccessAppointments: function() {
        return this._itemElements().filter(':visible').not('.dx-state-disabled');
    },

    _resetTabIndex: function($appointment) {
        this._focusTarget().attr('tabIndex', -1);
        $appointment.attr('tabIndex', this.option('tabIndex'));
    },

    _moveFocus: noop,

    _focusTarget: function() {
        return this._itemElements();
    },

    _renderFocusTarget: function() {
        const $appointment = this._getAppointmentByIndex(0);

        this._resetTabIndex($appointment);
    },

    _focusInHandler: function(e) {
        this.callBase.apply(this, arguments);
        this._$currentAppointment = $(e.target);
        this.option('focusedElement', getPublicElement($(e.target)));
    },

    _focusOutHandler: function() {
        const $appointment = this._getAppointmentByIndex(0);

        this.option('focusedElement', getPublicElement($appointment));
        this.callBase.apply(this, arguments);
    },

    _eventBindingTarget: function() {
        return this._itemContainer();
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
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
            _collectorOffset: 0
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
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
                this._resetTabIndex($(args.value));
                this.callBase(args);
                break;
            case 'allowDelete':
                break;
            case 'focusStateEnabled':
                this._clearDropDownItemsElements();
                this._renderDropDownAppointments();

                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _isAllDayAppointment: function(appointment) {
        return appointment.settings.length && appointment.settings[0].allDay || false;
    },

    _isRepaintAppointment: function(appointment) {
        return !isDefined(appointment.needRepaint) || appointment.needRepaint === true;
    },

    _isRepaintAll: function(appointments) {
        if(this.invoke('isVirtualScrolling')) {
            return true;
        }
        if(this.invoke('isCurrentViewAgenda')) {
            return true;
        }
        for(let i = 0; i < appointments.length; i++) {
            const appointment = appointments[i];
            if(!this._isRepaintAppointment(appointment)) {
                return false;
            }
        }
        return true;
    },

    _applyFragment: function(fragment, allDay) {
        if(fragment.children().length > 0) {
            this._getAppointmentContainer(allDay).append(fragment);
        }
    },

    _onEachAppointment: function(appointment, index, container, isRepaintAll) {
        const repaintAppointment = () => {
            appointment.needRepaint = false;
            this._clearItem(appointment);
            this._renderItem(index, appointment, container);
        };

        if(appointment?.needRemove === true) {
            this._clearItem(appointment);
        } else if(isRepaintAll || this._isRepaintAppointment(appointment)) {
            repaintAppointment();
        }
    },

    _repaintAppointments: function(appointments) {
        this._renderByFragments(($commonFragment, $allDayFragment) => {
            const isRepaintAll = this._isRepaintAll(appointments);

            if(isRepaintAll) {
                this._getAppointmentContainer(true).html('');
                this._getAppointmentContainer(false).html('');
            }

            !appointments.length && this._cleanItemContainer();

            appointments.forEach((appointment, index) => {
                const container = this._isAllDayAppointment(appointment)
                    ? $allDayFragment
                    : $commonFragment;
                this._onEachAppointment(appointment, index, container, isRepaintAll);
            });
        });
    },

    _renderByFragments: function(renderFunction) {
        const isVirtualScrolling = this.invoke('isVirtualScrolling');
        if(isVirtualScrolling) {
            const $commonFragment = $(domAdapter.createDocumentFragment());
            const $allDayFragment = $(domAdapter.createDocumentFragment());

            renderFunction($commonFragment, $allDayFragment);

            this._applyFragment($commonFragment, false);
            this._applyFragment($allDayFragment, true);
        } else {
            renderFunction(
                this._getAppointmentContainer(false),
                this._getAppointmentContainer(true)
            );
        }
    },

    _attachAppointmentsEvents: function() {
        this._attachClickEvent();
        this._attachHoldEvent();
        this._attachContextMenuEvent();
        this._attachAppointmentDblClick();

        this._renderFocusState();
        this._attachFeedbackEvents();
        this._attachHoverEvents();
    },

    _clearItem: function(item) {
        const $items = this._findItemElementByItem(item.itemData);
        if(!$items.length) {
            return;
        }

        each($items, function(_, $item) {
            $item.detach();
            $item.remove();
        });
    },

    _clearDropDownItems: function() {
        this._virtualAppointments = {};
    },

    _clearDropDownItemsElements: function() {
        this.invoke('clearCompactAppointments');
    },

    _findItemElementByItem: function(item) {
        const result = [];
        const that = this;

        this.itemElements().each(function() {
            const $item = $(this);
            if($item.data(that._itemDataKey()) === item) {
                result.push($item);
            }
        });

        return result;
    },

    _itemClass: function() {
        return APPOINTMENT_ITEM_CLASS;
    },

    _itemContainer: function() {
        const $container = this.callBase();
        let $result = $container;
        const $allDayContainer = this.option('allDayContainer');

        if($allDayContainer) {
            $result = $container.add($allDayContainer);
        }

        return $result;
    },

    _cleanItemContainer: function() {
        this.callBase();
        const $allDayContainer = this.option('allDayContainer');

        if($allDayContainer) {
            $allDayContainer.empty();
        }

        this._virtualAppointments = {};
    },

    _clean: function() {
        this.callBase();
        delete this._$currentAppointment;
        delete this._initialSize;
        delete this._initialCoordinates;
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(COMPONENT_CLASS);
        this._preventSingleAppointmentClick = false;
    },

    _renderAppointmentTemplate: function($container, data, model) {
        const formatText = this.invoke(
            'getTextAndFormatDate',
            model.appointmentData,
            model.appointmentData.settings || model.targetedAppointmentData,
            // TODO: very strange variable model.appointmentData.settings at this place
            'TIME'
        );

        $('<div>')
            .text(formatText.text)
            .addClass(APPOINTMENT_TITLE_CLASS)
            .appendTo($container);

        if(isPlainObject(data)) {
            if(data.html) {
                $container.html(data.html);
            }
        }

        const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_DETAILS_CLASS);

        $('<div>').addClass(APPOINTMENT_DATE_CLASS).text(formatText.formatDate).appendTo($contentDetails);

        $contentDetails.appendTo($container);

        if(data.recurrenceRule) {
            $('<span>').addClass(RECURRING_ICON_CLASS + ' dx-icon-repeat').appendTo($container);
        }

        if(data.allDay) {
            $('<div>')
                .text(' ' + messageLocalization.format('dxScheduler-allDay') + ': ')
                .addClass(ALL_DAY_CONTENT_CLASS)
                .prependTo($contentDetails);
        }
    },

    _executeItemRenderAction: function(index, itemData, itemElement) {
        const action = this._getItemRenderAction();
        if(action) {
            action(this.invoke('mapAppointmentFields', { itemData: itemData, itemElement: itemElement }));
        }
        delete this._currentAppointmentSettings;
    },

    _itemClickHandler: function(e) {
        this.callBase(e, {}, {
            afterExecute: (function(e) {
                this._processItemClick(e.args[0].event);
            }).bind(this)
        });
    },

    _processItemClick: function(e) {
        const $target = $(e.currentTarget);
        const data = this._getItemData($target);

        if(e.type === 'keydown' || isFakeClickEvent(e)) {
            this.notifyObserver('showEditAppointmentPopup', { data: data, target: $target });
            return;
        }

        this._appointmentClickTimeout = setTimeout((function() {
            if(!this._preventSingleAppointmentClick && domAdapter.getBody().contains($target[0])) {
                this.notifyObserver('showAppointmentTooltip', { data: data, target: $target });
            }

            this._preventSingleAppointmentClick = false;
        }).bind(this), 300);
    },

    _extendActionArgs: function() {
        const args = this.callBase.apply(this, arguments);

        return this.invoke('mapAppointmentFields', args);
    },

    _render: function() {
        this.callBase.apply(this, arguments);

        this._attachAppointmentDblClick();
    },

    _attachAppointmentDblClick: function() {
        const that = this;
        const itemSelector = that._itemSelector();
        const itemContainer = this._itemContainer();

        eventsEngine.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);
        eventsEngine.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, function(e) {
            that._itemDXEventHandler(e, 'onAppointmentDblClick', {}, {
                afterExecute: function(e) {
                    that._dblClickHandler(e.args[0].event);
                }
            });
        });
    },

    _dblClickHandler: function(e) {
        const $targetAppointment = $(e.currentTarget);
        const appointmentData = this._getItemData($targetAppointment);

        clearTimeout(this._appointmentClickTimeout);
        this._preventSingleAppointmentClick = true;
        this.notifyObserver('showEditAppointmentPopup', { data: appointmentData, target: $targetAppointment });
    },

    _renderItem: function(index, item, container) {
        const itemData = item.itemData;
        const $items = [];

        for(let i = 0; i < item.settings.length; i++) {
            const setting = item.settings[i];
            this._currentAppointmentSettings = setting;
            const $item = this.callBase(index, itemData, container);
            $item.data(APPOINTMENT_SETTINGS_KEY, setting);
            $items.push($item);
        }

        return $items;
    },

    _getItemContent: function($itemFrame) {
        $itemFrame.data(APPOINTMENT_SETTINGS_KEY, this._currentAppointmentSettings);
        const $itemContent = this.callBase($itemFrame);
        return $itemContent;
    },

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        const { itemData, container, index } = renderArgs;

        return itemTemplate.render({
            model: {
                appointmentData: itemData,
                targetedAppointmentData: this.invoke('getTargetedAppointmentData', itemData, $(container).parent())
            },
            container: container,
            index: index
        });
    },

    _getAppointmentContainer: function(allDay) {
        const $allDayContainer = this.option('allDayContainer');
        let $container = this.itemsContainer().not($allDayContainer);

        if(allDay && $allDayContainer) {
            $container = $allDayContainer;
        }

        return $container;
    },

    _postprocessRenderItem: function(args) {
        this._renderAppointment(args.itemElement, this._currentAppointmentSettings);
    },

    _renderAppointment: function($appointment, settings) {
        $appointment.data(APPOINTMENT_SETTINGS_KEY, settings);

        this._applyResourceDataAttr($appointment);
        const data = this._getItemData($appointment);
        const geometry = this.invoke('getAppointmentGeometry', settings);
        const allowResize = this.option('allowResize') && (!isDefined(settings.skipResizing) || isString(settings.skipResizing));
        const allowDrag = this.option('allowDrag');
        const allDay = settings.allDay;
        this.invoke('setCellDataCacheAlias', this._currentAppointmentSettings, geometry);

        const deferredColor = this._getAppointmentColor($appointment, settings.groupIndex);

        if(settings.virtual) {
            this._processVirtualAppointment(settings, $appointment, data, deferredColor);
        } else {
            const { info } = settings;

            this._createComponent($appointment, Appointment, {
                observer: this.option('observer'),
                data: data,
                geometry: geometry,
                direction: settings.direction || 'vertical',
                allowResize: allowResize,
                allowDrag: allowDrag,
                allDay: allDay,
                reduced: settings.appointmentReduced,
                isCompact: settings.isCompact,
                startDate: new Date(info?.appointment.startDate),
                cellWidth: this.invoke('getCellWidth'),
                cellHeight: this.invoke('getCellHeight'),
                resizableConfig: this._resizableConfig(data, settings)
            });

            deferredColor.done(function(color) {
                if(color) {
                    $appointment.css('backgroundColor', color);
                }
            });
        }
    },


    _applyResourceDataAttr: function($appointment) {
        const resources = this.invoke('getResourcesFromItem', this._getItemData($appointment));
        if(resources) {
            each(resources, function(name, values) {
                const attr = 'data-' + normalizeKey(name.toLowerCase()) + '-';
                for(let i = 0; i < values.length; i++) {
                    $appointment.attr(attr + normalizeKey(values[i]), true);
                }
            });
        }
    },

    _resizableConfig: function(appointmentData, itemSetting) {
        return {
            area: this._calculateResizableArea(itemSetting, appointmentData),
            onResizeStart: (function(e) {
                this._$currentAppointment = $(e.element);

                if(this.invoke('needRecalculateResizableArea')) {
                    const updatedArea = this._calculateResizableArea(this._$currentAppointment.data(APPOINTMENT_SETTINGS_KEY), this._$currentAppointment.data('dxItemData'));

                    e.component.option('area', updatedArea);
                    e.component._renderDragOffsets(e.event);
                }

                this._initialSize = { width: e.width, height: e.height };
                this._initialCoordinates = locate(this._$currentAppointment);
            }).bind(this),
            onResizeEnd: (function(e) {
                if(this._escPressed) {
                    e.event.cancel = true;
                    return;
                }

                this._resizeEndHandler(e);
            }).bind(this)
        };
    },

    _calculateResizableArea: function(itemSetting, appointmentData) {
        const area = this.$element().closest('.dx-scrollable-content');

        return this.invoke('getResizableAppointmentArea', {
            coordinates: {
                left: itemSetting.left,
                top: 0,
                groupIndex: itemSetting.groupIndex
            },
            allDay: itemSetting.allDay,
        }) || area;
    },

    _resizeEndHandler: function(e) {
        const scheduler = this.option('observer');
        const $element = $(e.element);

        const { info } = $element.data('dxAppointmentSettings');
        const sourceAppointment = this._getItemData($element);

        const modifiedAppointmentAdapter = scheduler.createAppointmentAdapter(sourceAppointment).clone();

        const startDate = this._getEndResizeAppointmentStartDate(e, sourceAppointment, info.appointment);
        const endDate = info.appointment.endDate;

        const dateRange = this._getDateRange(e, startDate, endDate);

        modifiedAppointmentAdapter.startDate = new Date(dateRange[0]);
        modifiedAppointmentAdapter.endDate = new Date(dateRange[1]);

        this.notifyObserver('updateAppointmentAfterResize', {
            target: sourceAppointment,
            data: modifiedAppointmentAdapter.clone({ pathTimeZone: 'fromGrid' }).source(),
            $appointment: $element
        });
    },
    _getEndResizeAppointmentStartDate: function(e, rawAppointment, appointmentInfo) {
        const scheduler = this.option('observer');
        const appointmentAdapter = scheduler.createAppointmentAdapter(rawAppointment);

        let startDate = appointmentInfo.startDate;
        const recurrenceProcessor = getRecurrenceProcessor();
        const { recurrenceRule, startDateTimeZone } = appointmentAdapter;
        const isAllDay = this.invoke('isAllDay', rawAppointment);
        const isRecurrent = recurrenceProcessor.isValidRecurrenceRule(recurrenceRule);

        if(!e.handles.top && !isRecurrent && !isAllDay) {
            startDate = scheduler.timeZoneCalculator.createDate(
                appointmentAdapter.startDate,
                {
                    appointmentTimeZone: startDateTimeZone,
                    path: 'toGrid'
                },
            );
        }

        return startDate;
    },

    _getDateRange: function(e, startDate, endDate) {
        const itemData = this._getItemData(e.element);
        const deltaTime = this.invoke('getDeltaTime', e, this._initialSize, itemData);
        const renderingStrategyDirection = this.invoke('getRenderingStrategyDirection');
        let isStartDateChanged = false;
        const isAllDay = this.invoke('isAllDay', itemData);
        const needCorrectDates = this.invoke('needCorrectAppointmentDates') && !isAllDay;
        let startTime;
        let endTime;

        if(renderingStrategyDirection !== 'vertical' || isAllDay) {
            isStartDateChanged = this.option('rtlEnabled') ? e.handles.right : e.handles.left;
        } else {
            isStartDateChanged = e.handles.top;
        }

        if(isStartDateChanged) {
            startTime = needCorrectDates ? this._correctStartDateByDelta(startDate, deltaTime) : startDate.getTime() - deltaTime;
            startTime += timeZoneUtils.getTimezoneOffsetChangeInMs(startDate, endDate, startTime, endDate);
            endTime = endDate.getTime();
        } else {
            startTime = startDate.getTime();
            endTime = needCorrectDates ? this._correctEndDateByDelta(endDate, deltaTime) : endDate.getTime() + deltaTime;
            endTime -= timeZoneUtils.getTimezoneOffsetChangeInMs(startDate, endDate, startDate, endTime);
        }

        return [startTime, endTime];
    },

    _correctEndDateByDelta: function(endDate, deltaTime) {
        const endDayHour = this.invoke('getEndDayHour');
        const startDayHour = this.invoke('getStartDayHour');
        let result = endDate.getTime() + deltaTime;
        const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

        const daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
        const maxDate = new Date(endDate);
        const minDate = new Date(endDate);

        minDate.setHours(startDayHour, 0, 0, 0);
        maxDate.setHours(endDayHour, 0, 0, 0);

        if(result > maxDate.getTime() || result <= minDate.getTime()) {
            const tailOfCurrentDay = maxDate.getTime() - endDate.getTime();
            const tailOfPrevDays = deltaTime - tailOfCurrentDay;

            const lastDay = new Date(endDate.setDate(endDate.getDate() + daysCount));
            lastDay.setHours(startDayHour, 0, 0, 0);

            result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
        }
        return result;
    },

    _correctStartDateByDelta: function(startDate, deltaTime) {
        const endDayHour = this.invoke('getEndDayHour');
        const startDayHour = this.invoke('getStartDayHour');
        let result = startDate.getTime() - deltaTime;
        const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

        const daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
        const maxDate = new Date(startDate);
        const minDate = new Date(startDate);

        minDate.setHours(startDayHour, 0, 0, 0);
        maxDate.setHours(endDayHour, 0, 0, 0);

        if(result < minDate.getTime() || result >= maxDate.getTime()) {
            const tailOfCurrentDay = startDate.getTime() - minDate.getTime();
            const tailOfPrevDays = deltaTime - tailOfCurrentDay;

            const firstDay = new Date(startDate.setDate(startDate.getDate() - daysCount));
            firstDay.setHours(endDayHour, 0, 0, 0);

            result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
        }
        return result;
    },

    _tryGetAppointmentColor: function(appointment) {
        const settings = $(appointment).data(APPOINTMENT_SETTINGS_KEY);
        if(!settings) {
            return undefined;
        }
        return this._getAppointmentColor(appointment, settings.groupIndex);
    },

    _getAppointmentColor: function($appointment, groupIndex) {
        const res = new Deferred();
        const response = this.invoke('getAppointmentColor', {
            itemData: this._getItemData($appointment),
            groupIndex: groupIndex,
        });
        response.done(color => res.resolve(color));

        return res.promise();
    },

    _calculateBoundOffset: function() {
        return this.invoke('getBoundOffset');
    },

    _virtualAppointments: {},

    _processVirtualAppointment: function(appointmentSetting, $appointment, appointmentData, color) {
        const virtualAppointment = appointmentSetting.virtual;
        const virtualGroupIndex = virtualAppointment.index;

        if(!isDefined(this._virtualAppointments[virtualGroupIndex])) {
            this._virtualAppointments[virtualGroupIndex] = {
                coordinates: {
                    top: virtualAppointment.top,
                    left: virtualAppointment.left
                },
                items: { data: [], colors: [], settings: [] },
                isAllDay: virtualAppointment.isAllDay ? true : false,
                buttonColor: color
            };
        }

        appointmentSetting.targetedAppointmentData = this.invoke('getTargetedAppointmentData', appointmentData, $appointment);

        this._virtualAppointments[virtualGroupIndex].items.settings.push(appointmentSetting);
        this._virtualAppointments[virtualGroupIndex].items.data.push(appointmentData);
        this._virtualAppointments[virtualGroupIndex].items.colors.push(color);

        $appointment.remove();
    },

    _renderContentImpl: function() {
        this.callBase();
        this._renderDropDownAppointments();
    },

    _renderDropDownAppointments: function() {
        this._renderByFragments(($commonFragment, $allDayFragment) => {
            each(this._virtualAppointments, (function(groupIndex) {
                const virtualGroup = this._virtualAppointments[groupIndex];
                const virtualItems = virtualGroup.items;
                const virtualCoordinates = virtualGroup.coordinates;
                const $fragment = virtualGroup.isAllDay ? $allDayFragment : $commonFragment;
                const left = virtualCoordinates.left;
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
                    isCompact: this.invoke('isAdaptive') || this._isGroupCompact(virtualGroup),
                    applyOffset: !virtualGroup.isAllDay && this.invoke('isApplyCompactAppointmentOffset')
                });
            }).bind(this));
        });
    },

    _isGroupCompact: function(virtualGroup) {
        return !virtualGroup.isAllDay && this.invoke('supportCompactDropDownAppointments');
    },

    _sortAppointmentsByStartDate: function(appointments) {
        appointments.sort((function(a, b) {
            let result = 0;
            const firstDate = new Date(this.invoke('getField', 'startDate', a.settings || a)).getTime();
            const secondDate = new Date(this.invoke('getField', 'startDate', b.settings || b)).getTime();

            if(firstDate < secondDate) {
                result = -1;
            }
            if(firstDate > secondDate) {
                result = 1;
            }

            return result;
        }).bind(this));
    },

    _processRecurrenceAppointment: function(appointment, index, skipLongAppointments) {
        // NOTE: this method is actual only for agenda
        const recurrenceRule = this.invoke('getField', 'recurrenceRule', appointment);
        const result = {
            parts: [],
            indexes: []
        };

        if(recurrenceRule) {
            const dates = appointment.settings || appointment;

            const startDate = new Date(this.invoke('getField', 'startDate', dates));
            const endDate = new Date(this.invoke('getField', 'endDate', dates));
            const appointmentDuration = endDate.getTime() - startDate.getTime();
            const recurrenceException = this.invoke('getField', 'recurrenceException', appointment);
            const startViewDate = this.invoke('getStartViewDate');
            const endViewDate = this.invoke('getEndViewDate');
            const recurrentDates = getRecurrenceProcessor().generateDates({
                rule: recurrenceRule,
                exception: recurrenceException,
                start: startDate,
                end: endDate,
                min: startViewDate,
                max: endViewDate
            });
            const recurrentDateCount = appointment.settings ? 1 : recurrentDates.length;

            for(let i = 0; i < recurrentDateCount; i++) {
                const appointmentPart = extend({}, appointment, true);

                if(recurrentDates[i]) {
                    const appointmentSettings = this._applyStartDateToObj(recurrentDates[i], {});
                    this._applyEndDateToObj(new Date(recurrentDates[i].getTime() + appointmentDuration), appointmentSettings);
                    appointmentPart.settings = appointmentSettings;
                } else {
                    appointmentPart.settings = dates;
                }

                result.parts.push(appointmentPart);

                if(!skipLongAppointments) {
                    this._processLongAppointment(appointmentPart, result);
                }
            }

            result.indexes.push(index);
        }

        return result;
    },

    _processLongAppointment: function(appointment, result) {
        const parts = this.splitAppointmentByDay(appointment);
        const partCount = parts.length;
        const endViewDate = this.invoke('getEndViewDate').getTime();
        const startViewDate = this.invoke('getStartViewDate').getTime();
        const startDateTimeZone = this.invoke('getField', 'startDateTimeZone', appointment);


        result = result || {
            parts: []
        };

        if(partCount > 1) {
            extend(appointment, parts[0]);

            for(let i = 1; i < partCount; i++) {
                let startDate = this.invoke('getField', 'startDate', parts[i].settings).getTime();
                startDate = this.invoke('convertDateByTimezone', startDate, startDateTimeZone);

                if(startDate < endViewDate && startDate > startViewDate) {
                    result.parts.push(parts[i]);
                }
            }
        }

        return result;
    },

    _reduceRecurrenceAppointments: function(recurrenceIndexes, appointments) {
        each(recurrenceIndexes, function(i, index) {
            appointments.splice(index - i, 1);
        });
    },

    _combineAppointments: function(appointments, additionalAppointments) {
        if(additionalAppointments.length) {
            merge(appointments, additionalAppointments);
        }
        this._sortAppointmentsByStartDate(appointments);
    },

    _applyStartDateToObj: function(startDate, obj) {
        this.invoke('setField', 'startDate', obj, startDate);
        return obj;
    },

    _applyEndDateToObj: function(endDate, obj) {
        this.invoke('setField', 'endDate', obj, endDate);
        return obj;
    },

    moveAppointmentBack: function(dragEvent) {
        const $appointment = this._$currentAppointment;
        const size = this._initialSize;
        const coords = this._initialCoordinates;

        if(dragEvent) {
            this._removeDragSourceClassFromDraggedAppointment();

            if(isDeferred(dragEvent.cancel)) {
                dragEvent.cancel.resolve(true);
            } else {
                dragEvent.cancel = true;
            }
        }

        if($appointment && !dragEvent) {
            if(coords) {
                move($appointment, coords);
                delete this._initialSize;
            }
            if(size) {
                $appointment.outerWidth(size.width);
                $appointment.outerHeight(size.height);
                delete this._initialCoordinates;
            }
        }
    },

    focus: function() {
        if(this._$currentAppointment) {
            const focusedElement = getPublicElement(this._$currentAppointment);

            this.option('focusedElement', focusedElement);
            eventsEngine.trigger(focusedElement, 'focus');
        }
    },

    splitAppointmentByDay: function(appointment) {
        const dates = appointment.settings || appointment;

        const originalStartDate = new Date(this.invoke('getField', 'startDate', dates));
        let startDate = dateUtils.makeDate(originalStartDate);
        let endDate = dateUtils.makeDate(this.invoke('getField', 'endDate', dates));
        const startDateTimeZone = this.invoke('getField', 'startDateTimeZone', appointment);
        const endDateTimeZone = this.invoke('getField', 'endDateTimeZone', appointment);
        const maxAllowedDate = this.invoke('getEndViewDate');
        const startDayHour = this.invoke('getStartDayHour');
        const endDayHour = this.invoke('getEndDayHour');
        const appointmentIsLong = this.invoke('appointmentTakesSeveralDays', appointment);
        const result = [];

        startDate = this.invoke('convertDateByTimezone', startDate, startDateTimeZone);
        endDate = this.invoke('convertDateByTimezone', endDate, endDateTimeZone);

        if(startDate.getHours() <= endDayHour && startDate.getHours() >= startDayHour && !appointmentIsLong) {
            result.push(this._applyStartDateToObj(new Date(startDate), {
                appointmentData: appointment
            }));

            startDate.setDate(startDate.getDate() + 1);
        }

        while(appointmentIsLong && startDate.getTime() < endDate.getTime() && startDate < maxAllowedDate) {
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
    },

    _checkStartDate: function(currentDate, originalDate, startDayHour) {
        if(!dateUtils.sameDate(currentDate, originalDate) || currentDate.getHours() <= startDayHour) {
            currentDate.setHours(startDayHour, 0, 0, 0);
        } else {
            currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
        }
    },

    _checkEndDate: function(currentDate, originalDate, endDayHour) {
        if(!dateUtils.sameDate(currentDate, originalDate) || currentDate.getHours() > endDayHour) {
            currentDate.setHours(endDayHour, 0, 0, 0);
        } else {
            currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
        }
    },

    _removeDragSourceClassFromDraggedAppointment: function() {
        const $appointments = this._itemElements().filter(`.${APPOINTMENT_DRAG_SOURCE_CLASS}`);

        $appointments.each((_, element) => {
            const appointmentInstance = $(element).dxSchedulerAppointment('instance');

            appointmentInstance.option('isDragSource', false);
        });
    },

    _setDragSourceAppointment: function(appointment, settings) {
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

}).include(publisherMixin);

registerComponent('dxSchedulerAppointments', SchedulerAppointments);

export default SchedulerAppointments;
