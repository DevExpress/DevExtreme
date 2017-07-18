"use strict";

var Class = require("../../core/class"),
    config = require("../../core/config"),
    iteratorUtils = require("../../core/utils/iterator"),
    dateSerialization = require("../../core/utils/date_serialization"),
    recurrenceUtils = require("./utils.recurrence"),
    dateUtils = require("../../core/utils/date"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    arrayUtils = require("../../core/utils/array"),
    query = require("../../data/query");

var DATE_FILTER_POSITION = 0,
    USER_FILTER_POSITION = 1;

var FilterMaker = Class.inherit({
    ctor: function(dataExpressions, dataAccessors) {
        this._filterRegistry = null;
        this._dataAccessors = dataAccessors;
        this._dataExpressions = dataExpressions;
    },

    isRegistered: function() {
        return !!this._filterRegistry;
    },

    clearRegistry: function() {
        delete this._filterRegistry;
    },

    make: function(type, args) {

        if(!this._filterRegistry) {
            this._filterRegistry = {};
        }

        this._make[type].apply(this, args);
    },

    _make: {
        "date": function(min, max, useAccessors) {
            var startDate = useAccessors ? this._dataAccessors.getter.startDate : this._dataExpressions.startDateExpr,
                endDate = useAccessors ? this._dataAccessors.getter.endDate : this._dataExpressions.endDateExpr,
                recurrenceRule = this._dataExpressions.recurrenceRuleExpr;

            this._filterRegistry.date = [
                [
                        [endDate, ">", min],
                        [startDate, "<", max]
                ],
                "or",
                    [recurrenceRule, "startswith", "freq"],
                "or",
                [
                        [endDate, min],
                        [startDate, min]
                ]
            ];

            if(!recurrenceRule) {
                this._filterRegistry.date.splice(1, 2);
            }
        },
        "user": function(userFilter) {
            this._filterRegistry.user = userFilter;
        }
    },
    combine: function() {
        var filter = [];

        this._filterRegistry.date && filter.push(this._filterRegistry.date);
        this._filterRegistry.user && filter.push(this._filterRegistry.user);

        return filter;
    },

    dateFilter: function() {
        return this._filterRegistry.date;
    }
});

var AppointmentModel = Class.inherit({

    _createFilter: function(min, max, remoteFiltering, dateSerializationFormat) {
        this._filterMaker.make("date", [min, max]);

        var userFilterPosition = this._excessFiltering() ? this._dataSource.filter()[USER_FILTER_POSITION] : this._dataSource.filter();
        this._filterMaker.make("user", [userFilterPosition]);

        if(remoteFiltering) {
            this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
        }
    },

    _excessFiltering: function() {
        var dateFilter = this._filterMaker.dateFilter(),
            dataSourceFilter = this._dataSource.filter();

        return dataSourceFilter && (commonUtils.equalByValue(dataSourceFilter, dateFilter) || (dataSourceFilter.length && commonUtils.equalByValue(dataSourceFilter[DATE_FILTER_POSITION], dateFilter)));
    },

    _combineFilter: function() {
        return this._filterMaker.combine();
    },

    _getStoreKey: function(target) {
        var store = this._dataSource.store();

        return store.keyOf(target);
    },

    _filterAppointmentByResources: function(appointment, resources) {
        var result = false;

        function checkAppointmentResourceValues() {
            var resourceGetter = this._dataAccessors.getter.resources[resourceName],
                resource;

            if(typeUtils.isFunction(resourceGetter)) {
                resource = resourceGetter(appointment);
            }

            var appointmentResourceValues = arrayUtils.wrapToArray(resource),
                resourceData = iteratorUtils.map(resources[i].items, function(item) { return item.id; });

            for(var j = 0, itemDataCount = appointmentResourceValues.length; j < itemDataCount; j++) {
                if(inArray(appointmentResourceValues[j], resourceData) > -1) {
                    return true;
                }
            }

            return false;
        }

        for(var i = 0, len = resources.length; i < len; i++) {
            var resourceName = resources[i].name;

            result = checkAppointmentResourceValues.call(this);

            if(!result) {
                return false;
            }
        }

        return result;
    },

    _filterAppointmentByRRule: function(appointment, min, max, startDayHour, endDayHour) {
        var recurrenceRule = appointment.recurrenceRule,
            recurrenceException = appointment.recurrenceException,
            allDay = appointment.allDay,
            result = true,
            appointmentStartDate = appointment.startDate,
            appointmentEndDate = appointment.endDate;

        if(allDay || this._appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
            var trimmedDates = this._trimDates(min, max);

            min = trimmedDates.min;
            max = new Date(trimmedDates.max.getTime() - 60000);
        }

        if(recurrenceRule && !recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid) {
            result = (appointmentEndDate > min) && (appointmentStartDate <= max);
        }

        if(result && recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid) {
            result = recurrenceUtils.dateInRecurrenceRange({
                rule: recurrenceRule,
                exception: recurrenceException,
                start: appointmentStartDate,
                end: appointmentEndDate,
                min: min,
                max: max
            });
        }

        return result;
    },

    _appointmentPartInInterval: function(startDate, endDate, startDayHour, endDayHour) {
        var apptStartDayHour = startDate.getHours(),
            apptEndDayHour = endDate.getHours();

        return (apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour) ||
                   (apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour);
    },

    _createCombinedFilter: function(filterOptions, timeZoneProcessor) {
        var dataAccessors = this._dataAccessors,
            startDayHour = filterOptions.startDayHour,
            endDayHour = filterOptions.endDayHour,
            min = new Date(filterOptions.min),
            max = new Date(filterOptions.max),
            resources = filterOptions.resources,
            that = this;

        return [[function(appointment) {
            var result = true,
                startDate = new Date(dataAccessors.getter.startDate(appointment)),
                endDate = new Date(dataAccessors.getter.endDate(appointment)),
                appointmentTakesAllDay = that.appointmentTakesAllDay(appointment, startDayHour, endDayHour),
                isAllDay = dataAccessors.getter.allDay(appointment),
                apptStartHour = startDate.getHours(),
                hiddenInterval = (24 - endDayHour + startDayHour) * 3600000,
                apptDuration = endDate.getTime() - startDate.getTime(),
                delta = (hiddenInterval - apptDuration) / (1000 * 60 * 60),
                useRecurrence = typeUtils.isDefined(dataAccessors.getter.recurrenceRule),
                recurrenceRule;

            if(useRecurrence) {
                recurrenceRule = dataAccessors.getter.recurrenceRule(appointment);
            }

            if(resources && resources.length) {
                result = that._filterAppointmentByResources(appointment, resources);
            }

            if(appointmentTakesAllDay && filterOptions.allDay === false) {
                result = false;
            }

            if(result && useRecurrence) {

                result = that._filterAppointmentByRRule({
                    startDate: startDate,
                    endDate: endDate,
                    recurrenceRule: recurrenceRule,
                    recurrenceException: dataAccessors.getter.recurrenceException(appointment),
                    allDay: appointmentTakesAllDay
                }, min, max, startDayHour, endDayHour);
            }

            var startDateTimeZone = dataAccessors.getter.startDateTimeZone(appointment),
                endDateTimeZone = dataAccessors.getter.endDateTimeZone(appointment),
                comparableStartDate = timeZoneProcessor(startDate, startDateTimeZone),
                comparableEndDate = timeZoneProcessor(endDate, endDateTimeZone);

            if(result && startDayHour !== undefined) {
                result = comparableStartDate.getHours() >= startDayHour || comparableEndDate.getHours() >= startDayHour || appointmentTakesAllDay;
            }

            if(result && endDayHour !== undefined) {
                result = comparableStartDate.getHours() < endDayHour || appointmentTakesAllDay && comparableStartDate <= max;

                if(apptDuration < hiddenInterval) {
                    if(apptStartHour > endDayHour && (delta <= apptStartHour - endDayHour)) {
                        result = false;
                    }
                }
            }

            if(result && useRecurrence && !recurrenceRule) {
                if(comparableEndDate.getTime() < min.getTime() && !isAllDay) {
                    result = false;
                }
            }
            return result;
        }]];
    },

    ctor: function(dataSource, dataExpressions, dataAccessors) {
        this._dataExpressions = dataExpressions;
        this.setDataSource(dataSource);
        this._filterMaker = new FilterMaker(dataExpressions, dataAccessors);
        this.setDataAccessors(dataAccessors);
    },

    setDataSource: function(dataSource) {
        this._dataSource = dataSource;

        this._filterMaker && this._filterMaker.clearRegistry();
    },

    setDataAccessors: function(dataAccessors) {
        this._dataAccessors = dataAccessors;
    },

    filterByDate: function(min, max, remoteFiltering, dateSerializationFormat) {
        if(!this._dataSource) {
            return;
        }

        var trimmedDates = this._trimDates(min, max);

        if(!this._filterMaker.isRegistered()) {
            this._createFilter(trimmedDates.min, trimmedDates.max, remoteFiltering, dateSerializationFormat);
        } else {
            this._filterMaker.make("date", [trimmedDates.min, trimmedDates.max]);

            if(this._dataSource.filter() && this._dataSource.filter().length > 1) {
                this._filterMaker.make("user", [this._dataSource.filter()[1]]);
            }
            if(remoteFiltering) {
                this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat));
            }
        }
    },

    _combineRemoteFilter: function(dateSerializationFormat) {
        var combinedFilter = this._filterMaker.combine();
        return this._serializeRemoteFilter(combinedFilter, dateSerializationFormat);
    },

    _serializeRemoteFilter: function(filter, dateSerializationFormat) {
        var that = this;

        if(!Array.isArray(filter)) return filter;

        filter = extend([], filter);

        var startDate = that._dataExpressions.startDateExpr,
            endDate = that._dataExpressions.endDateExpr;

        if(typeUtils.isString(filter[0])) {
            if(config().forceIsoDateParsing && filter.length > 1) {
                if(filter[0] === startDate || filter[0] === endDate) {
                    filter[filter.length - 1] = dateSerialization.serializeDate(filter[filter.length - 1], dateSerializationFormat);
                }
            }
        }

        for(var i = 0; i < filter.length; i++) {
            filter[i] = that._serializeRemoteFilter(filter[i], dateSerializationFormat);
        }

        return filter;
    },

    filterLoadedAppointments: function(filterOptions, timeZoneProcessor) {
        if(!typeUtils.isFunction(timeZoneProcessor)) {
            timeZoneProcessor = function(date) {
                return date;
            };
        }

        var combinedFilter = this._createCombinedFilter(filterOptions, timeZoneProcessor);

        if(this._filterMaker.isRegistered()) {
            var trimmedDates = this._trimDates(filterOptions.min, filterOptions.max);

            this._filterMaker.make("date", [trimmedDates.min, trimmedDates.max, true]);

            var dateFilter = this.customizeDateFilter(this._filterMaker.combine(), timeZoneProcessor);

            combinedFilter.push([dateFilter]);
        }

        return query(this._dataSource.items()).filter(combinedFilter).toArray();
    },

    _trimDates: function(min, max) {
        var minCopy = dateUtils.trimTime(new Date(min)),
            maxCopy = dateUtils.trimTime(new Date(max));

        maxCopy.setDate(maxCopy.getDate() + 1);

        return {
            min: minCopy,
            max: maxCopy
        };
    },

    hasAllDayAppointments: function(items, startDayHour, endDayHour) {
        if(!items) {
            return false;
        }

        var that = this;

        var result = false;
        iteratorUtils.each(items, function(index, item) {
            if(that.appointmentTakesAllDay(item, startDayHour, endDayHour)) {
                result = true;
                return false;
            }
        });

        return result;
    },

    appointmentTakesAllDay: function(appointment, startDayHour, endDayHour) {
        var dataAccessors = this._dataAccessors,
            startDate = dataAccessors.getter.startDate(appointment),
            endDate = dataAccessors.getter.endDate(appointment),
            allDay = dataAccessors.getter.allDay(appointment);

        return allDay || this._appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour);
    },

    _appointmentHasAllDayDuration: function(startDate, endDate, startDayHour, endDayHour) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        var etalonDayDurationInHours = endDayHour - startDayHour,
            appointmentDurationInHours = (endDate.getTime() - startDate.getTime()) / 3600000;

        return appointmentDurationInHours >= etalonDayDurationInHours;
    },

    appointmentTakesSeveralDays: function(appointment) {
        var dataAccessors = this._dataAccessors,
            startDate = dataAccessors.getter.startDate(appointment),
            endDate = dataAccessors.getter.endDate(appointment);

        var startDateCopy = dateUtils.trimTime(new Date(startDate)),
            endDateCopy = dateUtils.trimTime(new Date(endDate));

        return startDateCopy.getTime() !== endDateCopy.getTime();
    },

    _mapDateFieldsDependOnTZ: function(appointment, tz) {
        function convert(date) {
            date = dateUtils.makeDate(date);

            var tzDiff = tz.value * 3600000 + tz.clientOffset;

            return new Date(date.getTime() - tzDiff);
        }

        var startDate = this._dataAccessors.getter.startDate(appointment),
            endDate = this._dataAccessors.getter.endDate(appointment);

        this._dataAccessors.setter.startDate(appointment, convert(startDate));
        this._dataAccessors.setter.endDate(appointment, convert(endDate));
    },

    customizeDateFilter: function(dateFilter, timeZoneProcessor) {
        var currentFilter = extend(true, [], dateFilter);

        return (function(appointment) {
            appointment = extend(true, {}, appointment);

            var startDate = this._dataAccessors.getter.startDate(appointment),
                endDate = this._dataAccessors.getter.endDate(appointment),
                startDateTimeZone = this._dataAccessors.getter.startDateTimeZone(appointment),
                endDateTimeZone = this._dataAccessors.getter.endDateTimeZone(appointment);

            var comparableStartDate = timeZoneProcessor(startDate, startDateTimeZone),
                comparableEndDate = timeZoneProcessor(endDate, endDateTimeZone);

            this._dataAccessors.setter.startDate(appointment, comparableStartDate);
            this._dataAccessors.setter.endDate(appointment, comparableEndDate);

            return query([appointment]).filter(currentFilter).toArray().length > 0;
        }).bind(this);
    },

    add: function(data, tz) {
        if(tz && tz.value !== undefined) {
            this._mapDateFieldsDependOnTZ(data, tz);
        }
        return this._dataSource.store().insert(data).done((function() {
            this._dataSource.load();
        }).bind(this));
    },

    update: function(target, data) {
        var key = this._getStoreKey(target);

        return this._dataSource.store().update(key, data).done((function() {
            this._dataSource.load();
        }).bind(this));
    },

    remove: function(target) {
        var key = this._getStoreKey(target);

        return this._dataSource.store().remove(key).done((function() {
            this._dataSource.load();
        }).bind(this));
    }
});

module.exports = AppointmentModel;
