"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    dataUtils = require("../../core/element_data"),
    translator = require("../../animation/translator"),
    dateUtils = require("../../core/utils/date"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    objectUtils = require("../../core/utils/object"),
    arrayUtils = require("../../core/utils/array"),
    extend = require("../../core/utils/extend").extend,
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    recurrenceUtils = require("./utils.recurrence"),
    registerComponent = require("../../core/component_registrator"),
    publisherMixin = require("./ui.scheduler.publisher_mixin"),
    Appointment = require("./ui.scheduler.appointment"),
    eventUtils = require("../../events/utils"),
    dblclickEvent = require("../../events/double_click"),
    dateLocalization = require("../../localization/date"),
    messageLocalization = require("../../localization/message"),
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    Draggable = require("../draggable"),
    Deferred = require("../../core/utils/deferred").Deferred;

var COMPONENT_CLASS = "dx-scheduler-scrollable-appointments",
    APPOINTMENT_ITEM_CLASS = "dx-scheduler-appointment",
    APPOINTMENT_TITLE_CLASS = "dx-scheduler-appointment-title",
    APPOINTMENT_CONTENT_DETAILS_CLASS = "dx-scheduler-appointment-content-details",
    APPOINTMENT_DATE_CLASS = "dx-scheduler-appointment-content-date",
    RECURRING_ICON_CLASS = "dx-scheduler-appointment-recurrence-icon",
    ALL_DAY_CONTENT_CLASS = "dx-scheduler-appointment-content-allday",

    DBLCLICK_EVENT_NAME = eventUtils.addNamespace(dblclickEvent.name, "dxSchedulerAppointment");

var toMs = dateUtils.dateToMilliseconds;

var SchedulerAppointments = CollectionWidget.inherit({
    _supportedKeys: function() {
        var parent = this.callBase();

        var tabHandler = function(e) {
            var appointments = this._getAccessAppointments(),
                focusedAppointment = appointments.filter(".dx-state-focused"),
                index = focusedAppointment.data("dxAppointmentSettings").sortedIndex,
                lastIndex = appointments.length - 1;

            if((index > 0 && e.shiftKey) || (index < lastIndex && !e.shiftKey)) {
                e.preventDefault();

                e.shiftKey ? index-- : index++;

                var $nextAppointment = this._getAppointmentByIndex(index);
                this._resetTabIndex($nextAppointment);
                eventsEngine.trigger($nextAppointment, "focus");
            }
        };

        return extend(parent, {
            escape: (function() {
                this.moveAppointmentBack();
                this._escPressed = true;
            }).bind(this),
            del: (function(e) {
                if(this.option("allowDelete")) {
                    e.preventDefault();
                    var data = this._getItemData(e.target);
                    this.notifyObserver("deleteAppointment", { data: data, target: e.target });
                    this.notifyObserver("hideAppointmentTooltip");
                }
            }).bind(this),
            tab: tabHandler
        });
    },

    _getAppointmentByIndex: function(sortedIndex) {
        var appointments = this._getAccessAppointments();

        return appointments.filter(function(_, $item) {
            return dataUtils.data($item, "dxAppointmentSettings").sortedIndex === sortedIndex;
        }).eq(0);
    },

    _getAccessAppointments: function() {
        return this._itemElements().filter(":visible").not(".dx-state-disabled");
    },

    _resetTabIndex: function($appointment) {
        this._focusTarget().attr("tabIndex", -1);
        $appointment.attr("tabIndex", this.option("tabIndex"));
    },

    _moveFocus: commonUtils.noop,

    _focusTarget: function() {
        return this._itemElements();
    },

    _renderFocusTarget: function() {
        var $appointment = this._getAppointmentByIndex(0);

        this._resetTabIndex($appointment);
    },

    _focusInHandler: function(e) {
        if(this._targetIsDisabled(e)) {
            e.stopPropagation();
            return;
        }
        clearTimeout(this._appointmentFocusedTimeout);
        this.callBase.apply(this, arguments);
        this._$currentAppointment = $(e.target);
        this.option("focusedElement", getPublicElement($(e.target)));
        var that = this;

        this._appointmentFocusedTimeout = setTimeout(function() {
            that.notifyObserver("appointmentFocused");
        });
    },

    _targetIsDisabled: function(e) {
        return $(e.currentTarget).is(".dx-state-disabled, .dx-state-disabled *");
    },

    _focusOutHandler: function() {
        var $appointment = this._getAppointmentByIndex(0);

        this.option("focusedElement", getPublicElement($appointment));
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
            appointmentDurationInMinutes: 30,
            fixedContainer: null,
            allDayContainer: null,
            allowDrag: true,
            allowResize: true,
            allowAllDayResize: true,
            onAppointmentDblClick: null
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "items":
                this._cleanFocusState();
                this._clearDropDownItems();

                this._repaintAppointments(args.value);
                this._renderDropDownAppointments();

                this._attachAppointmentsEvents();
                break;
            case "fixedContainer":
            case "allDayContainer":
            case "onAppointmentDblClick":
                break;
            case "allowDrag":
            case "allowResize":
            case "allowAllDayResize":
            case "appointmentDurationInMinutes":
                this._invalidate();
                break;
            case "focusedElement":
                this._resetTabIndex($(args.value));
                this.callBase(args);
                break;
            case "allowDelete":
                break;
            default:
                this.callBase(args);
        }
    },

    _repaintAppointments: function(appointments) {
        var itemsLength = appointments.length;

        if(!itemsLength) {
            this._cleanItemContainer();
        }

        for(var i = 0; i < itemsLength; i++) {
            var item = appointments[i];

            if(item && item.needRemove === true) {
                this._clearItem(item);
                appointments.splice(i, 1);
                i--;
                continue;
            }
            if(item && item.needRepaint === false) {
                this._processRenderedAppointment(item);
            }
            if(item && (!typeUtils.isDefined(item.needRepaint) || item.needRepaint === true)) {
                item.needRepaint = false;
                this._clearItem(item);
                this._renderItem(i, item);
            }
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

    _processRenderedAppointment: function(item) {
        var resourceForPainting = this.invoke("getResourceForPainting");

        if(!resourceForPainting) {
            return;
        }

        var $items = this._findItemElementByItem(item.itemData),
            that = this;

        if(!$items.length) {
            return;
        }

        each($items, function(index, $item) {
            that._applyAppointmentColor($item, item.itemData, item.settings[index]);
        });
    },

    _clearItem: function(item) {
        var $items = this._findItemElementByItem(item.itemData);
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

        var $items = this._itemContainer().find(".dx-scheduler-dropdown-appointments");
        if(!$items.length) {
            return;
        }

        each($items, function(_, $item) {
            $($item).detach();
            $($item).remove();
        });
    },

    _findItemElementByItem: function(item) {
        var result = [],
            that = this;

        this.itemElements().each(function() {
            var $item = $(this);
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
        var $container = this.callBase(),
            $result = $container,
            $allDayContainer = this.option("allDayContainer");

        if($allDayContainer) {
            $result = $container.add($allDayContainer);
        }

        return $result;
    },

    _cleanItemContainer: function() {
        this.callBase();
        var $allDayContainer = this.option("allDayContainer");

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

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index
        });
    },

    _renderAppointmentTemplate: function($container, data, model) {
        var startDate = model.settings ? new Date(this.invoke("getField", "startDate", model.settings)) : data.startDate,
            endDate = model.settings ? new Date(this.invoke("getField", "endDate", model.settings)) : data.endDate;


        $("<div>")
            .text(this._createAppointmentTitle(data))
            .addClass(APPOINTMENT_TITLE_CLASS)
            .appendTo($container);

        if(typeUtils.isPlainObject(data)) {
            if(data.html) {
                $container.html(data.html);
            }
        }

        var recurrenceRule = data.recurrenceRule,
            allDay = data.allDay,
            $contentDetails = $("<div>").addClass(APPOINTMENT_CONTENT_DETAILS_CLASS);

        var apptStartTz = data.startDateTimeZone,
            apptEndTz = data.endDateTimeZone;

        startDate = this.invoke("convertDateByTimezone", startDate, apptStartTz);
        endDate = this.invoke("convertDateByTimezone", endDate, apptEndTz);

        $("<div>").addClass(APPOINTMENT_DATE_CLASS).text(dateLocalization.format(startDate, "shorttime")).appendTo($contentDetails);
        $("<div>").addClass(APPOINTMENT_DATE_CLASS).text(" - ").appendTo($contentDetails);
        $("<div>").addClass(APPOINTMENT_DATE_CLASS).text(dateLocalization.format(endDate, "shorttime")).appendTo($contentDetails);

        $contentDetails.appendTo($container);

        if(recurrenceRule) {
            $("<span>").addClass(RECURRING_ICON_CLASS + " dx-icon-repeat").appendTo($container);
        }

        if(allDay) {
            $("<div>")
                .text(" " + messageLocalization.format("dxScheduler-allDay") + ": ")
                .addClass(ALL_DAY_CONTENT_CLASS)
                .prependTo($contentDetails);
        }
    },

    _createAppointmentTitle: function(data) {
        if(typeUtils.isPlainObject(data)) {
            return data.text;
        }

        return String(data);
    },

    _executeItemRenderAction: function(index, itemData, itemElement) {
        var action = this._getItemRenderAction();
        if(action) {
            action({
                appointmentElement: itemElement,
                appointmentData: itemData,
                targetedAppointmentData: this.invoke("getTargetedAppointmentData", itemData, itemElement, index)
            });
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
        var $target = $(e.currentTarget),
            data = this._getItemData($target);

        if(this._targetIsDisabled(e)) {
            e.stopPropagation();
            return;
        }

        if(e.type === "keydown" || eventUtils.isFakeClickEvent(e)) {
            this.notifyObserver("showEditAppointmentPopup", { data: data, target: $target });
            return;
        }

        this._appointmentClickTimeout = setTimeout((function() {
            if(!this._preventSingleAppointmentClick && document.body.contains($target[0])) {
                this.notifyObserver("showAppointmentTooltip", { data: data, target: $target });
            }

            this._preventSingleAppointmentClick = false;
        }).bind(this), 300);
    },

    _extendActionArgs: function() {
        var args = this.callBase.apply(this, arguments);

        return this._mapAppointmentFields(args);
    },

    _mapAppointmentFields: function(args) {
        var result = {
            appointmentData: args.itemData,
            appointmentElement: args.itemElement
        };

        if(args.itemData) {
            result.targetedAppointmentData = this.invoke("getTargetedAppointmentData", args.itemData, args.itemElement, args.itemIndex);
        }

        return result;
    },

    _render: function() {
        this.callBase.apply(this, arguments);

        this._attachAppointmentDblClick();
    },

    _attachAppointmentDblClick: function() {
        var that = this;
        var itemSelector = that._itemSelector();
        var itemContainer = this._itemContainer();

        eventsEngine.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);
        eventsEngine.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, function(e) {
            that._itemDXEventHandler(e, "onAppointmentDblClick", {}, {
                afterExecute: function(e) {
                    that._dblClickHandler(e.args[0].event);
                }
            });
        });
    },

    _dblClickHandler: function(e) {
        var $targetAppointment = $(e.currentTarget),
            appointmentData = this._getItemData($targetAppointment);

        clearTimeout(this._appointmentClickTimeout);
        this._preventSingleAppointmentClick = true;
        this.notifyObserver("showEditAppointmentPopup", { data: appointmentData, target: $targetAppointment });
    },

    _renderItem: function(index, item) {
        var allDay = item.settings.length && item.settings[0].allDay,
            $container = this._getAppointmentContainer(allDay),
            coordinateCount = item.settings.length;

        for(var i = 0; i < coordinateCount; i++) {
            this._currentAppointmentSettings = item.settings[i];

            var $item = this.callBase(index, item.itemData, $container);
            $item.data("dxAppointmentSettings", item.settings[i]);
        }
    },

    _getAppointmentContainer: function(allDay) {
        var $allDayContainer = this.option("allDayContainer"),
            $container = this.itemsContainer().not($allDayContainer);

        if(allDay && $allDayContainer) {
            $container = $allDayContainer;
        }

        return $container;
    },

    _postprocessRenderItem: function(args) {
        this._renderAppointment(args.itemElement, this._currentAppointmentSettings);
    },

    _renderAppointment: function($appointment, settings) {
        this._applyResourceDataAttr($appointment);
        var data = this._getItemData($appointment),
            geometry = this.invoke("getAppointmentGeometry", settings),
            allowResize = !settings.isCompact && this.option("allowResize") && (!typeUtils.isDefined(settings.skipResizing) || typeUtils.isString(settings.skipResizing)),
            allowDrag = this.option("allowDrag"),
            allDay = settings.allDay;
        this.invoke("setCellDataCacheAlias", this._currentAppointmentSettings, geometry);

        this._createComponent($appointment, Appointment, {
            observer: this.option("observer"),
            data: data,
            geometry: geometry,
            direction: settings.direction || "vertical",
            allowResize: allowResize,
            allowDrag: allowDrag,
            allDay: allDay,
            reduced: settings.appointmentReduced,
            isCompact: settings.isCompact,
            startDate: settings.startDate,
            cellWidth: this.invoke("getCellWidth"),
            cellHeight: this.invoke("getCellHeight"),
            resizableConfig: this._resizableConfig(data, settings)
        });

        this._applyAppointmentColor($appointment, data, settings);
        this._renderDraggable($appointment, allDay);
    },

    _applyAppointmentColor: function($appointment, appointmentData, settings) {
        var deferredColor = this._paintAppointment($appointment, settings.groupIndex);
        if(settings.virtual) {
            deferredColor.done((function(color) {
                this._processVirtualAppointment(settings, $appointment, appointmentData, color);
            }).bind(this));
        }
    },

    _applyResourceDataAttr: function($appointment) {
        this.notifyObserver("getResourcesFromItem", {
            itemData: this._getItemData($appointment),
            callback: function(resources) {
                if(resources) {
                    each(resources, function(name, values) {
                        var attr = "data-" + commonUtils.normalizeKey(name.toLowerCase()) + "-";
                        for(var i = 0; i < values.length; i++) {
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
        var area = this.$element().closest(".dx-scrollable-content"),
            allDay = itemSetting.allDay;

        this.notifyObserver("getResizableAppointmentArea", {
            coordinates: {
                left: itemSetting.left,
                top: 0
            },
            allDay: allDay,
            callback: function(result) {
                if(result) {
                    area = result;
                }
            }
        });

        return area;
    },

    _resizeEndHandler: function(e) {
        var $element = $(e.element),
            itemData = this._getItemData($element),
            startDate = this.invoke("getStartDate", itemData, true),
            endDate = this.invoke("getEndDate", itemData);

        var dateRange = this._getDateRange(e, startDate, endDate);

        var updatedDates = {};

        this.invoke("setField", "startDate", updatedDates, new Date(dateRange[0]));
        this.invoke("setField", "endDate", updatedDates, new Date(dateRange[1]));

        var data = extend({}, itemData, updatedDates);

        this.notifyObserver("updateAppointmentAfterResize", {
            target: itemData,
            data: data,
            $appointment: $element
        });
    },

    _getDateRange: function(e, startDate, endDate) {
        var itemData = this._getItemData(e.element),
            deltaTime = this.invoke("getDeltaTime", e, this._initialSize, itemData),
            renderingStrategy = this.invoke("getRenderingStrategy"),
            cond = false,
            isAllDay = this.invoke("isAllDay", itemData),
            needCorrectDates = renderingStrategy !== "horizontalMonth" && !isAllDay,
            startTime,
            endTime;

        if(renderingStrategy !== "vertical" || isAllDay) {
            cond = this.option("rtlEnabled") ? e.handles.right : e.handles.left;
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
        var endDayHour = this.invoke("getEndDayHour"),
            startDayHour = this.invoke("getStartDayHour"),
            result = endDate.getTime() + deltaTime,
            visibleDayDuration = (endDayHour - startDayHour) * toMs("hour");

        var daysCount = Math.ceil(deltaTime / visibleDayDuration),
            maxDate = new Date(endDate);

        maxDate.setHours(endDayHour);

        if(result > maxDate.getTime()) {
            var tailOfCurrentDay = maxDate.getTime() - endDate.getTime(),
                tailOfPrevDays = deltaTime - tailOfCurrentDay;

            var lastDay = new Date(endDate.setDate(endDate.getDate() + daysCount));
            lastDay.setHours(startDayHour);

            result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
        }
        return result;
    },

    _correctStartDateByDelta: function(startDate, deltaTime) {
        var endDayHour = this.invoke("getEndDayHour"),
            startDayHour = this.invoke("getStartDayHour"),
            result = startDate.getTime() - deltaTime,
            visibleDayDuration = (endDayHour - startDayHour) * toMs("hour");

        var daysCount = Math.ceil(deltaTime / visibleDayDuration),
            minDate = new Date(startDate);

        minDate.setHours(startDayHour);

        if(result < minDate.getTime()) {
            var tailOfCurrentDay = startDate.getTime() - minDate.getTime(),
                tailOfPrevDays = deltaTime - tailOfCurrentDay;

            var firstDay = new Date(startDate.setDate(startDate.getDate() - daysCount));
            firstDay.setHours(endDayHour);

            result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
        }
        return result;
    },

    _paintAppointment: function($appointment, groupIndex) {
        var res = new Deferred();
        this.notifyObserver("getAppointmentColor", {
            itemData: this._getItemData($appointment),
            groupIndex: groupIndex,
            callback: function(d) {
                d.done(function(color) {
                    if(color) {
                        $appointment.css("background-color", color);
                    }
                    res.resolve(color);
                });
            }
        });

        return res.promise();
    },

    _renderDraggable: function($appointment, allDay) {
        if(!this.option("allowDrag")) {
            return;
        }

        var that = this,
            $fixedContainer = this.option("fixedContainer"),
            draggableArea,
            correctCoordinates = function(element, isFixedContainer) {
                var coordinates = translator.locate($(element));

                that.notifyObserver("correctAppointmentCoordinates", {
                    coordinates: coordinates,
                    allDay: allDay,
                    isFixedContainer: isFixedContainer,
                    callback: function(result) {
                        if(result) {
                            coordinates = result;
                        }
                    }
                });

                translator.move($appointment, coordinates);
            };

        this.notifyObserver("getDraggableAppointmentArea", {
            callback: function(result) {
                if(result) {
                    draggableArea = result;
                }
            }
        });

        this._createComponent($appointment, Draggable, {
            area: draggableArea,
            boundOffset: that._calculateBoundOffset(),
            immediate: false,
            onDragStart: function(args) {
                var e = args.event;

                that._skipDraggableRestriction(e);

                that.notifyObserver("hideAppointmentTooltip");
                $fixedContainer.append($appointment);

                that._$currentAppointment = $(args.element);
                that._initialSize = { width: args.width, height: args.height };
                that._initialCoordinates = translator.locate(that._$currentAppointment);
            },
            onDrag: function(args) {
                correctCoordinates(args.element);
            },
            onDragEnd: function(args) {
                correctCoordinates(args.element, true);
                var $container = that._getAppointmentContainer(allDay);
                $container.append($appointment);
                if(this._escPressed) {
                    args.event.cancel = true;
                    return;
                }

                that._dragEndHandler(args);
            }
        });
    },

    _calculateBoundOffset: function() {
        var result = {
            top: 0
        };

        this.notifyObserver("getBoundOffset", {
            callback: function(offset) {
                result = offset;
            }
        });
        return result;
    },

    _skipDraggableRestriction: function(e) {
        if(this.option("rtlEnabled")) {
            e.maxLeftOffset = null;
        } else {
            e.maxRightOffset = null;
        }
        e.maxBottomOffset = null;
    },

    _dragEndHandler: function(e) {
        var $element = $(e.element),
            itemData = this._getItemData($element),
            coordinates = this._initialCoordinates;

        this.notifyObserver("updateAppointmentAfterDrag", {
            data: itemData,
            $appointment: $element,
            coordinates: coordinates
        });
    },

    _virtualAppointments: {},

    _processVirtualAppointment: function(appointmentSetting, $appointment, appointmentData, color) {
        var virtualAppointment = appointmentSetting.virtual,
            virtualGroupIndex = virtualAppointment.index;

        if(!typeUtils.isDefined(this._virtualAppointments[virtualGroupIndex])) {
            this._virtualAppointments[virtualGroupIndex] = {
                coordinates: {
                    top: virtualAppointment.top,
                    left: virtualAppointment.left
                },
                items: { data: [], colors: [] },
                isAllDay: virtualAppointment.isAllDay,
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
        var buttonWidth = this.invoke("getCompactAppointmentGroupMaxWidth"),
            rtlOffset = 0,
            that = this;

        if(this.option("rtlEnabled")) {
            rtlOffset = buttonWidth;
        }

        each(this._virtualAppointments, (function(groupIndex) {
            var virtualGroup = this._virtualAppointments[groupIndex],
                virtualItems = virtualGroup.items,
                virtualCoordinates = virtualGroup.coordinates,
                $container = virtualGroup.isAllDay ? this.option("allDayContainer") : this.$element(),
                left = virtualCoordinates.left;

            this.notifyObserver("renderDropDownAppointments", {
                $container: $container,
                coordinates: {
                    top: virtualCoordinates.top,
                    left: left + rtlOffset
                },
                items: virtualItems,
                buttonColor: virtualGroup.buttonColor,
                itemTemplate: this.option("itemTemplate"),
                buttonWidth: buttonWidth,
                onAppointmentClick: function(args) {
                    var mappedAppointmentFields = that._mapAppointmentFields(args);
                    that._itemDXEventHandler(args.event, "onItemClick", mappedAppointmentFields);
                }
            });
        }).bind(this));
    },

    _sortAppointmentsByStartDate: function(appointments) {
        appointments.sort((function(a, b) {
            var result = 0,
                firstDate = new Date(this.invoke("getField", "startDate", a.settings || a)).getTime(),
                secondDate = new Date(this.invoke("getField", "startDate", b.settings || b)).getTime();

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
        var recurrenceRule = this.invoke("getField", "recurrenceRule", appointment),
            result = {
                parts: [],
                indexes: []
            };

        if(recurrenceRule) {
            var dates = appointment.settings || appointment;

            var startDate = new Date(this.invoke("getField", "startDate", dates)),
                endDate = new Date(this.invoke("getField", "endDate", dates)),
                appointmentDuration = endDate.getTime() - startDate.getTime(),
                recurrenceException = this.invoke("getField", "recurrenceException", appointment),
                startViewDate = this.invoke("getStartViewDate"),
                endViewDate = this.invoke("getEndViewDate"),
                recurrentDates = recurrenceUtils.getDatesByRecurrence({
                    rule: recurrenceRule,
                    exception: recurrenceException,
                    start: startDate,
                    end: endDate,
                    min: startViewDate,
                    max: endViewDate
                }),
                recurrentDateCount = appointment.settings ? 1 : recurrentDates.length;

            for(var i = 0; i < recurrentDateCount; i++) {
                var appointmentPart = extend({}, appointment, true);

                if(recurrentDates[i]) {
                    var appointmentSettings = this._applyStartDateToObj(recurrentDates[i], {});
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
        var parts = this.splitAppointmentByDay(appointment),
            partCount = parts.length,
            endViewDate = this.invoke("getEndViewDate").getTime(),
            startViewDate = this.invoke("getStartViewDate").getTime(),
            startDateTimeZone = this.invoke("getField", "startDateTimeZone", appointment);


        result = result || {
            parts: []
        };

        if(partCount > 1) {
            extend(appointment, parts[0]);

            for(var i = 1; i < partCount; i++) {
                var startDate = this.invoke("getField", "startDate", parts[i].settings).getTime();
                startDate = this.invoke("convertDateByTimezone", startDate, startDateTimeZone);

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
        this.invoke("setField", "startDate", obj, startDate);
        return obj;
    },

    _applyEndDateToObj: function(endDate, obj) {
        this.invoke("setField", "endDate", obj, endDate);
        return obj;
    },

    updateDraggablesBoundOffsets: function() {
        if(this.option("allowDrag")) {
            this.$element().find("." + APPOINTMENT_ITEM_CLASS).each((function(_, appointmentElement) {
                var $appointment = $(appointmentElement),
                    appointmentData = this._getItemData($appointment);

                if(!this.invoke("isAllDay", appointmentData)) {
                    Draggable.getInstance($appointment).option("boundOffset", this._calculateBoundOffset());
                }
            }).bind(this));
        }
    },

    moveAppointmentBack: function() {
        var $appointment = this._$currentAppointment,
            size = this._initialSize,
            coords = this._initialCoordinates;

        if($appointment) {
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
        var $appointment = this._$currentAppointment;
        if($appointment) {
            this.option("focusedElement", getPublicElement($appointment));
            eventsEngine.trigger(this.option("focusedElement"), "focus");
        }
    },

    splitAppointmentByDay: function(appointment) {
        var dates = appointment.settings || appointment;

        var originalStartDate = new Date(this.invoke("getField", "startDate", dates)),
            startDate = dateUtils.makeDate(originalStartDate),
            endDate = dateUtils.makeDate(this.invoke("getField", "endDate", dates)),
            startDateTimeZone = this.invoke("getField", "startDateTimeZone", appointment),
            endDateTimeZone = this.invoke("getField", "endDateTimeZone", appointment),
            maxAllowedDate = this.invoke("getEndViewDate"),
            startDayHour = this.invoke("getStartDayHour"),
            endDayHour = this.invoke("getEndDayHour"),
            appointmentIsLong = this.invoke("appointmentTakesSeveralDays", appointment),
            result = [];

        startDate = this.invoke("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.invoke("convertDateByTimezone", endDate, endDateTimeZone);

        if(startDate.getHours() <= endDayHour && startDate.getHours() >= startDayHour && !appointmentIsLong) {
            result.push(this._applyStartDateToObj(new Date(startDate), {
                appointmentData: appointment
            }));

            startDate.setDate(startDate.getDate() + 1);
        }

        while(appointmentIsLong && startDate.getTime() < endDate.getTime() - 1 && startDate < maxAllowedDate) {
            var currentStartDate = new Date(startDate),
                currentEndDate = new Date(startDate);

            this._checkStartDate(currentStartDate, originalStartDate, startDayHour);
            this._checkEndDate(currentEndDate, endDate, endDayHour);

            var appointmentData = objectUtils.deepExtendArraySafe({}, appointment, true),
                appointmentSettings = {};
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
            currentDate.setHours(startDayHour);
            currentDate.setMinutes(0);
        } else {
            currentDate.setHours(originalDate.getHours());
            currentDate.setMinutes(originalDate.getMinutes());
        }
    },

    _checkEndDate: function(currentDate, originalDate, endDayHour) {
        if(!dateUtils.sameDate(currentDate, originalDate) || currentDate.getHours() > endDayHour) {
            currentDate.setHours(endDayHour);
            currentDate.setMinutes(0);
        } else {
            currentDate.setHours(originalDate.getHours());
            currentDate.setMinutes(originalDate.getMinutes());
        }
    }

}).include(publisherMixin);

registerComponent("dxSchedulerAppointments", SchedulerAppointments);

module.exports = SchedulerAppointments;
