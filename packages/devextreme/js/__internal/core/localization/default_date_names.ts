import { map } from '../../../core/utils/iterator';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['AM', 'PM'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

// TODO: optimize
const cutCaptions = (captions, format) => {
    const lengthByFormat = {
        abbreviated: 3,
        short: 2,
        narrow: 1
    };

    return map(captions, caption => {
        return caption.substr(0, lengthByFormat[format]);
    });
};

export default {
    getMonthNames: function(format) {
        return cutCaptions(MONTHS, format);
    },
    getDayNames: function(format) {
        return cutCaptions(DAYS, format);
    },
    getQuarterNames: function(format) {
        return QUARTERS;
    },
    getPeriodNames: function(format) {
        return PERIODS;
    }
};
