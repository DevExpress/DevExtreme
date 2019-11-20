import $ from "../../core/renderer";
import array from "../../core/utils/array";
import recurrenceUtils from "./utils.recurrence";
import typeUtils from "../../core/utils/type";
import dateUtils from "../../core/utils/date";
import { each } from "../../core/utils/iterator";
import translator from "../../animation/translator";
import { grep } from "../../core/utils/common";
import { extend } from "../../core/utils/extend";
import { inArray } from "../../core/utils/array";
import dateLocalization from "../../localization/date";
import SchedulerTimezones from "./timezones/ui.scheduler.timezones";
import { Deferred } from "../../core/utils/deferred";

const MINUTES_IN_HOUR = 60;
const toMs = dateUtils.dateToMilliseconds;

const subscribes = {
    isCurrentViewAgenda: function() {
        return this.option("currentView") === "agenda";
    },
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
        let appointmentData = options.appointmentData,
            startDate = options.startDate,
            endDate = this._getEndDate(appointmentData),
            recurrenceRule = this.fire("getField", "recurrenceRule", appointmentData),
            recurrenceException = this._getRecurrenceException(appointmentData),
            dateRange = this._workSpace.getDateRange(),
            allDay = this.appointmentTakesAllDay(appointmentData),
            startViewDate = this.appointmentTakesAllDay(appointmentData) ? dateUtils.trimTime(new Date(dateRange[0])) : dateRange[0],
            originalStartDate = options.originalStartDate || startDate,
            renderingStrategy = this.getLayoutManager().getRenderingStrategyInstance(),
            firstDayOfWeek = this.getFirstDayOfWeek();

        let recurrenceOptions = {
            rule: recurrenceRule,
            exception: recurrenceException,
            start: originalStartDate,
            end: endDate,
            min: startViewDate,
            max: dateRange[1],
            firstDayOfWeek: firstDayOfWeek
        };

        let dates = recurrenceUtils.getDatesByRecurrence(recurrenceOptions),
            initialDates;

        if(!dates.length) {
            dates.push(startDate);
            initialDates = dates;
        } else {
            initialDates = dates;
            dates = dates.map((date) => {
                return dateUtils.roundDateByStartDayHour(date, this._getCurrentViewOption("startDayHour"));
            });
        }

        if(renderingStrategy.needSeparateAppointment(allDay)) {
            let datesLength = dates.length,
                longParts = [],
                resultDates = [];

            for(let i = 0; i < datesLength; i++) {
                let endDateOfPart = renderingStrategy.endDate(appointmentData, {
                    startDate: dates[i]
                }, !!recurrenceRule);

                longParts = dateUtils.getDatesOfInterval(dates[i], endDateOfPart, {
                    milliseconds: this.getWorkSpace().getIntervalDuration(allDay)
                });
                const maxDate = new Date(dateRange[1]);
                resultDates = resultDates.concat(longParts.filter(el => new Date(el) < maxDate));
            }

            dates = resultDates;
        }

        let itemResources = this._resourcesManager.getResourcesFromItem(appointmentData);
        allDay = this.appointmentTakesAllDay(appointmentData) && this._workSpace.supportAllDayRow();
        options.callback(this._getCoordinates(initialDates, dates, itemResources, allDay));
    },

    isGroupedByDate: function() {
        return this.getWorkSpace().isGroupedByDate();
    },

    showAppointmentTooltip: function(options) {
        options.skipDateCalculation = true;
        options.$appointment = $(options.target);
        let appointmentData = options.data,
            singleAppointmentData = this._getSingleAppointmentData(appointmentData, options);

        this.showAppointmentTooltip(appointmentData, options.target, singleAppointmentData);
    },

    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip();
    },

    showAddAppointmentPopup: function(appointmentData) {
        let processedData = {};

        each(["startDate", "endDate", "allDay"], (function(_, field) {
            if(appointmentData[field] !== undefined) {
                this.fire("setField", field, processedData, appointmentData[field]);
                delete appointmentData[field];
            }
        }).bind(this));

        this.showAppointmentPopup(extend(processedData, appointmentData), true);
    },

    showEditAppointmentPopup: function(options) {
        let appointmentData = options.data;

        options.$appointment = $(options.target);
        options.skipHoursProcessing = true;

        let singleAppointmentData = this._getSingleAppointmentData(appointmentData, options),
            startDate = this.fire("getField", "startDate", singleAppointmentData);

        this.showAppointmentPopup(appointmentData, false, singleAppointmentData, startDate);
    },

    updateAppointmentAfterResize: function(options) {
        let targetAppointment = options.target,
            singleAppointment = this._getSingleAppointmentData(targetAppointment, options),
            startDate = this.fire("getField", "startDate", singleAppointment),
            updatedData = extend(true, {}, options.data);

        this._convertDatesByTimezoneBack(true, updatedData);

        this._checkRecurringAppointment(targetAppointment, singleAppointment, startDate, (function() {
            this._updateAppointment(targetAppointment, updatedData, function() {
                this._appointments.moveAppointmentBack();
            });
        }).bind(this));
    },

    getUpdatedData: function(options) {
        return this._getUpdatedData({ data: options.data });
    },

    updateAppointmentAfterDrag: function(options) {
        let target = options.data,
            updatedData = this._getUpdatedData(options),
            newCellIndex = this._workSpace.getDroppableCellIndex(),
            oldCellIndex = this._workSpace.getCellIndexByCoordinates(options.coordinates),
            becomeAllDay = this.fire("getField", "allDay", updatedData),
            wasAllDay = this.fire("getField", "allDay", target),
            dragEvent = options.event;

        let appointment = extend({}, target, updatedData);

        let movedToAllDay = this._workSpace.supportAllDayRow() && becomeAllDay,
            cellData = this._workSpace.getCellDataByCoordinates(options.coordinates, movedToAllDay),
            movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() && (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);

        if((newCellIndex !== oldCellIndex) || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(target, appointment, cellData.startDate, (function() {

                this._convertDatesByTimezoneBack(true, updatedData, appointment);

                this._updateAppointment(target, appointment, function() {
                    this._appointments.moveAppointmentBack(dragEvent);
                }, dragEvent);
            }).bind(this), undefined, undefined, dragEvent);
        } else {
            this._appointments.moveAppointmentBack(dragEvent);
        }
    },

    deleteAppointment: function(options) {
        options.$appointment = $(options.target);

        let appointmentData = options.data,
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
        let resourcesManager = this._resourcesManager,
            resourceForPainting = resourcesManager.getResourceForPainting(this._getCurrentViewOption("groups")),
            response = new Deferred().resolve().promise();

        if(resourceForPainting) {
            let field = resourcesManager.getField(resourceForPainting),
                groupIndex = options.groupIndex,
                groups = this._workSpace._getCellGroups(groupIndex),
                resourceValues = array.wrapToArray(resourcesManager.getDataAccessors(field, "getter")(options.itemData)),
                groupId = resourceValues.length ? resourceValues[0] : undefined;

            for(let i = 0; i < groups.length; i++) {
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
    // NOTE: T312051, remove after fix scrollable bug T324196
    appointmentFocused: function() {
        this._workSpace.restoreScrollTop();
    },

    getResizableAppointmentArea: function(options) {
        let area,
            allDay = options.allDay,
            groups = this._getCurrentViewOption("groups"),
            isGrouped = groups && groups.length;

        if(isGrouped) {
            if(allDay || this.getLayoutManager().getRenderingStrategyInstance()._needHorizontalGroupBounds()) {
                let horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                area = {
                    left: horizontalGroupBounds.left,
                    right: horizontalGroupBounds.right,
                    top: 0,
                    bottom: 0
                };
            }

            if(this.getLayoutManager().getRenderingStrategyInstance()._needVerticalGroupBounds(allDay) && this._workSpace._isVerticalGroupedWorkSpace()) {
                let verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                area = {
                    left: 0,
                    right: 0,
                    top: verticalGroupBounds.top,
                    bottom: verticalGroupBounds.bottom
                };
            }
        }

        options.callback(area);
    },

    needRecalculateResizableArea: function() {
        return this.getWorkSpace().needRecalculateResizableArea();
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

    getDropDownAppointmentWidth: function(isAllDay) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentWidth(this._getViewCountConfig().intervalCount, isAllDay);
    },

    getDropDownAppointmentHeight: function() {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentHeight();
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

    getResizableStep: function() {
        let cellWidth = this._cellWidth,
            workSpace = this.getWorkSpace();

        if(workSpace.isGroupedByDate()) {
            return workSpace._getGroupCount() * cellWidth;
        }

        return cellWidth;
    },

    getEndDate: function(appointmentData, skipNormalize) {
        return this._getEndDate(appointmentData, skipNormalize);
    },

    getRenderingStrategy: function() {
        return this._getAppointmentsRenderingStrategy();
    },

    needCorrectAppointmentDates: function() {
        return this.getRenderingStrategyInstance().needCorrectAppointmentDates();
    },

    getRenderingStrategyDirection: function() {
        return this.getRenderingStrategyInstance().getDirection();
    },

    getWorkSpaceDateTableOffset: function() {
        return this.getWorkSpaceDateTableOffset();
    },

    formatDates: function(options) {
        let startDate = options.startDate,
            endDate = options.endDate,
            formatType = options.formatType;

        let formatTypes = {
            "DATETIME": function() {
                let dateTimeFormat = "mediumdatemediumtime",
                    startDateString = dateLocalization.format(startDate, dateTimeFormat) + " - ";

                let endDateString = (startDate.getDate() === endDate.getDate()) ?
                    dateLocalization.format(endDate, "shorttime") :
                    dateLocalization.format(endDate, dateTimeFormat);

                return startDateString + endDateString;
            },
            "TIME": function() {
                return dateLocalization.format(startDate, "shorttime") + " - " + dateLocalization.format(endDate, "shorttime");
            },
            "DATE": function() {
                let dateTimeFormat = "monthAndDay",
                    startDateString = dateLocalization.format(startDate, dateTimeFormat),
                    isDurationMoreThanDay = (endDate.getTime() - startDate.getTime()) > toMs("day");

                let endDateString = (isDurationMoreThanDay || endDate.getDate() !== startDate.getDate()) ?
                    " - " + dateLocalization.format(endDate, dateTimeFormat) :
                    "";

                return startDateString + endDateString;
            }
        };

        options.callback(formatTypes[formatType]());
    },

    getFullWeekAppointmentWidth: function(options) {
        let groupIndex = options.groupIndex,
            groupWidth = this._workSpace.getGroupWidth(groupIndex);

        options.callback(groupWidth);
    },

    getMaxAppointmentWidth: function(options) {
        let cellCountToLastViewDate = this._workSpace.getCellCountToLastViewDate(options.date);
        options.callback(cellCountToLastViewDate * this._workSpace.getCellWidth());
    },

    updateAppointmentStartDate: function(options) {
        let appointment = options.appointment,
            firstViewDate = this._workSpace.getStartViewDate(),
            startDate = new Date(options.startDate),
            startDayHour = this._getCurrentViewOption("startDayHour"),
            updatedStartDate;

        if(this.appointmentTakesAllDay(appointment)) {
            updatedStartDate = dateUtils.normalizeDate(startDate, firstViewDate);
        } else {
            if(startDate < firstViewDate) {
                startDate = firstViewDate;
            }
            updatedStartDate = dateUtils.normalizeDate(options.startDate, new Date(startDate));
        }

        updatedStartDate = dateUtils.roundDateByStartDayHour(updatedStartDate, startDayHour);

        options.callback(updatedStartDate);
    },

    updateAppointmentEndDate: function(options) {
        let endDate = new Date(options.endDate),
            endDayHour = this._getCurrentViewOption("endDayHour"),
            startDayHour = this._getCurrentViewOption("startDayHour"),
            updatedEndDate = endDate;

        if(endDate.getHours() >= endDayHour) {
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        } else if(startDayHour > 0 && (endDate.getHours() * 60 + endDate.getMinutes() < (startDayHour * 60))) {
            updatedEndDate = new Date(updatedEndDate.getTime() - toMs("day"));
            updatedEndDate.setHours(endDayHour, 0, 0, 0);
        }
        options.callback(updatedEndDate);
    },

    renderCompactAppointments: function(options) {
        this._compactAppointmentsHelper.render(options);
    },

    clearCompactAppointments: function() {
        this._compactAppointmentsHelper.clear();
    },

    supportCompactDropDownAppointments: function() {
        return this._workSpace._supportCompactDropDownAppointments();
    },

    getGroupCount: function() {
        return this._workSpace._getGroupCount();
    },

    mapAppointmentFields: function(config) {
        let result = {
            appointmentData: config.itemData,
            appointmentElement: config.itemElement
        };

        if(config.itemData) {
            result.targetedAppointmentData = this.fire("getTargetedAppointmentData", config.itemData, config.itemElement);
        }

        return result;
    },

    getOffsetByAllDayPanel: function(groupIndex) {
        return this._workSpace._getOffsetByAllDayPanel(groupIndex);
    },

    getGroupTop: function(groupIndex) {
        return this._workSpace._getGroupTop(groupIndex);
    },

    updateResizableArea: function() {
        let $allResizableElements = this.$element().find(".dx-scheduler-appointment.dx-resizable");

        let horizontalResizables = grep($allResizableElements, function(el) {
            let $el = $(el),
                resizableInst = $el.dxResizable("instance"),
                area = resizableInst.option("area");

            return inArray(resizableInst.option("handles"), ["right left", "left right"]) > -1 && typeUtils.isPlainObject(area);
        });

        each(horizontalResizables, (function(_, el) {
            let $el = $(el),
                position = translator.locate($el),
                appointmentData = this._appointments._getItemData($el);

            let area = this._appointments._calculateResizableArea({
                left: position.left
            }, appointmentData);

            $el.dxResizable("instance").option("area", area);

        }).bind(this));
    },

    recurrenceEditorVisibilityChanged: function(visible) {
        this.recurrenceEditorVisibilityChanged(visible);
    },

    resizePopup: function() {
        this.resizePopup();
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

        let splitExprStr = this.option(field + "Expr").split("."),
            rootField = splitExprStr[0];

        if(obj[rootField] === undefined && splitExprStr.length > 1) {
            let emptyChain = (function(arr) {
                let result = {},
                    tmp = result,
                    arrLength = arr.length - 1;

                for(let i = 1; i < arrLength; i++) {
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
        let dateRange = this.getWorkSpace().getDateRange(),
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
            allDay: allDay,
            firstDayOfWeek: this.getFirstDayOfWeek(),
            recurrenceException: this._getRecurrenceException.bind(this),
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
        let tree = this._resourcesManager.createResourcesTree(this._loadedResources);

        return this._resourcesManager.reduceResourcesTree(tree, this.getFilteredItems());
    },

    groupAppointmentsByResources: function(appointments) {
        let result = { "0": appointments },
            groups = this._getCurrentViewOption("groups");

        if(groups && groups.length && this._resourcesManager.getResourcesData().length) {
            result = this._resourcesManager.groupAppointmentsByResources(appointments, this._loadedResources);
        }

        let totalResourceCount = 0;

        each(this._loadedResources, function(i, resource) {
            if(!i) {
                totalResourceCount = resource.items.length;
            } else {
                totalResourceCount *= resource.items.length;
            }
        });

        for(let j = 0; j < totalResourceCount; j++) {
            let index = j.toString();

            if(result[index]) {
                continue;
            }

            result[index] = [];
        }

        return result;
    },

    getAgendaRows: function(options) {
        let renderingStrategy = this._layoutManager.getRenderingStrategyInstance(),
            calculateRows = renderingStrategy.calculateRows.bind(renderingStrategy),
            d = new Deferred();

        function rowsCalculated(appointments) {
            let result = calculateRows(appointments, options.agendaDuration, options.currentDate);
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

    getMaxAppointmentsPerCell: function() {
        return this.getMaxAppointmentsPerCell();
    },

    forceMaxAppointmentPerCell: function() {
        return this.forceMaxAppointmentPerCell();
    },

    agendaIsReady: function(rows, innerRowOffset, outerRowOffset) {
        let $appts = this.getAppointmentsInstance()._itemElements(),
            total = 0;

        $appts.css("marginBottom", innerRowOffset);

        let applyOffset = function(_, count) {
            let index = count + total - 1;
            $appts.eq(index).css("marginBottom", outerRowOffset);
            total += count;
        };

        for(let i = 0; i < rows.length; i++) {
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

        let tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets);
        date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets);

        return date;
    },

    convertDateByTimezoneBack: function(date, appointmentTimezone) {
        date = new Date(date);

        let tzOffsets = this._subscribes.getComplexOffsets(this, date, appointmentTimezone);
        date = this._subscribes.translateDateToAppointmentTimeZone(date, tzOffsets, true);
        date = this._subscribes.translateDateToCommonTimeZone(date, tzOffsets, true);

        return date;
    },

    translateDateToAppointmentTimeZone: function(date, offsets, back) {
        let operation = back ? -1 : 1;
        let dateInUTC = date.getTime() - operation * offsets.client * toMs("hour");
        return new Date(dateInUTC + operation * offsets.appointment * toMs("hour"));
    },

    translateDateToCommonTimeZone: function(date, offsets, back) {
        let operation = back ? -1 : 1;
        if(typeof offsets.common === "number") {
            let offset = offsets.common - offsets.appointment,
                hoursOffset = (offset < 0 ? -1 : 1) * Math.floor(Math.abs(offset)),
                minutesOffset = offset % 1;

            date.setHours(date.getHours() + operation * hoursOffset);
            date.setMinutes(date.getMinutes() + operation * minutesOffset * MINUTES_IN_HOUR);
        }
        return date;
    },

    getComplexOffsets: function(scheduler, date, appointmentTimezone) {
        let clientTimezoneOffset = -this.getClientTimezoneOffset(date) / toMs("hour");
        let commonTimezoneOffset = scheduler._getTimezoneOffsetByOption(date);
        let appointmentTimezoneOffset = scheduler._calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== "number") {
            appointmentTimezoneOffset = clientTimezoneOffset;
        }

        return {
            client: clientTimezoneOffset,
            common: commonTimezoneOffset,
            appointment: appointmentTimezoneOffset
        };
    },

    getDaylightOffset: function(startDate, endDate) {
        return startDate.getTimezoneOffset() - endDate.getTimezoneOffset();
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

    getTargetedAppointmentData: function(appointmentData, appointmentElement, skipCheckUpdate) {
        const $appointmentElement = $(appointmentElement);
        const appointmentIndex = $appointmentElement.data(this._appointments._itemIndexKey());
        const recurringData = this._getSingleAppointmentData(appointmentData, {
            skipDateCalculation: true,
            $appointment: $appointmentElement,
            skipHoursProcessing: true
        }, skipCheckUpdate);
        let result = {};

        extend(true, result, appointmentData, recurringData);

        this._convertDatesByTimezoneBack(false, result);

        // TODO: _getSingleAppointmentData already uses a related cell data for appointment that contains info about resources
        appointmentElement && this.setTargetedAppointmentResources(result, appointmentElement, appointmentIndex);

        return result;
    },

    getAppointmentDurationInMs: function(options) {
        let startDate = options.startDate,
            endDate = options.endDate,
            allDay = options.allDay,
            appointmentDuration = endDate.getTime() - startDate.getTime();

        let dayDuration = toMs("day"),
            visibleDayDuration = this._workSpace.getVisibleDayDuration(),
            result = 0;

        if(allDay) {
            let ceilQuantityOfDays = Math.ceil(appointmentDuration / dayDuration);

            result = ceilQuantityOfDays * visibleDayDuration;
        } else {
            let isDifferentDate = !dateUtils.sameDate(startDate, new Date(endDate.getTime() - 1)),
                floorQuantityOfDays = Math.floor(appointmentDuration / dayDuration),
                tailDuration;

            if(isDifferentDate) {
                let hiddenDayDuration = dayDuration - visibleDayDuration;

                tailDuration = appointmentDuration - (floorQuantityOfDays ? floorQuantityOfDays * dayDuration : hiddenDayDuration);

                let startDayTime = this.option("startDayHour") * toMs("hour"),
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

            result = (floorQuantityOfDays * visibleDayDuration + tailDuration) || toMs("minute");
        }
        options.callback(result);
    },

    fixWrongEndDate: function(appointment, startDate, endDate) {
        return this._appointmentModel.fixWrongEndDate(appointment, startDate, endDate);
    },

    getEndDayHour: function() {
        return this._workSpace.option("endDayHour") || this.option("endDayHour");
    },

    getStartDayHour: function() {
        return this._workSpace.option("startDayHour") || this.option("startDayHour");
    },

    isAdaptive: function() {
        return this.option("adaptivityEnabled");
    },

    moveBack: function() {
        const dragBehavior = this.getWorkSpace().dragBehavior;

        dragBehavior && dragBehavior.moveBack();
    }
};
module.exports = subscribes;
