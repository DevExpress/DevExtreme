var query = require('../../../data/query'),
    errors = require('../../../core/errors'),
    tzData = require('./ui.scheduler.timezones_data');

var SchedulerTimezones = {
    _displayNames: tzData.displayNames,
    _list: tzData.timezones,

    getTimezones: function() {
        return this._list;
    },
    getDisplayNames: function() {
        return this._displayNames;
    },
    queryableTimezones: function() {
        return query(this.getTimezones());
    },
    getTimezoneById: function(id) {
        var result,
            i = 0,
            tzList = this.getTimezones();

        if(id) {
            while(!result) {
                if(!tzList[i]) {
                    errors.log('W0009', id);
                    return;
                }
                var currentId = tzList[i]['id'];
                if(currentId === id) {
                    result = tzList[i];
                }
                i++;
            }
        }
        return result;
    },
    getTimezoneOffsetById: function(id, dateTimeStamp) {
        var tz = this.getTimezoneById(id),
            offsets,
            offsetIndices,
            untils,
            result;

        if(tz) {
            if(tz.link) {
                var rootTz = this.getTimezones()[tz.link];
                offsets = rootTz.offsets;
                untils = rootTz.untils;
                offsetIndices = rootTz.offsetIndices;
            } else {
                offsets = tz.offsets;
                untils = tz.untils;
                offsetIndices = tz.offsetIndices;
            }

            result = this.getUtcOffset(offsets, offsetIndices, untils, dateTimeStamp);
        }

        return result;
    },
    getUtcOffset: function(offsets, offsetIndices, untils, dateTimeStamp) {
        var index = 0;
        var offsetIndicesList = offsetIndices.split('');

        var untilsList = untils.split('|').map(function(until) {
            if(until === 'Infinity') {
                return null;
            }
            return parseInt(until, 36) * 1000;
        });

        var currentUntil = 0;

        for(var i = 0, listLength = untilsList.length; i < listLength; i++) {
            currentUntil += untilsList[i];
            if(dateTimeStamp >= currentUntil) {
                index = i;
                continue;
            } else {
                break;
            }
        }

        if(untilsList[index + 1]) {
            index++;
        }

        return offsets[Number(offsetIndicesList[index])];
    },
    getTimezoneShortDisplayNameById: function(id) {
        var tz = this.getTimezoneById(id),
            result;

        if(tz) {
            result = tz.DisplayName.substring(0, 11);
        }

        return result;
    },
    getTimezonesDisplayName: function() {
        return query(this.getDisplayNames()).sortBy().toArray();
    },
    getTimezoneDisplayNameById: function(id) {
        var tz = this.getTimezoneById(id);
        return tz ? this.getDisplayNames()[tz.winIndex] : '';
    },
    getSimilarTimezones: function(id) {
        if(!id) {
            return [];
        }

        var tz = this.getTimezoneById(id);

        return this.getTimezonesIdsByWinIndex(tz.winIndex);

    },
    getTimezonesIdsByWinIndex: function(winIndex) {
        return this.queryableTimezones()
            .filter(['winIndex', winIndex])
            .sortBy('title')
            .toArray()
            .map(function(item) {
                return {
                    id: item.id,
                    displayName: item.title
                };
            });
    },
    getTimezonesIdsByDisplayName: function(displayName) {
        var displayNameIndex = this.getDisplayNames().indexOf(displayName);

        return this.getTimezonesIdsByWinIndex(displayNameIndex);
    },

    getClientTimezoneOffset: function(date) {
        return date.getTimezoneOffset() * 60000;
    },

    processDateDependOnTimezone: function(date, tzOffset) {
        var result = new Date(date);

        if(tzOffset) {
            var tzDiff = tzOffset + this.getClientTimezoneOffset(date) / 3600000;
            result = new Date(result.setHours(result.getHours() + tzDiff));
        }

        return result;
    }
};

module.exports = SchedulerTimezones;
