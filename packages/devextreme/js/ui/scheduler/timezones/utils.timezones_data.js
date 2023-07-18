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

const parseTimezone = (timeZoneConfig) => {
    const offsets = timeZoneConfig.offsets;
    const offsetIndices = timeZoneConfig.offsetIndices;
    const untils = timeZoneConfig.untils;

    const offsetList = offsets.split('|').map(value => parseInt(value));
    const offsetIndexList = offsetIndices.split('').map(value => parseInt(value));
    const dateList = getConvertedUntils(untils)
        .map((accumulator => value => accumulator += value)(0));

    return { offsetList, offsetIndexList, dateList };
};

class TimeZoneCache {
    constructor() {
        this.map = new Map();
    }

    tryGet(id) {
        if(!this.map.get(id)) {
            const config = timeZoneDataUtils.getTimezoneById(id);
            if(!config) {
                return false;
            }

            const timeZoneInfo = parseTimezone(config);
            this.map.set(id, timeZoneInfo);
        }

        return this.map.get(id);
    }
}

const tzCache = new TimeZoneCache();

const timeZoneDataUtils = {
    _tzCache: tzCache,
    _timeZones: tzData.zones,

    getDisplayedTimeZones: function(timestamp) {
        const timeZones = this._timeZones.map((timezone) => {
            const timeZoneInfo = parseTimezone(timezone);
            const offset = this.getUtcOffset(timeZoneInfo, timestamp);

            const title = `(GMT ${this.formatOffset(offset)}) ${this.formatId(timezone.id)}`;

            return {
                offset,
                title,
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
        if(!id) {
            return;
        }

        const tzList = this._timeZones;

        for(let i = 0; i < tzList.length; i++) {
            const currentId = tzList[i]['id'];
            if(currentId === id) {
                return tzList[i];
            }
        }

        errors.log('W0009', id);
        return;
    },

    getTimeZoneOffsetById: function(id, timestamp) {
        const timeZoneInfo = tzCache.tryGet(id);

        return timeZoneInfo ? this.getUtcOffset(timeZoneInfo, timestamp) : undefined;
    },

    getTimeZoneDeclarationTuple: function(id, year) {
        const timeZoneInfo = tzCache.tryGet(id);

        return timeZoneInfo ? this.getTimeZoneDeclarationTupleCore(timeZoneInfo, year) : [];
    },

    getTimeZoneDeclarationTupleCore: function(timeZoneInfo, year) {
        const offsetList = timeZoneInfo.offsetList;
        const offsetIndexList = timeZoneInfo.offsetIndexList;
        const dateList = timeZoneInfo.dateList;

        const tupleResult = [];

        for(let i = 0; i < dateList.length; i++) {
            const currentDate = dateList[i];
            const currentYear = new Date(currentDate).getFullYear();

            if(currentYear === year) {
                const offset = offsetList[offsetIndexList[i + 1]];
                tupleResult.push({ date: currentDate, offset: -offset / 60 });
            }

            if(currentYear > year) {
                break;
            }
        }

        return tupleResult;
    },

    getUtcOffset: function(timeZoneInfo, dateTimeStamp) {
        const offsetList = timeZoneInfo.offsetList;
        const offsetIndexList = timeZoneInfo.offsetIndexList;
        const dateList = timeZoneInfo.dateList;

        const infinityUntilCorrection = 1;
        const lastIntervalStartIndex = dateList.length - 1 - infinityUntilCorrection;

        let index = lastIntervalStartIndex;
        while(index >= 0 && dateTimeStamp < dateList[index]) {
            index--;
        }

        const offset = offsetList[offsetIndexList[index + 1]];
        return -offset / 60 || offset;
    }
};

export default timeZoneDataUtils;
