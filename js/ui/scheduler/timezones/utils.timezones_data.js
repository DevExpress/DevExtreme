import query from '../../../data/query';
import errors from '../../../core/errors';
import tzData from './timezones_data';
import { sign } from '../../../core/utils/math';

const getConvertedUntils = value => {
    return value.split('|').map(until => {
        if(until === 'Infinity') {
            return null;
        }
        return parseInt(until, 36) * 1000;
    });
};

class TimeZoneCache {
    constructor() {
        this.map = new Map();
    }

    get(id) {
        if(!this.map.get(id)) {
            const config = timeZoneDataUtils.getTimezoneById(id);
            const { offsets, offsetIndices, untils } = config;

            this.map.set(id, [offsets, offsetIndices, getConvertedUntils(untils)]);
        }

        return this.map.get(id);
    }
}

const tzCache = new TimeZoneCache();

const timeZoneDataUtils = {
    _timeZones: tzData.zones,

    getDisplayedTimeZones: function(timestamp) {
        const timeZones = this._timeZones.map((timezone) => {
            const offset = this.getUtcOffset(timezone.offsets, timezone.offsetIndices, getConvertedUntils(timezone.untils), timestamp);

            const title = `(GMT ${this.formatOffset(offset)}) ${this.formatId(timezone.id)}`;

            return {
                offset: offset,
                title: title,
                id: timezone.id
            };
        });

        return query(timeZones).sortBy('offset').toArray();
    },


    formatOffset: function(offset) {
        const hours = Math.floor(offset);
        const minutesInDecimal = offset - hours;

        const signString = sign(offset) >= 0 ? '+' : '-';
        const hoursString = `0${Math.abs(hours)}`.slice(-2);
        const minutesString = minutesInDecimal > 0 ? `:${minutesInDecimal * 60}` : ':00';

        return signString + hoursString + minutesString;
    },

    formatId: function(id) {
        return id.split('/').join(' - ').split('_').join(' ');
    },

    getTimezoneById: function(id) {
        let result;
        let i = 0;
        const tzList = this._timeZones;

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

    getTimeZoneOffsetById: function(id, timestamp) {
        const [offsets, offsetIndices, untils] = tzCache.get(id);

        return this.getUtcOffset(offsets, offsetIndices, untils, timestamp);
    },

    getTimeZoneDeclarationTuple: function(id, year) {
        const [offsets, offsetIndices, untils] = tzCache.get(id);

        return this.getTimeZoneDeclarationTupleCore(offsets, offsetIndices, untils, year);
    },

    getTimeZoneDeclarationTupleCore: function(offsets, offsetIndices, untilsList, year) {
        const tupleResult = [];

        const offsetIndicesList = offsetIndices.split('');
        const offsetsList = offsets.split('|').map(value => parseInt(value));

        let currentDate = 0;

        for(let i = 0, listLength = untilsList.length; i < listLength; i++) {
            currentDate += untilsList[i];

            if(new Date(currentDate).getFullYear() === year) {
                const offset = offsetsList[Number(offsetIndicesList[i + 1])];
                tupleResult.push({ date: currentDate, offset: -offset / 60 });
            }

            if(new Date(currentDate).getFullYear() > year) {
                break;
            }
        }

        return tupleResult;
    },

    getUtcOffset: function(offsets, offsetIndices, untilsList, dateTimeStamp) {
        let index = 0;
        const offsetIndicesList = offsetIndices.split('');
        const offsetsList = offsets.split('|');

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

        const offset = Number(offsetsList[Number(offsetIndicesList[index])]);
        return -offset / 60 || offset;
    }
};

export default timeZoneDataUtils;
