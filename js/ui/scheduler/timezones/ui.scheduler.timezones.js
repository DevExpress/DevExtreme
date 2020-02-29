const query = require('../../../data/query');
const errors = require('../../../core/errors');
const tzData = require('./ui.scheduler.timezones_data');

const SchedulerTimezones = {
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
        let result;
        let i = 0;
        const tzList = this.getTimezones();

        if(id) {
            while(!result) {
                if(!tzList[i]) {
                    errors.log('W0009', id);
                    return;
                }
                const currentId = tzList[i]['id'];
                if(currentId === id) {
                    result = tzList[i];
                }
                i++;
            }
        }
        return result;
    },
    getTimezoneOffsetById: function(id, dateTimeStamp) {
        const tz = this.getTimezoneById(id);
        let offsets;
        let offsetIndices;
        let untils;
        let result;

        if(tz) {
            if(tz.link) {
                const rootTz = this.getTimezones()[tz.link];
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
        let index = 0;
        const offsetIndicesList = offsetIndices.split('');

        const untilsList = untils.split('|').map(function(until) {
            if(until === 'Infinity') {
                return null;
            }
            return parseInt(until, 36) * 1000;
        });

        let currentUntil = 0;

        for(let i = 0, listLength = untilsList.length; i < listLength; i++) {
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
        const tz = this.getTimezoneById(id);
        let result;

        if(tz) {
            result = tz.DisplayName.substring(0, 11);
        }

        return result;
    },
    getTimezonesDisplayName: function() {
        return query(this.getDisplayNames()).sortBy().toArray();
    },
    getTimezoneDisplayNameById: function(id) {
        const tz = this.getTimezoneById(id);
        return tz ? this.getDisplayNames()[tz.winIndex] : '';
    },
    getSimilarTimezones: function(id) {
        if(!id) {
            return [];
        }

        const tz = this.getTimezoneById(id);

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
        const displayNameIndex = this.getDisplayNames().indexOf(displayName);

        return this.getTimezonesIdsByWinIndex(displayNameIndex);
    },

    getClientTimezoneOffset: function(date) {
        return date.getTimezoneOffset() * 60000;
    },

    processDateDependOnTimezone: function(date, tzOffset) {
        let result = new Date(date);

        if(tzOffset) {
            const tzDiff = tzOffset + this.getClientTimezoneOffset(date) / 3600000;
            result = new Date(result.setHours(result.getHours() + tzDiff));
        }

        return result;
    }
};

module.exports = SchedulerTimezones;
