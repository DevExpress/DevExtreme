import query from '../../../data/query';
import errors from '../../../core/errors';
import tzData from './ui.scheduler.timezones_data';
import { extend } from '../../../core/utils/extend';

const SchedulerTimezones = {
    _timeZones: tzData.zones,

    getTimezones: function() {
        return this._timeZones;
    },

    getDisplayedTimeZones: function(date) {
        date = date || new Date();

        const result = [];
        this.getTimezones().forEach((timezone) => {
            const offset = this.getUtcOffset(timezone.offsets, timezone.offsetIndices, timezone.untils, date.getTime());
            const title = `(GMT${this.formatOffset(offset)}) ${timezone.id}`;

            result.push(extend(timezone, {
                offset: offset,
                title: title
            }));
        });

        return result;
    },

    getSortedTimeZones: function(date) {
        return query(this.getDisplayedTimeZones(date)).sortBy('offset').toArray();
    },

    formatOffset: function(offset) {
        const a = Math.floor(offset);
        const b = offset - a;
        const sign = Math.sign(offset);
        let signString = '';
        if(sign === -1) signString = '-';
        if(sign === 1) signString = '+';

        // `0${Math(abs(a))}`.slice(-2)
        const aString = `0${Math.abs(a)}`.slice(-2);
        const bString = b > 0 ? `:${b * 60}` : ':00';
        return signString + aString + bString;
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
