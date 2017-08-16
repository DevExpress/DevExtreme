"use strict";

var $ = require("../../core/renderer"),
    array = require("../../core/utils/array"),
    recurrenceUtils = require("./utils.recurrence"),
    dateUtils = require("../../core/utils/date"),
    each = require("../../core/utils/iterator").each,
    translator = require("../../animation/translator"),
    grep = require("../../core/utils/common").grep,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    dateLocalization = require("../../localization/date"),
    SchedulerTimezones = require("./ui.scheduler.timezones");

var toMs = dateUtils.dateToMilliseconds;

var subscribes = {
    currentViewUpdated: function(currentView) {
        this.option("currentView", currentView);
    },

    currentDateUpdated: function(date) {
        this.option("currentDate", date);
    },

    setCellDataCacheAlias: function(appointment, geometry) {
        this._workSpace.setCellDataCacheAlias(appointment, geometry);
    },

    needCoordinates: function(options) {
        var appointmentData = options.appointmentData,
            startDate = options.startDate,
            endDate = this._getEndDate(appointmentData),
            recurrenceRule = this.fire("getField", "recurrenceRule", appointmentData),
            recurrenceException = this.fire("getField", "recurrenceException", appointmentData),
            dateRange = this._workSpace.getDateRange(),
            startViewDate = this.appointmentTakesAllDay(appointmentData) ? dateUtils.trimTime(new Date(dateRange[0])) : dateRange[0],
            originalStartDate = options.originalStartDate || startDate;

        var recurrenceOptions = {
            rule: recurrenceRule,
            exception: recurrenceException,
            start: originalStartDate,
            end: endDate,
            min: startViewDate,
            max: dateRange[1]
        };

        var dates = recurrenceUtils.getDatesByRecurrence(recurrenceOptions);

        if(!dates.length) {
            dates.push(startDate);
        }

        var itemResources = this._resourcesManager.getResourcesFromItem(appointmentData),
            allDay = this.appointmentTakesAllDay(appointmentData) && this._workSpace.supportAllDayRow();

        options.callback(this._getCoordinates(dates, itemResources, allDay));
    },

    showAppointmentTooltip: function(options) {
        options.skipDateCalculation = true;
        options.$appointment = $(options.target);
        var appointmentData = options.data,
            singleAppointmentData = this._getSingleAppointmentData(appointmentData, options);

        this.showAppointmentTooltip(appointmentData, options.target, singleAppointmentData);
    },

    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip();
    },

    showAddAppointmentPopup: function(appointmentData) {
        var processedData = {};

        each(["startDate", "endDate", "allDay"], (function(_, field) {
            if(appointmentData[field] !== undefined) {
                this.fire("setField", field, processedData, appointmentData[field]);
                delete appointmentData[field];
            }
        }).bind(this));

        this.showAppointmentPopup(extend(processedData, appointmentData), true);
    },

    showEditAppointmentPopup: function(options) {
        var appointmentData = options.data;

        options.$appointment = $(options.target);
        options.skipHoursProcessing = true;

        var singleAppointmentData = this._getSingleAppointmentData(appointmentData, options),
            startDate = this.fire("getField", "startDate", singleAppointmentData);

        this.showAppointmentPopup(appointmentData, false, singleAppointmentData, startDate);
    },

    updateAppointmentAfterResize: function(options) {
        var targetAppointment = options.target,
            singleAppointment = this._getSingleAppointmentData(targetAppointment, options),
            startDate = this.fire("getField", "startDate", singleAppointment),
            updatedData = extend(true, {}, options.data);

        var processedStartDate = this.fire(
            "convertDateByTimezoneBack",
            this.fire("getField", "startDate", updatedData),
            this.fire("getField", "startDateTimeZone", updatedData)
                );

        var processedEndDate = this.fire(
            "convertDateByTimezoneBack",
            this.fire("getField", "endDate", updatedData),
            this.fire("getField", "endDateTimeZone", updatedData)
                );

        this.fire("setField", "startDate", updatedData, processedStartDate);
        this.fire("setField", "endDate", updatedData, processedEndDate);

        this._checkRecurringAppointment(targetAppointment, singleAppointment, startDate, (function() {
            this._updateAppointment(targetAppointment, updatedData, function() {
                this._appointments.moveAppointmentBack();
            });
        }).bind(this));
    },

    updateAppointmentAfterDrag: function(options) {
        var target = options.data,
            updatedData = this._getUpdatedData(options),
            newCellIndex = this._workSpace.getDroppableCellIndex(),
            oldCellIndex = this._workSpace.getCellIndexByCoordinates(options.coordinates),
            becomeAllDay = this.fire("getField", "allDay", updatedData),
            wasAllDay = this.fire("getField", "allDay", target);

        var appointment = extend({}, target, updatedData);

        var movedToAllDay = this._workSpace.supportAllDayRow() && becomeAllDay,
            cellData = this._workSpace.getCellDataByCoordinates(options.coordinates, movedToAllDay),
            movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() && (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);

        if((newCellIndex !== oldCellIndex) || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(target, appointment, cellData.startDate, (function() {

                var processedStartDate = this.fire(
                    "convertDateByTimezoneBack",
                    this.fire("getField", "startDate", updatedData),
                    this.fire("getField", "startDateTimeZone", updatedData)
                    );

                var processedEndDate = this.fire(
                    "convertDateByTimezoneBack",
                    this.fire("getField", "endDate", updatedData),
                    this.fire("getField", "endDateTimeZone", updatedData)
                    );

                this.fire("setField", "startDate", appointment, processedStartDate);
                this.fire("setField", "endDate", appointment, processedEndDate);

                this._updateAppointment(target, appointment, function() {
                    this._appointments.moveAppointmentBack();
                });
            }).bind(this));
        } else {
            this._appointments.moveAppointmentBack();
        }
    },

    deleteAppointment: function(options) {
        options.$appointment = $(options.target);

        var appointmentData = options.data,
            singleAppointmentData = this._getSingleAppointmentData(appointmentData, options),
            startDate = this.fire("getField", "startDate", singleAppointmentData);

        this._checkRecurringAppointment(appointmentData, singleAppointmentData, startDate, (function() {
            this.deleteAppointment(appointmentData);
        }).bind(this), true);
    },

    getResourceForPainting: function() {
        return this._resourcesManager.getResourceForPainting(this._getCurrentViewOption("groups"));
    },

    getAppointmentColor: function(options) {
        var resourcesManager = this._resourcesManager,
            resourceForPainting = resourcesManager.getResourceForPainting(this._getCurrentViewOption("groups")),
            response = $.Deferred().resolve().promise();

        if(resourceForPainting) {
            var field = resourcesManager.getField(resourceForPainting),
                groupIndex = options.groupIndex,
                groups = this._workSpace._getCellGroups(groupIndex),
                resourceValues = array.wrapToArray(resourcesManager.getDataAccessors(field, "getter")(options.itemData)),
                groupId = resourceValues.length ? resourceValues[0] : undefined;

            for(var i = 0; i < groups.length; i++) {
                if(groups[i].name === field) {
                    groupId = groups[i].id;
                    break;
                }
            }

            response = resourcesManager.getResourceColor(field, groupId);
        }
        options.callback(response);
    },

    getHeaderHeight: function() {
        return this._header._$element && parseInt(this._header._$element.outerHeight(), 10);
    },

    getResourcesFromItem: function(options) {
        options.callback(this._resourcesManager.getResourcesFromItem(options.itemData));
    },

    getBoundOffset: function(options) {
        options.callback({ top: -this.getWorkSpaceAllDayHeight() });
    },

    appointmentTakesAllDay: function(options) {
        options.callback(this.appointmentTakesAllDay(options.appointment));
    },

    appointmentTakesSeveralDays: function(appointment) {
        return this._appointmentModel.appointmentTakesSeveralDays(appointment);
    },
        //NOTE: T312051, remove after fix scrollable bug T324196
    appointmentFocused: function() {
        this._workSpace.restoreScrollTop();
    },

    getResizableAppointmentArea: function(options) {
        var area,
            allDay = options.allDay,
            groups = this._getCurrentViewOption("groups");

        if(groups && groups.length && (allDay || this.option("currentView") === "month")) {
            var groupBounds = this._workSpace.getGroupBounds(options.coordinates);
            area = {
                left: groupBounds.left,
                right: groupBounds.right,
                top: 0,
                bottom: 0
            };
        }
        options.callback(area);
    },

    getDraggableAppointmentArea: function(options) {
        options.callback(this.getWorkSpaceScrollableContainer());
    },

    getAppointmentGeometry: function(settings) {
        return this.getLayoutManager().getRenderingStrategyInstance().getAppointmentGeometry(settings);
    },

    isAllDay: function(appointmentData) {
        return this.getLayoutManager().getRenderingStrategyInstance().isAllDay(appointmentData);
    },

    getDeltaTime: function(e, initialSize, itemData) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDeltaTime(e, initialSize, itemData);
    },

    getCompactAppointmentGroupMaxWidth: function() {
        return this.getLayoutManager().getRenderingStrategyInstance().getCompactAppointmentGroupMaxWidth();
    },

    getStartDate: function(appointmentData, skipNormalize) {
        return this._getStartDate(appointmentData, skipNormalize);
    },

    getCellWidth: function() {
        return this._cellWidth;
    },

    getCellHeight: function() {
        return this._cellHeight;
    },

    getEndDate: function(appointmentData) {
        return this._getEndDate(appointmentData);
    },

    getRenderingStrategy: function() {
        return this._getAppointmentsRenderingStrategy();
    },
    correctAppointmentCoordinates: function(options) {
        var isAllDay = options.allDay,
            containerSign = options.isFixedContainer ? -1 : 1;

        var scrollTop = !isAllDay ? this.getWorkSpaceScrollableScrollTop() : 0,
            allDayPanelTopOffset = !isAllDay ? this.getWorkSpaceAllDayHeight() : 0,
            headerHeight = this.getWorkSpaceHeaderPanelHeight(),
            scrollLeft = this.getWorkSpaceScrollableScrollLeft(),
            tableLeftOffset = this.getWorkSpaceDateTableOffset();

        var topOffset = -scrollTop + allDayPanelTopOffset + headerHeight,
            leftOffset = -scrollLeft - tableLeftOffset;

        options.callback({
            top: options.coordinates.top + containerSign * topOffset,
            left: options.coordinates.left + containerSign * leftOffset
        });
    },

    allDayPanelToggled: function() {
        this._appointments.updateDraggablesBoundOffsets();
    },

    formatDates: function(options) {
        var startDate = options.startDate,
            endDate = options.endDate,
            formatType = options.formatType;

        var formatTypes = {
            "DATETIME": function() {
                var dateTimeFormat = "mediumdatemediumtime",
                    startDateString = dateLocalization.format(startDate, dateTimeFormat) + " - ";

                var endDateString = (startDate.getDate() === endDate.getDate()) ?
                        dateLocalization.format(endDate, "shorttime") :
                        dateLocalization.format(endDate, dateTimeFormat);

                return startDateString + endDateString;
            },
            "TIME": function() {
                return dateLocalization.format(startDate, "shorttime") + " - " + dateLocalization.format(endDate, "shorttime");
            },
            "DATE": function() {
                var dateTimeFormat = "monthAndDay",
                    startDateString = dateLocalization.format(startDate, dateTimeFormat),
                    isDurationMoreThanDay = (endDate.getTime() - startDate.getTime()) > 24 * 3600000;

                var endDateString = (isDurationMoreThanDay || endDate.getDate() !== startDate.getDate()) ?
                        " - " + dateLocalization.format(endDate, dateTimeFormat) :
                        "";

                return startDateString + endDateString;
            }
        };

        options.callback(formatTypes[formatType]());
    },

    getFullWeekAppointmentWidth: function(options) {
        var groupIndex = options.groupIndex,
            groupWidth = this._workSpace.getGroupWidth(groupIndex);

        options.callback(groupWidth);
    },

    getMaxAppointmentWidth: function(options) {
        var cellCountToLastViewDate = this._workSpace.getCellCountToLastViewDate(options.date);
        options.callback(cellCountToLastViewDate * this._workSpace.getCellWidth());
    },

    updateAppointmentStartDate: function(options) {
        var appointment = options.appointment,
            firstViewDate = this._workSpace.getStartViewDate(),
            startDate = new Date(options.startDate),
            startDayHour = this._getCurrentViewOption("startDayHour"),
            updatedStartDate;

        if(this.appointmentTakesAllDay(appointment)) {
            updatedStartDate = dateUtils.normalizeDate(startDate, firstViewDate);
        } else {
            if(startDate.getTime() < firstViewDate.getTime()) {
                startDate = firstViewDate;
            }
            updatedStartDate = dateUtils.normalizeDate(options.startDate, new Date(startDate));
        }

        if(updatedStartDate.getHours() < startDayHour) {
            updatedStartDate.setHours(startDayHour);
            updatedStartDate.setMinutes(0);
        }

        options.callback(updatedStartDate);
    },

    updateAppointmentEndDate: function(options) {
        var endDate = new Date(options.endDate),
            endDayHour = this._getCurrentViewOption("endDayHour"),
            updatedEndDate = endDate;

        if(endDate.getHours() >= endDayHour) {
            updatedEndDate.setHours(endDayHour);
            updatedEndDate.setMinutes(0);
        }
        options.callback(updatedEndDate);
    },

    renderDropDownAppointments: function(options) {
        this._dropDownAppointments.render(options, this);
    },

    getGroupCount: function(options) {
        var groupCount = this._workSpace._getGroupCount();
        options.callback(groupCount);
    },

    updateResizableArea: function() {
        var $allResizableElements = this.element().find(".dx-scheduler-appointment.dx-resizable");

        var horizontalResizables = grep($allResizableElements, function(el) {
            var $el = $(el),
                resizableInst = $el.dxResizable("instance"),
                area = resizableInst.option("area");

            return inArray(resizableInst.option("handles"), ["right left", "left right"]) > -1 && typeUtils.isPlainObject(area);
        });

        each(horizontalResizables, (function(_, el) {
            var $el = $(el),
                position = translator.locate($el),
                appointmentData = this._appointments._getItemData($el);

            var area = this._appointments._calculateResizableArea({
                left: position.left
            }, appointmentData);

            $el.dxResizable("instance").option("area", area);

        }).bind(this));
    },

    recurrenceEditorVisibilityChanged: function(options) {
        this.recurrenceEditorVisibilityChanged(options.visible);
    },

    getField: function(field, obj) {
        if(!typeUtils.isDefined(this._dataAccessors.getter[field])) {
            return;
        }

        return this._dataAccessors.getter[field](obj);
    },

    setField: function(field, obj, value) {
        if(!typeUtils.isDefined(this._dataAccessors.setter[field])) {
            return;
        }

        var splitExprStr = this.option(field + "Expr").split("."),
            rootField = splitExprStr[0];

        if(obj[rootField] === undefined && splitExprStr.length > 1) {
            var emptyChain = (function(arr) {
                var result = {},
                    tmp = result,
                    arrLength = arr.length - 1;

                for(var i = 1; i < arrLength; i++) {
                    tmp = tmp[arr[i]] = {};
                }

                return result;
            })(splitExprStr);

            obj[rootField] = emptyChain;
        }

        this._dataAccessors.setter[field](obj, value);
        return obj;
    },

    prerenderFilter: function() {
        var dateRange = this.getWorkSpace().getDateRange(),
            resources = this._resourcesManager.getResourcesData(),
            allDay;

        if(!this.option("showAllDayPanel") && this._workSpace.supportAllDayRow()) {
            allDay = false;
        }

        return this._appointmentModel.filterLoadedAppointments({
            startDayHour: this._getCurrentViewOption("startDayHour"),
            endDayHour: this._getCurrentViewOption("endDayHour"),
            min: dateRange[0],
            max: dateRange[1],
            resources: resources,
            allDay: allDay
        }, this._subscribes["convertDateByTimezone"].bind(this));
    },

    dayHasAppointment: function(day, appointment, trimTime) {
        return this.dayHasAppointment(day, appointment, trimTime);
    },

    createResourcesTree: function() {
        return this._resourcesManager.createResourcesTree(this._loadedResources);
    },

    getResourceTreeLeaves: function(tree, appointmentResources) {
        return this._resourcesManager.getResourceTreeLeaves(tree, appointmentResources);
    },

    createReducedResourcesTree: function() {
        var tree = this._resourcesManager.createResourcesTree(this._loadedResources);

        return this._resourcesManager.reduceResourcesTree(tree, this.getFilteredItems());
    },

    groupAppointmentsByResources: function(appointments) {
        var result = { "0": appointments },
            groups = this._getCurrentViewOption("groups");

        if(groups && groups.length && this._resourcesManager.getResourcesData().length) {
            result = this._resourcesManager.groupAppointmentsByResources(appointments, this._loadedResources);
        }

        var totalResourceCount = 0;

        each(this._loadedResources, function(i, resource) {
            if(!i) {
                totalResourceCount = resource.items.length;
            } else {
                totalResourceCount *= resource.items.length;
            }
        });

        for(var j = 0; j < totalResourceCount; j++) {
            var index = j.toString();

            if(result[index]) {
                continue;
            }

            result[index] = [];
        }

        return result;
    },

    getAgendaRows: function(options) {
        var renderingStrategy = this._layoutManager.getRenderingStrategyInstance(),
            calculateRows = renderingStrategy.calculateRows.bind(renderingStrategy),
            d = $.Deferred();

        function rowsCalculated(appointments) {
            var result = calculateRows(appointments, options.agendaDuration, options.currentDate);
            this._dataSourceLoadedCallback.remove(rowsCalculated);

            d.resolve(result);
        }

        this._dataSourceLoadedCallback.add(rowsCalculated);

        return d.promise();
    },

    getAgendaVerticalStepHeight: function() {
        return this.getWorkSpace().getAgendaVerticalStepHeight();
    },

    getAgendaDuration: function() {
        return this._getCurrentViewOption("agendaDuration");
    },

    getStartViewDate: function() {
        return this.getStartViewDate();
    },

    getEndViewDate: function() {
        return this.getEndViewDate();
    },

    agendaIsReady: function(rows, innerRowOffset, outerRowOffset) {
        var $appts = this.getAppointmentsInstance()._itemElements(),
            total = 0;

        $appts.css("marginBottom", innerRowOffset);

        var applyOffset = function(_, count) {
            var index = count + total - 1;
            $appts.eq(index).css("marginBottom", outerRowOffset);
            total += count;
        };

        for(var i = 0; i < rows.length; i++) {
            each(rows[i], applyOffset);
        }
    },


    getTimezone: function() {
        return this._getTimezoneOffsetByOption();
    },

    getClientTimezoneOffset: function(date) {
        date = date || new Date();
        return SchedulerTimezones.getClientTimezoneOffset(date);
    },

    convertDateByTimezone: function(date, appointmentTimezone) {
        date = new Date(date);

        var clientTzOffset = -(this._subscribes["getClientTimezoneOffset"](date) / 3600000);

        var commonTimezoneOffset = this._getTimezoneOffsetByOption(date);

        var appointmentTimezoneOffset = this._calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== "number") {
            appointmentTimezoneOffset = clientTzOffset;
        }

        var dateInUTC = date.getTime() - clientTzOffset * 3600000;

        date = new Date(dateInUTC + appointmentTimezoneOffset * 3600000);

        if(typeof commonTimezoneOffset === "number") {
            date = new Date(date.getTime() + (commonTimezoneOffset - appointmentTimezoneOffset) * 3600000);
        }

        return date;
    },

    convertDateByTimezoneBack: function(date, appointmentTimezone) {
        date = new Date(date);

        var clientTzOffset = -(this._subscribes["getClientTimezoneOffset"](date) / 3600000);

        var commonTimezoneOffset = this._getTimezoneOffsetByOption(date);

        var appointmentTimezoneOffset = this._calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== "number") {
            appointmentTimezoneOffset = clientTzOffset;
        }

        var dateInUTC = date.getTime() + clientTzOffset * 3600000;

        date = new Date(dateInUTC - appointmentTimezoneOffset * 3600000);

        if(typeof commonTimezoneOffset === "number") {
            date = new Date(date.getTime() - (commonTimezoneOffset - appointmentTimezoneOffset) * 3600000);
        }

        return date;
    },

    getTimezonesDisplayName: function() {
        return SchedulerTimezones.getTimezonesDisplayName();
    },

    getTimezoneDisplayNameById: function(id) {
        return SchedulerTimezones.getTimezoneDisplayNameById(id);
    },

    getSimilarTimezones: function(id) {
        return SchedulerTimezones.getSimilarTimezones(id);
    },

    getTimezonesIdsByDisplayName: function(displayName) {
        return SchedulerTimezones.getTimezonesIdsByDisplayName(displayName);
    },

    getTargetedAppointmentData: function(appointmentData, appointmentElement, appointmentIndex) {
        var recurringData = this._getSingleAppointmentData(appointmentData, {
                skipDateCalculation: true,
                $appointment: appointmentElement
            }),
            result = {};

        extend(true, result, appointmentData, recurringData);

            //TODO: _getSingleAppointmentData already uses a related cell data for appointment that contains info about resources
        this.setTargetedAppointmentResources(result, appointmentElement, appointmentIndex);

        return result;
    },

    getAppointmentDurationInMs: function(options) {
        var startDate = options.startDate,
            endDate = options.endDate,
            allDay = options.allDay,
            appointmentDuration = endDate.getTime() - startDate.getTime(),
            dayDuration = toMs("day"),
            visibleDayDuration = this._getDayDuration() * toMs("hour"),
            result = 0;

        if(allDay) {
            var ceilQuantityOfDays = Math.ceil(appointmentDuration / dayDuration);

            result = ceilQuantityOfDays * visibleDayDuration;
        } else {
            var isDifferentDate = !dateUtils.sameDate(startDate, new Date(endDate.getTime() - 1)),
                floorQuantityOfDays = Math.floor(appointmentDuration / dayDuration),
                tailDuration;

            if(isDifferentDate) {
                var hiddenDayDuration = dayDuration - visibleDayDuration;

                tailDuration = appointmentDuration - (floorQuantityOfDays ? floorQuantityOfDays * dayDuration : hiddenDayDuration);

                var startDayTime = this.option("startDayHour") * toMs("hour"),
                    endPartDuration = endDate - dateUtils.trimTime(endDate);

                if(endPartDuration < startDayTime) {
                    if(floorQuantityOfDays) {
                        tailDuration -= hiddenDayDuration;
                    }

                    tailDuration += startDayTime - endPartDuration;
                }
            } else {
                tailDuration = appointmentDuration % dayDuration;
            }

            if(tailDuration > visibleDayDuration) {
                tailDuration = visibleDayDuration;
            }

            result = floorQuantityOfDays * visibleDayDuration + tailDuration;
        }
        options.callback(result);
    },

    getEndDayHour: function() {
        return this.option("endDayHour");
    },

    getStartDayHour: function() {
        return this.option("startDayHour");
    }

};
module.exports = subscribes;
