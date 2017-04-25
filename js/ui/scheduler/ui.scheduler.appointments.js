"use strict";

var $ = require("jquery"),
    translator = require("../../animation/translator"),
    dateUtils = require("../../core/utils/date"),
    commonUtils = require("../../core/utils/common"),
    recurrenceUtils = require("./utils.recurrence"),
    registerComponent = require("../../core/component_registrator"),
    publisherMixin = require("./ui.scheduler.publisher_mixin"),
    Appointment = require("./ui.scheduler.appointment"),
    VerticalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.vertical"),
    HorizontalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal"),
    HorizontalMonthLineAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month_line"),
    HorizontalMonthAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month"),
    AgendaAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.agenda"),
    eventUtils = require("../../events/utils"),
    dblclickEvent = require("../../events/double_click"),
    dateLocalization = require("../../localization/date"),
    messageLocalization = require("../../localization/message"),
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    Draggable = require("../draggable");

var COMPONENT_CLASS = "dx-scheduler-scrollable-appointments",
    APPOINTMENT_ITEM_CLASS = "dx-scheduler-appointment",
    APPOINTMENT_TITLE_CLASS = "dx-scheduler-appointment-title",
    APPOINTMENT_CONTENT_DETAILS_CLASS = "dx-scheduler-appointment-content-details",
    APPOINTMENT_DATE_CLASS = "dx-scheduler-appointment-content-date",
    RECURRING_ICON_CLASS = "dx-scheduler-appointment-recurrence-icon",
    ALL_DAY_CONTENT_CLASS = "dx-scheduler-appointment-content-allday",

    DBLCLICK_EVENT_NAME = eventUtils.addNamespace(dblclickEvent.name, "dxSchedulerAppointment");

var toMs = dateUtils.dateToMilliseconds;

var RENDERING_STRATEGIES = {
    "horizontal": HorizontalAppointmentsStrategy,
    "horizontalMonth": HorizontalMonthAppointmentsStrategy,
    "horizontalMonthLine": HorizontalMonthLineAppointmentsStrategy,
    "vertical": VerticalAppointmentsStrategy,
    "agenda": AgendaAppointmentsStrategy
};

