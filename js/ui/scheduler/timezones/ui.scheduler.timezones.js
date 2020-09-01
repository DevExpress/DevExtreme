import query from '../../../data/query';
import errors from '../../../core/errors';
import tzData from './ui.scheduler.timezones_data';
import { extend } from '../../../core/utils/extend';
import { sign } from '../../../core/utils/math';

const SchedulerTimezones = {
    _timeZones: tzData.zones,

    getTimezones: function() {
        return this._timeZones;
    },

    getDisplayedTimeZones: function(date) {
        date = date || new Date();

        return this.getTimezones().map((timezone) => {
            const offset = this.getUtcOffset(timezone.offsets, timezone.offsetIndices, timezone.untils, date.getTime());
            const title = `(GMT ${this.formatOffset(offset)}) ${timezone.id}`;

            return extend(timezone, {
                offset: offset,
                title: title
            });
        });
    },

    getSortedTimeZones: function(date) {
        return query(this.getDisplayedTimeZones(date)).sortBy('offset').toArray();
    },

    formatOffset: function(offset) {
        const hours = Math.floor(offset);
        const minutesInDecimal = offset - hours;

        const signString = sign(offset) === 1 ? '+' : '-';
        const hoursString = `0${Math.abs(hours)}`.slice(-2);
        const minutesString = minutesInDecimal > 0 ? `:${minutesInDecimal * 60}` : ':00';

        return signString + hoursString + minutesString;
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
            offsets = tz.offsets;
            untils = tz.untils;
            offsetIndices = tz.offsetIndices;

            result = this.getUtcOffset(offsets, offsetIndices, untils, dateTimeStamp);
        }

        return result;
    },

    getUtcOffset: function(offsets, offsetIndices, untils, dateTimeStamp) {
        let index = 0;
        const offsetIndicesList = offsetIndices.split('');
        const offsetsList = offsets.split('|');

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

        return -(offsetsList[Number(offsetIndicesList[index])] / 60);
    },

    getClientTimezoneOffset: function(date) {
        return date.getTimezoneOffset() * 60000;
    }
};

export default SchedulerTimezones;
