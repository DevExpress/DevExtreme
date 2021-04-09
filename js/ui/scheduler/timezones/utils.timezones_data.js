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

const parseTimezone = ({ offsets, offsetIndices, untils }) => {
    const offsetsList = offsets.split('|').map(value => parseInt(value));
    const offsetIndicesList = offsetIndices.split('').map(value => parseInt(value));
    const datesList = getConvertedUntils(untils)
        .map((accumulator => value => accumulator += value)(0));

    return { offsetsList, offsetIndicesList, datesList };
};

class TimeZoneCache {
    constructor() {
        this.map = new Map();
    }

    get(id) {
        if(!this.map.get(id)) {
            const config = timeZoneDataUtils.getTimezoneById(id);
            if(!config) {
                return false;
            }

            this.map.set(id, parseTimezone(config));
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
            const offset = this.getUtcOffset(parseTimezone(timezone), timestamp);

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
        const timeZoneInfo = tzCache.get(id);

        return timeZoneInfo ? this.getUtcOffset(timeZoneInfo, timestamp) : undefined;
    },

    getTimeZoneDeclarationTuple: function(id, year) {
        const timeZoneInfo = tzCache.get(id);

        return timeZoneInfo ? this.getTimeZoneDeclarationTupleCore(timeZoneInfo, year) : [];
    },

    getTimeZoneDeclarationTupleCore: function({ offsetsList, offsetIndicesList, datesList }, year) {
        const tupleResult = [];

        for(let i = 0; i < datesList.length; i++) {
            const currentDate = datesList[i];
            const currentYear = new Date(currentDate).getFullYear();

            if(currentYear === year) {
                const offset = offsetsList[offsetIndicesList[i + 1]];
                tupleResult.push({ date: currentDate, offset: -offset / 60 });
            }

            if(currentYear > year) {
                break;
            }
        }

        return tupleResult;
    },

    getUtcOffset: function({ offsetsList, offsetIndicesList, datesList }, dateTimeStamp) {
        let index = datesList.length - 2;
        while(index >= 0 && dateTimeStamp < datesList[index]) {
            index--;
        }

        const offset = offsetsList[offsetIndicesList[index + 1]];
        return -offset / 60 || offset;
    }
};

export default timeZoneDataUtils;
