import query from '../../../data/query';
import errors from '../../../core/errors';
import tzData from './timezonesRawData';
import { extend } from '../../../core/utils/extend';
// import dateLocalization from '../../localization/date';

const SchedulerTimezones = {
    _displayNames: tzData.zones,
    _list: tzData.zones,

    // loadData: function() {
    //     const window = getWindow();
    //     const reader = new window.FileReader();

    //     // Closure to capture the file information.
    //     reader.onload = (function(theFile) {
    //         return function(e) {
    //             debugger;
    //             // Render thumbnail.
    //             // const span = document.createElement('span');
    //             // span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //             //     '" title="', escape(theFile.name), '"/>'].join('');
    //             // document.getElementById('list').insertBefore(span, null);
    //         };
    //     })('./ui.scheduler.timezonesRawData');

    //     // Read in the image file as a data URL.
    //     reader.readAsDataURL('./ui.scheduler.timezonesRawData');
    // },
    getTimezones: function() {
        return this._list;
    },
    getDisplayNames: function() {
        const today = new Date(); // NOTE: use startDate from appointment instead

        const result = [];
        this._list.forEach((timezone) => {
            const offset = this.getUtcOffset(timezone.offsets, timezone.offsetIndices, timezone.untils, today.getTime());
            const title = `(GMT  ${this.formatOffset(offset)}) ${timezone.id}`;

            result.push(extend(timezone, {
                offset: offset,
                title: title
            }));
        });

        return result;
        // return this._list.map((timezone) => {
        //     debugger;
        //     timezone.offset = (this.getUtcOffset(timezone.offsets, timezone.offsetIndices, timezone.untils, today.getTime())) / 60;
        //     timezone.title = `(GMT + ${timezone.offset}) ${timezone.name}`;
        // });
        // return this._displayNames;
    },
    formatOffset: function(offset) {
        const a = Math.trunc(offset);
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

    getTimezoneShortDisplayNameById: function(id) {
        const tz = this.getTimezoneById(id);
        let result;

        if(tz) {
            result = tz.DisplayName.substring(0, 11);
        }

        return result;
    },
    getTimezonesDisplayName: function() {
        // return query(this.getTimezones()).sortBy().toArray();
        return query(this.getDisplayNames()).sortBy('offset').toArray();
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

export default SchedulerTimezones;