var SchedulerAppointments = CollectionWidget.inherit({
    _supportedKeys: function() {
        var parent = this.callBase();

        var tabHandler = function(e) {
            var appointments = this._getAccessAppointments(),
                focusedAppointment = appointments.filter(".dx-state-focused"),
                index = focusedAppointment.attr("sortedIndex"),
                lastIndex = appointments.length - 1;

            if((index > 0 && e.shiftKey) || (index < lastIndex && !e.shiftKey)) {
                e.preventDefault();

                e.shiftKey ? index-- : index++;

                var $nextAppointment = this._getAppointmentByIndex(index);
                this._resetTabIndex($nextAppointment);
                $nextAppointment.focus();
            }
        };

        return $.extend(parent, {
            escape: $.proxy(function() {
                this.moveAppointmentBack();
                this._escPressed = true;
            }, this),
            del: $.proxy(function(e) {
                if(this.option("allowDelete")) {
                    e.preventDefault();
                    var data = this._getItemData(e.target);
                    this.notifyObserver("deleteAppointment", { data: data, target: e.target });
                    this.notifyObserver("hideAppointmentTooltip");
                }
            }),
            tab: tabHandler
        });
    },

    _getAppointmentByIndex: function(index) {
        var appointments = this._getAccessAppointments();
        return appointments.filter("[sortedIndex =" + index + "]").eq(0);
    },

    _getAccessAppointments: function() {
        return this._itemElements().filter(":visible").not(".dx-state-disabled");
    },

    _resetTabIndex: function($appointment) {
        this._focusTarget().attr("tabindex", -1);
        $appointment.attr("tabindex", this.option("tabIndex"));
    },

    _moveFocus: $.noop,

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

        this.callBase.apply(this, arguments);
        this._$currentAppointment = $(e.target);
        this.option("focusedElement", $(e.target));
        var that = this;
        setTimeout(function() {
            that.notifyObserver("appointmentFocused");
        });
    },

    _targetIsDisabled: function(e) {
        return $(e.currentTarget).is(".dx-state-disabled, .dx-state-disabled *");
    },

    _focusOutHandler: function() {
        var $appointment = this._getAppointmentByIndex(0);

        this.option("focusedElement", $appointment);
        this.callBase.apply(this, arguments);
    },

    _eventBindingTarget: function() {
        return this._itemContainer();
    },

    _getDefaultOptions: function() {
        return $.extend(this.callBase(), {
            noDataText: null,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            tabIndex: 0,
            appointmentDurationInMinutes: 30,
            fixedContainer: null,
            allDayContainer: null,
            renderingStrategy: "vertical",
            allowDrag: true,
            allowResize: true,
            allowAllDayResize: true,
            onAppointmentDblClick: null
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "renderingStrategy":
                this._initRenderingStrategy();
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
        this._initRenderingStrategy();
        this.element().addClass(COMPONENT_CLASS);
        this._preventSingleAppointmentClick = false;
    },

    _initRenderingStrategy: function() {
        var Strategy = RENDERING_STRATEGIES[this.option("renderingStrategy")];
        this._renderingStrategy = new Strategy(this);
    },

    _renderAppointmentTemplate: function($container, data) {
        $("<div>")
            .text(this._createAppointmentTitle(data))
            .addClass(APPOINTMENT_TITLE_CLASS)
            .appendTo($container);

        if($.isPlainObject(data)) {
            if(data.html) {
                $container.html(data.html);
            }
        }

        var startDate = new Date(data.startDate),
            endDate = new Date(data.endDate),
            recurrenceRule = data.recurrenceRule,
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
        if($.isPlainObject(data)) {
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

    _getStartDate: function(appointment, skipNormalize) {
        var startDate = this.invoke("getField", "startDate", appointment),
            startDateTimeZone = this.invoke("getField", "startDateTimeZone", appointment);

        startDate = this.invoke("convertDateByTimezone", new Date(startDate), startDateTimeZone);

        !skipNormalize && this.notifyObserver("updateAppointmentStartDate", {
            startDate: startDate,
            appointment: appointment,
            callback: function(result) {
                startDate = result;
            }
        });

        return startDate;
    },

    _getEndDate: function(appointment) {
        var endDate = this.invoke("getField", "endDate", appointment);

        if(endDate) {

            var endDateTimeZone = this.invoke("getField", "endDateTimeZone", appointment);

            endDate = this.invoke("convertDateByTimezone", new Date(endDate), endDateTimeZone);

            this.notifyObserver("updateAppointmentEndDate", {
                endDate: endDate,
                callback: function(result) {
                    endDate = result;
                }
            });
        }
        return endDate;
    },

    _itemClickHandler: function(e) {
        this.callBase(e, {}, {
            afterExecute: $.proxy(function(e) {
                this._processItemClick(e.args[0].jQueryEvent);
            }, this)
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

        this._appointmentClickTimeout = setTimeout($.proxy(function() {
            if(!this._preventSingleAppointmentClick && $.contains(document, $target[0])) {
                this.notifyObserver("showAppointmentTooltip", { data: data, target: $target });
            }

            this._preventSingleAppointmentClick = false;
        }, this), 300);
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
        var that = this,
            itemSelector = that._itemSelector();

        this._itemContainer()
            .off(DBLCLICK_EVENT_NAME, itemSelector)
            .on(DBLCLICK_EVENT_NAME, itemSelector, function(e) {
                that._itemJQueryEventHandler(e, "onAppointmentDblClick", {}, {
                    afterExecute: function(e) {
                        that._dblClickHandler(e.args[0].jQueryEvent);
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

    _renderItems: function(items) {
        if(this._isContainerInvisible()) {
            return;
        }

        this.notifyObserver("getCellDimensions", {
            callback: $.proxy(function(width, height, allDayHeight) {
                this._cellWidth = width;
                this._cellHeight = height;
                this._allDayCellHeight = allDayHeight;
            }, this)
        });

        this._positionMap = this._renderingStrategy.createTaskPositionMap(items);
        this.callBase(items);
    },

    _isContainerInvisible: function() {
        var isContainerInvisible = false;
        this.notifyObserver("checkContainerVisibility", {
            callback: function(result) {
                isContainerInvisible = result;
            }
        });

        return isContainerInvisible;
    },

    _renderItem: function(index, itemData) {
        var allDay = this._renderingStrategy.isAllDay(itemData),
            $container = this._getAppointmentContainer(allDay),
            appointmentSettings = this._positionMap[index],
            coordinateCount = appointmentSettings.length;

        for(var i = 0; i < coordinateCount; i++) {
            this._currentAppointmentSettings = appointmentSettings[i];
            this.callBase(index, itemData, $container);
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

        var appointmentData = this._getItemData($appointment),
            geometry = this._renderingStrategy.getAppointmentGeometry(settings),
            allowResize = !settings.isCompact && this.option("allowResize") && (!commonUtils.isDefined(settings.skipResizing) || commonUtils.isString(settings.skipResizing)),
            allowDrag = this.option("allowDrag"),
            allDay = this._renderingStrategy.isAllDay(appointmentData),
            direction = this.option("renderingStrategy") === "vertical" && !allDay ? "vertical" : "horizontal";

        this.invoke("setCellDataCacheAlias", this._currentAppointmentSettings, geometry);

        this._createComponent($appointment, Appointment, {
            observer: this.option("observer"),
            data: appointmentData,
            geometry: geometry,
            direction: direction,
            allowResize: allowResize,
            allowDrag: allowDrag,
            allDay: allDay,
            reduced: settings.appointmentReduced,
            isCompact: settings.isCompact,
            sortedIndex: settings.sortedIndex,
            startDate: settings.startDate,
            cellWidth: this._cellWidth,
            cellHeight: this._cellHeight,
            resizableConfig: this._resizableConfig(appointmentData, settings)
        });

        var deferredColor = this._paintAppointment($appointment, settings.groupIndex);
        if(settings.virtual) {
            deferredColor.done($.proxy(function(color) {
                this._processVirtualAppointment(settings, $appointment, appointmentData, color);
            }, this));
        }

        this._renderDraggable($appointment);
    },

    _applyResourceDataAttr: function($appointment) {
        this.notifyObserver("getResourcesFromItem", {
            itemData: this._getItemData($appointment),
            callback: function(resources) {
                if(resources) {
                    $.each(resources, function(name, values) {
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
            onResizeStart: $.proxy(function(e) {
                this._$currentAppointment = $(e.element);
                this._initialSize = { width: e.width, height: e.height };
                this._initialCoordinates = translator.locate(e.element);
            }, this),
            onResizeEnd: $.proxy(function(e) {
                if(this._escPressed) {
                    e.jQueryEvent.cancel = true;
                    return;
                }

                this._resizeEndHandler(e);
            }, this)
        };
    },

    _calculateResizableArea: function(itemSetting, appointmentData) {
        var area = this.element().closest(".dx-scrollable-content"),
            allDay = this._renderingStrategy.isAllDay(appointmentData);

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
        var itemData = this._getItemData(e.element),
            startDate = this._getStartDate(itemData, true),
            endDate = this._getEndDate(itemData);

        var dateRange = this._getDateRange(e, startDate, endDate);

        var updatedDates = {};

        this.invoke("setField", "startDate", updatedDates, new Date(dateRange[0]));
        this.invoke("setField", "endDate", updatedDates, new Date(dateRange[1]));

        var data = $.extend({}, itemData, updatedDates);

        this.notifyObserver("updateAppointmentAfterResize", {
            target: itemData,
            data: data,
            $appointment: e.element
        });
    },

    _getDateRange: function(e, startDate, endDate) {
        var itemData = this._getItemData(e.element),
            deltaTime = this._renderingStrategy.getDeltaTime(e, this._initialSize, itemData),
            renderingStrategy = this.option("renderingStrategy"),
            cond = false,
            isAllDay = this._renderingStrategy.isAllDay(itemData),
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
        var res = $.Deferred();
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

    _renderDraggable: function($appointment) {
        if(!this.option("allowDrag")) {
            return;
        }

        var that = this,
            appointmentData = that._getItemData($appointment),
            isAllDay = this._renderingStrategy.isAllDay(appointmentData),
            $fixedContainer = this.option("fixedContainer"),
            draggableArea,
            correctCoordinates = function($element, isFixedContainer) {
                var coordinates = translator.locate($element);

                that.notifyObserver("correctAppointmentCoordinates", {
                    coordinates: coordinates,
                    allDay: isAllDay,
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
                var e = args.jQueryEvent;

                that._skipDraggableRestriction(e);

                that.notifyObserver("hideAppointmentTooltip");
                that.notifyObserver("getDragEventTargetElements", {
                    callback: function(result) {
                        if(result) {
                            e.targetElements = result;
                        }
                    }
                });

                $fixedContainer.append($appointment);

                that._$currentAppointment = $(args.element);
                that._initialSize = { width: args.width, height: args.height };
                that._initialCoordinates = translator.locate(args.element);
            },
            onDrag: function(args) {
                correctCoordinates(args.element);
            },
            onDragEnd: function(args) {
                correctCoordinates(args.element, true);
                var $container = that._getAppointmentContainer(isAllDay);
                $container.append($appointment);
                if(this._escPressed) {
                    args.jQueryEvent.cancel = true;
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
        var itemData = this._getItemData(e.element),
            coordinates = this._initialCoordinates;

        this.notifyObserver("updateAppointmentAfterDrag", {
            data: itemData,
            $appointment: e.element,
            coordinates: coordinates
        });
    },

    _virtualAppointments: {},

    _processVirtualAppointment: function(appointmentSetting, $appointment, appointmentData, color) {
        var virtualAppointment = appointmentSetting.virtual,
            virtualGroupIndex = virtualAppointment.index;

        if(!commonUtils.isDefined(this._virtualAppointments[virtualGroupIndex])) {
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

        this._virtualAppointments[virtualGroupIndex].items.data.push(appointmentData);
        this._virtualAppointments[virtualGroupIndex].items.colors.push(color);

        $appointment.remove();
    },

    _renderContentImpl: function() {
        this.callBase();
        this._renderDropDownAppointments();
    },

    _renderDropDownAppointments: function() {
        var buttonWidth = this._renderingStrategy.getCompactAppointmentGroupMaxWidth(),
            rtlOffset = 0,
            that = this;

        if(this.option("rtlEnabled")) {
            rtlOffset = buttonWidth;
        }

        $.each(this._virtualAppointments, $.proxy(function(groupIndex) {
            var virtualGroup = this._virtualAppointments[groupIndex],
                virtualItems = virtualGroup.items,
                virtualCoordinates = virtualGroup.coordinates,
                $container = virtualGroup.isAllDay ? this.option("allDayContainer") : this.element(),
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
                    that._itemJQueryEventHandler(args.jQueryEvent, "onItemClick", mappedAppointmentFields);
                }
            });
        }, this));
    },

    _sortAppointmentsByStartDate: function(appointments) {
        appointments.sort($.proxy(function(a, b) {
            var result = 0,
                firstDate = new Date(this.invoke("getField", "startDate", a)).getTime(),
                secondDate = new Date(this.invoke("getField", "startDate", b)).getTime();

            if(firstDate < secondDate) {
                result = -1;
            }
            if(firstDate > secondDate) {
                result = 1;
            }

            return result;
        }, this));
    },

    _processRecurrenceAppointment: function(appointment, index, skipLongAppointments) {
        var recurrenceRule = this.invoke("getField", "recurrenceRule", appointment),
            result = {
                parts: [],
                indexes: []
            };

        if(recurrenceRule) {
            var startDate = new Date(this.invoke("getField", "startDate", appointment)),
                endDate = new Date(this.invoke("getField", "endDate", appointment)),
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
                recurrentDateCount = recurrentDates.length;

            for(var i = 0; i < recurrentDateCount; i++) {

                var appointmentPart = this._applyStartDateToObj(recurrentDates[i], {
                    appointmentData: appointment
                });

                result.parts.push(appointmentPart);

                this._applyEndDateToObj(new Date(recurrentDates[i].getTime() + appointmentDuration), appointmentPart);

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
            for(var i = 1; i < partCount; i++) {
                var startDate = this.invoke("getField", "startDate", parts[i]).getTime();
                startDate = this.invoke("convertDateByTimezone", startDate, startDateTimeZone);

                if(startDate < endViewDate && startDate > startViewDate) {
                    result.parts.push(parts[i]);
                }
            }
        }

        return result;
    },

    _reduceRecurrenceAppointments: function(recurrenceIndexes, appointments) {
        $.each(recurrenceIndexes, function(i, index) {
            appointments.splice(index - i, 1);
        });
    },

    _combineAppointments: function(appointments, additionalAppointments) {
        if(additionalAppointments.length) {
            $.merge(appointments, additionalAppointments);
        }

        this._sortAppointmentsByStartDate(appointments);

        $.each(appointments, function(i, appointment) {
            if(appointment.appointmentData) {
                appointments[i] = appointment.appointmentData;
            }
        });
    },

    _applyStartDateToObj: function(startDate, obj) {
        if(obj.appointmentData.appointmentData) {
            obj = obj.appointmentData;
        }
        this.invoke("setField", "startDate", obj, startDate);
        return obj;
    },

    _applyEndDateToObj: function(endDate, obj) {
        if(obj.appointmentData.appointmentData) {
            obj = obj.appointmentData;
        }
        this.invoke("setField", "endDate", obj, endDate);
        return obj;
    },

    updateDraggablesBoundOffsets: function() {
        if(this.option("allowDrag")) {
            this.element().find("." + APPOINTMENT_ITEM_CLASS).each($.proxy(function(_, appointmentElement) {
                var $appointment = $(appointmentElement),
                    appointmentData = this._getItemData($appointment);

                if(!this._renderingStrategy.isAllDay(appointmentData)) {
                    Draggable.getInstance($appointment).option("boundOffset", this._calculateBoundOffset());
                }
            }, this));
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
            this.option("focusedElement", $appointment);
            this.option("focusedElement").focus();
        }
    },

    splitAppointmentByDay: function(appointment) {
        var startDate = new Date(this.invoke("getField", "startDate", appointment)),
            endDate = new Date(this.invoke("getField", "endDate", appointment)),
            startDateTimeZone = this.invoke("getField", "startDateTimeZone", appointment),
            endDateTimeZone = this.invoke("getField", "endDateTimeZone", appointment),
            maxAllowedDate = this.invoke("getEndViewDate");

        startDate = this.invoke("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.invoke("convertDateByTimezone", endDate, endDateTimeZone);

        var result = [this._applyStartDateToObj(new Date(startDate), {
            appointmentData: appointment
        })];

        var currentDate = startDate.getDate();
        startDate.setHours(startDate.getHours() + 1);

        while(startDate.getTime() < endDate.getTime() - 1 && startDate.getTime() < maxAllowedDate.getTime()) {
            if(currentDate !== startDate.getDate()) {
                result.push(this._applyStartDateToObj(new Date(startDate), {
                    appointmentData: appointment
                }));
            }

            currentDate = startDate.getDate();
            startDate.setHours(startDate.getHours() + 1);
        }

        return result;
    }

}).include(publisherMixin);

registerComponent("dxSchedulerAppointments", SchedulerAppointments);

module.exports = SchedulerAppointments;
