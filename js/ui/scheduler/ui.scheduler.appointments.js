import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import dataUtils from '../../core/element_data';
import translator from '../../animation/translator';
import dateUtils from '../../core/utils/date';
import commonUtils from '../../core/utils/common';
import typeUtils from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import objectUtils from '../../core/utils/object';
import arrayUtils from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { getPublicElement } from '../../core/utils/dom';
import recurrenceUtils from './utils.recurrence';
import registerComponent from '../../core/component_registrator';
import publisherMixin from './ui.scheduler.publisher_mixin';
import Appointment from './ui.scheduler.appointment';
import eventUtils from '../../events/utils';
import dblclickEvent from '../../events/double_click';
import dateLocalization from '../../localization/date';
import messageLocalization from '../../localization/message';
import CollectionWidget from '../collection/ui.collection_widget.edit';
import { Deferred } from '../../core/utils/deferred';

const APPOINTMENT_SETTINGS_NAME = 'dxAppointmentSettings';

const COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';
const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';
const APPOINTMENT_TITLE_CLASS = 'dx-scheduler-appointment-title';
const APPOINTMENT_CONTENT_DETAILS_CLASS = 'dx-scheduler-appointment-content-details';
const APPOINTMENT_DATE_CLASS = 'dx-scheduler-appointment-content-date';
const RECURRING_ICON_CLASS = 'dx-scheduler-appointment-recurrence-icon';
const ALL_DAY_CONTENT_CLASS = 'dx-scheduler-appointment-content-allday';

const DBLCLICK_EVENT_NAME = eventUtils.addNamespace(dblclickEvent.name, 'dxSchedulerAppointment');

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
            let index = focusedAppointment.data(APPOINTMENT_SETTINGS_NAME).sortedIndex;
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
                    this.notifyObserver('deleteAppointment', { data: data, target: e.target });
                    this.notifyObserver('hideAppointmentTooltip');
                }
            }).bind(this),
            tab: tabHandler
        });
    },

    _getAppointmentByIndex: function(sortedIndex) {
        const appointments = this._getAccessAppointments();

        return appointments.filter(function(_, $item) {
            return dataUtils.data($item, APPOINTMENT_SETTINGS_NAME).sortedIndex === sortedIndex;
        }).eq(0);
    },

    _getAccessAppointments: function() {
        return this._itemElements().filter(':visible').not('.dx-state-disabled');
    },

    _resetTabIndex: function($appointment) {
        this._focusTarget().attr('tabIndex', -1);
        $appointment.attr('tabIndex', this.option('tabIndex'));
    },

    _moveFocus: commonUtils.noop,

    _focusTarget: function() {
        return this._itemElements();
    },

    _renderFocusTarget: function() {
        const $appointment = this._getAppointmentByIndex(0);

        this._resetTabIndex($appointment);
    },

    _focusInHandler: function(e) {
        clearTimeout(this._appointmentFocusedTimeout);
        this.callBase.apply(this, arguments);
        this._$currentAppointment = $(e.target);
        this.option('focusedElement', getPublicElement($(e.target)));
        const that = this;

        this._appointmentFocusedTimeout = setTimeout(function() {
            that.notifyObserver('appointmentFocused');
        });
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
        return !typeUtils.isDefined(appointment.needRepaint) || appointment.needRepaint === true;
    },

    _isRepaintAll: function(appointments) {
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
        if(appointment && appointment.needRemove === true) {
            this._clearItem(appointment);
            return;
        }

        if(this._isRepaintAppointment(appointment)) {
            appointment.needRepaint = false;
            !isRepaintAll && this._clearItem(appointment);

            this._renderItem(index, appointment, container);
        }
    },

    _repaintAppointments: function(appointments) {
        const isRepaintAll = this._isRepaintAll(appointments);

        const allDayFragment = $(this._getAppointmentContainer(true));
        const commonFragment = $(this._getAppointmentContainer(false));

        if(isRepaintAll) {
            this._getAppointmentContainer(true).html('');
            this._getAppointmentContainer(false).html('');
        }

        !appointments.length && this._cleanItemContainer();

        appointments.forEach((appointment, index) => {
            const container = this._isAllDayAppointment(appointment) ? allDayFragment : commonFragment;
            this._onEachAppointment(appointment, index, container, isRepaintAll);
        });

        this._applyFragment(allDayFragment, true);
        this._applyFragment(commonFragment, false);
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
        let startDate = model.appointmentData.settings ? new Date(this.invoke('getField', 'startDate', model.appointmentData.settings)) : (data.recurrenceRule ? model.targetedAppointmentData.startDate : data.startDate);
        let endDate = model.appointmentData.settings ? new Date(this.invoke('getField', 'endDate', model.appointmentData.settings)) : (data.recurrenceRule ? model.targetedAppointmentData.endDate : data.endDate);

        if(isNaN(startDate) || isNaN(endDate)) {
            startDate = data.startDate;
            endDate = data.endDate;
        }

        var currentData = extend(data, { startDate: startDate, endDate: endDate });
        var formatText = this.getText(currentData, currentData, 'TIME');

        $('<div>')
            .text(this._createAppointmentTitle(data))
            .addClass(APPOINTMENT_TITLE_CLASS)
            .appendTo($container);

        if(typeUtils.isPlainObject(data)) {
            if(data.html) {
                $container.html(data.html);
            }
        }

        const recurrenceRule = data.recurrenceRule;
        const allDay = data.allDay;
        const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_DETAILS_CLASS);

        $('<div>').addClass(APPOINTMENT_DATE_CLASS).text(formatText.formatDate).appendTo($contentDetails);

        $contentDetails.appendTo($container);

        if(recurrenceRule) {
            $('<span>').addClass(RECURRING_ICON_CLASS + ' dx-icon-repeat').appendTo($container);
        }

        if(allDay) {
            $('<div>')
                .text(' ' + messageLocalization.format('dxScheduler-allDay') + ': ')
                .addClass(ALL_DAY_CONTENT_CLASS)
                .prependTo($contentDetails);
        }
    },

    getText(data, currentData, format) {
        const isAllDay = data.allDay,
            text = this._createAppointmentTitle(data),
            startDateTimeZone = data.startDateTimeZone,
            endDateTimeZone = data.endDateTimeZone,
            startDate = this.invoke('convertDateByTimezone', currentData.startDate, startDateTimeZone),
            endDate = this.invoke('convertDateByTimezone', currentData.endDate, endDateTimeZone);
        return {
            text: text,
            formatDate: this._formatDates(startDate, endDate, isAllDay, format)
        };
    },

    _formatDates: function(startDate, endDate, isAllDay, format) {
        const formatType = format || this._getTypeFormat(startDate, endDate, isAllDay);

        const formatTypes = {
            'DATETIME': function() {
                const dateTimeFormat = 'mediumdatemediumtime',
                    startDateString = dateLocalization.format(startDate, dateTimeFormat) + ' - ';

                const endDateString = (startDate.getDate() === endDate.getDate()) ?
                    dateLocalization.format(endDate, 'shorttime') :
                    dateLocalization.format(endDate, dateTimeFormat);

                return startDateString + endDateString;
            },
            'TIME': function() {
                return dateLocalization.format(startDate, 'shorttime') + ' - ' + dateLocalization.format(endDate, 'shorttime');
            },
            'DATE': function() {
                const dateTimeFormat = 'monthAndDay',
                    startDateString = dateLocalization.format(startDate, dateTimeFormat),
                    isDurationMoreThanDay = (endDate.getTime() - startDate.getTime()) > toMs('day');

                const endDateString = (isDurationMoreThanDay || endDate.getDate() !== startDate.getDate()) ?
                    ' - ' + dateLocalization.format(endDate, dateTimeFormat) :
                    '';

                return startDateString + endDateString;
            }
        };

        return formatTypes[formatType]();
    },

    _getTypeFormat(startDate, endDate, isAllDay) {
        if(isAllDay) {
            return 'DATE';
        }
        if(this.option('currentView') !== 'month' && dateUtils.sameDate(startDate, endDate)) {
            return 'TIME';
        }
        return 'DATETIME';
    },

    _createAppointmentTitle: function(data) {
        if(typeUtils.isPlainObject(data)) {
            return data.text;
        }

        return String(data);
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

        if(e.type === 'keydown' || eventUtils.isFakeClickEvent(e)) {
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

        for(let i = 0; i < item.settings.length; i++) {
            const setting = item.settings[i];
            this._currentAppointmentSettings = setting;
            const $item = this.callBase(index, itemData, container);
            $item.data(APPOINTMENT_SETTINGS_NAME, setting);
        }
    },

    _getItemContent: function($itemFrame) {
        $itemFrame.data(APPOINTMENT_SETTINGS_NAME, this._currentAppointmentSettings);
        const $itemContent = this.callBase($itemFrame);
        return $itemContent;
    },

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        const { itemData, container, index } = renderArgs;
        const recurrenceRule = this.invoke('getField', 'recurrenceRule', itemData);

        return itemTemplate.render({
            model: {
                appointmentData: itemData,
                targetedAppointmentData: this.invoke('getTargetedAppointmentData', itemData, $(container).parent(), !!recurrenceRule)
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
        $appointment.data(APPOINTMENT_SETTINGS_NAME, settings);

        this._applyResourceDataAttr($appointment);
        const data = this._getItemData($appointment);
        const geometry = this.invoke('getAppointmentGeometry', settings);
        const allowResize = !settings.isCompact && this.option('allowResize') && (!typeUtils.isDefined(settings.skipResizing) || typeUtils.isString(settings.skipResizing));
        const allowDrag = this.option('allowDrag');
        const allDay = settings.allDay;
        this.invoke('setCellDataCacheAlias', this._currentAppointmentSettings, geometry);

        const deferredColor = this._getAppointmentColor($appointment, settings.groupIndex);

        if(settings.virtual) {
            this._processVirtualAppointment(settings, $appointment, data, deferredColor);
        } else {
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
                startDate: new Date(settings.startDate),
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
        this.notifyObserver('getResourcesFromItem', {
            itemData: this._getItemData($appointment),
            callback: function(resources) {
                if(resources) {
                    each(resources, function(name, values) {
                        const attr = 'data-' + commonUtils.normalizeKey(name.toLowerCase()) + '-';
                        for(let i = 0; i < values.length; i++) {
                            $appointment.attr(attr + commonUtils.normalizeKey(values[i]), true);
                        }
                    });
                }
            }
        });
    },

    _resizableConfig: function(appointmentData, itemSetting) {
        return {
            area: this._calculateResizableArea(itemSetting, appointmentData),
            onResizeStart: (function(e) {
                this._$currentAppointment = $(e.element);

                if(this.invoke('needRecalculateResizableArea')) {
                    const updatedArea = this._calculateResizableArea(this._$currentAppointment.data(APPOINTMENT_SETTINGS_NAME), this._$currentAppointment.data('dxItemData'));

                    e.component.option('area', updatedArea);
                    e.component._renderDragOffsets(e.event);
                }

                this._initialSize = { width: e.width, height: e.height };
                this._initialCoordinates = translator.locate(this._$currentAppointment);
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
        let area = this.$element().closest('.dx-scrollable-content');

        this.notifyObserver('getResizableAppointmentArea', {
            coordinates: {
                left: itemSetting.left,
                top: 0,
                groupIndex: itemSetting.groupIndex
            },
            allDay: itemSetting.allDay,
            callback: function(result) {
                if(result) {
                    area = result;
                }
            }
        });

        return area;
    },

    _resizeEndHandler: function(e) {
        const $element = $(e.element);
        const itemData = this._getItemData($element);
        const startDate = this.invoke('getStartDate', itemData, true);
        const endDate = this.invoke('getEndDate', itemData, true);

        const dateRange = this._getDateRange(e, startDate, endDate);

        const updatedDates = {};

        this.invoke('setField', 'startDate', updatedDates, new Date(dateRange[0]));
        this.invoke('setField', 'endDate', updatedDates, new Date(dateRange[1]));

        const data = extend({}, itemData, updatedDates);

        this.notifyObserver('updateAppointmentAfterResize', {
            target: itemData,
            data: data,
            $appointment: $element
        });
    },

    _getDateRange: function(e, startDate, endDate) {
        const itemData = this._getItemData(e.element);
        const deltaTime = this.invoke('getDeltaTime', e, this._initialSize, itemData);
        const renderingStrategyDirection = this.invoke('getRenderingStrategyDirection');
        let cond = false;
        const isAllDay = this.invoke('isAllDay', itemData);
        const needCorrectDates = this.invoke('needCorrectAppointmentDates') && !isAllDay;
        let startTime;
        let endTime;

        if(renderingStrategyDirection !== 'vertical' || isAllDay) {
            cond = this.option('rtlEnabled') ? e.handles.right : e.handles.left;
        } else {
            cond = e.handles.top;
        }

        if(cond) {
            startTime = needCorrectDates ? this._correctStartDateByDelta(startDate, deltaTime) : startDate.getTime() - deltaTime;
            endTime = endDate.getTime();
        } else {
            startTime = startDate.getTime();
            endTime = needCorrectDates ? this._correctEndDateByDelta(endDate, deltaTime) : endDate.getTime() + deltaTime;
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
        const settings = $(appointment).data(APPOINTMENT_SETTINGS_NAME);
        if(!settings) {
            return undefined;
        }
        return this._getAppointmentColor(appointment, settings.groupIndex);
    },

    _getAppointmentColor: function($appointment, groupIndex) {
        const res = new Deferred();
        this.notifyObserver('getAppointmentColor', {
            itemData: this._getItemData($appointment),
            groupIndex: groupIndex,
            callback: d => d.done(color => res.resolve(color))
        });

        return res.promise();
    },

    _calculateBoundOffset: function() {
        let result = {
            top: 0
        };

        this.notifyObserver('getBoundOffset', {
            callback: function(offset) {
                result = offset;
            }
        });
        return result;
    },

    _virtualAppointments: {},

    _processVirtualAppointment: function(appointmentSetting, $appointment, appointmentData, color) {
        const virtualAppointment = appointmentSetting.virtual;
        const virtualGroupIndex = virtualAppointment.index;

        if(!typeUtils.isDefined(this._virtualAppointments[virtualGroupIndex])) {
            this._virtualAppointments[virtualGroupIndex] = {
                coordinates: {
                    top: virtualAppointment.top,
                    left: virtualAppointment.left
                },
                items: { data: [], colors: [] },
                isAllDay: virtualAppointment.isAllDay ? true : false,
                buttonColor: color
            };
        }

        appointmentData.settings = [appointmentSetting];
        this._virtualAppointments[virtualGroupIndex].items.data.push(appointmentData);
        this._virtualAppointments[virtualGroupIndex].items.colors.push(color);

        $appointment.remove();
    },

    _renderContentImpl: function() {
        this.callBase();
        this._renderDropDownAppointments();
    },

    _renderDropDownAppointments: function() {
        each(this._virtualAppointments, (function(groupIndex) {
            const virtualGroup = this._virtualAppointments[groupIndex];
            const virtualItems = virtualGroup.items;
            const virtualCoordinates = virtualGroup.coordinates;
            const $container = virtualGroup.isAllDay ? this.option('allDayContainer') : this.$element();
            const left = virtualCoordinates.left;
            const buttonWidth = this.invoke('getDropDownAppointmentWidth', virtualGroup.isAllDay);
            const buttonHeight = this.invoke('getDropDownAppointmentHeight');
            const rtlOffset = this.option('rtlEnabled') ? buttonWidth : 0;

            this.notifyObserver('renderCompactAppointments', {
                $container: $container,
                coordinates: {
                    top: virtualCoordinates.top,
                    left: left + rtlOffset
                },
                items: virtualItems,
                buttonColor: virtualGroup.buttonColor,
                width: buttonWidth - this.option('_collectorOffset'),
                height: buttonHeight,
                onAppointmentClick: this.option('onItemClick'),
                dragBehavior: this.option('dragBehavior'),
                allowDrag: this.option('allowDrag'),
                isCompact: this.invoke('isAdaptive') || this._isGroupCompact(virtualGroup),
                applyOffset: !virtualGroup.isAllDay && this.invoke('isApplyCompactAppointmentOffset')
            });
        }).bind(this));
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
            const recurrentDates = recurrenceUtils.getDatesByRecurrence({
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
            arrayUtils.merge(appointments, additionalAppointments);
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
            if(typeUtils.isDeferred(dragEvent.cancel)) {
                dragEvent.cancel.resolve(true);
            } else {
                dragEvent.cancel = true;
            }
        }

        this.notifyObserver('moveBack');

        if($appointment && !dragEvent) {
            if(coords) {
                translator.move($appointment, coords);
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

        while(appointmentIsLong && startDate.getTime() < endDate.getTime() - 1 && startDate < maxAllowedDate) {
            const currentStartDate = new Date(startDate);
            const currentEndDate = new Date(startDate);

            this._checkStartDate(currentStartDate, originalStartDate, startDayHour);
            this._checkEndDate(currentEndDate, endDate, endDayHour);

            const appointmentData = objectUtils.deepExtendArraySafe({}, appointment, true);
            const appointmentSettings = {};
            this._applyStartDateToObj(currentStartDate, appointmentSettings);
            this._applyEndDateToObj(currentEndDate, appointmentSettings);
            appointmentData.settings = appointmentSettings;
            result.push(appointmentData);

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
    }

}).include(publisherMixin);

registerComponent('dxSchedulerAppointments', SchedulerAppointments);

module.exports = SchedulerAppointments;
