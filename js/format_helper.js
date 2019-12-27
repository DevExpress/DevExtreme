const typeUtils = require('./core/utils/type');
const dateUtils = require('./core/utils/date');
const numberLocalization = require('./localization/number');
const dateLocalization = require('./localization/date');
const dependencyInjector = require('./core/utils/dependency_injector');

require('./localization/currency');

module.exports = dependencyInjector({
    format: function(value, format) {
        const formatIsValid = typeUtils.isString(format) && format !== '' || typeUtils.isPlainObject(format) || typeUtils.isFunction(format);
        const valueIsValid = typeUtils.isNumeric(value) || typeUtils.isDate(value);


        if(!formatIsValid || !valueIsValid) {
            return typeUtils.isDefined(value) ? value.toString() : '';
        }

        if(typeUtils.isFunction(format)) {
            return format(value);
        }

        if(typeUtils.isString(format)) {
            format = { type: format };
        }

        if(typeUtils.isNumeric(value)) {
            return numberLocalization.format(value, format);
        }

        if(typeUtils.isDate(value)) {
            return dateLocalization.format(value, format);
        }
    },
    getTimeFormat: function(showSecond) {
        return showSecond ? 'longtime' : 'shorttime';
    },

    _normalizeFormat: function(format) {
        if(!Array.isArray(format)) {
            return format;
        }

        if(format.length === 1) {
            return format[0];
        }

        return function(date) {
            return format.map(function(formatPart) {
                return dateLocalization.format(date, formatPart);
            }).join(' ');
        };
    },

    getDateFormatByDifferences: function(dateDifferences, intervalFormat) {
        const resultFormat = [];
        const needSpecialSecondFormatter = intervalFormat && dateDifferences.millisecond && !(dateDifferences.year || dateDifferences.month || dateDifferences.day);

        if(needSpecialSecondFormatter) {
            const secondFormatter = function(date) {
                return (date.getSeconds() + date.getMilliseconds() / 1000) + 's';
            };
            resultFormat.push(secondFormatter);
        } else if(dateDifferences.millisecond) {
            resultFormat.push('millisecond');
        }

        if(dateDifferences.hour || dateDifferences.minute || (!needSpecialSecondFormatter && dateDifferences.second)) {
            resultFormat.unshift(this.getTimeFormat(dateDifferences.second));
        }

        if(dateDifferences.year && dateDifferences.month && dateDifferences.day) {
            if(intervalFormat && intervalFormat === 'month') {
                return 'monthandyear';
            } else {
                resultFormat.unshift('shortdate');
                return this._normalizeFormat(resultFormat);
            }
        }

        if(dateDifferences.year && dateDifferences.month) {
            return 'monthandyear';
        }
        if(dateDifferences.year && dateDifferences.quarter) {
            return 'quarterandyear';
        }
        if(dateDifferences.year) {
            return 'year';
        }
        if(dateDifferences.quarter) {
            return 'quarter';
        }

        if(dateDifferences.month && dateDifferences.day) {
            if(intervalFormat) {
                const monthDayFormatter = function(date) {
                    return dateLocalization.getMonthNames('abbreviated')[date.getMonth()] + ' ' + dateLocalization.format(date, 'day');
                };
                resultFormat.unshift(monthDayFormatter);
            } else {
                resultFormat.unshift('monthandday');
            }
            return this._normalizeFormat(resultFormat);
        }
        if(dateDifferences.month) {
            return 'month';
        }
        if(dateDifferences.day) {
            if(intervalFormat) {
                resultFormat.unshift('day');
            } else {
                const dayFormatter = function(date) {
                    return dateLocalization.format(date, 'dayofweek') + ', ' + dateLocalization.format(date, 'day');
                };
                resultFormat.unshift(dayFormatter);
            }
            return this._normalizeFormat(resultFormat);
        }

        return this._normalizeFormat(resultFormat);
    },
    getDateFormatByTicks: function(ticks) {
        let resultFormat;
        let maxDiff;
        let currentDiff;
        let i;

        if(ticks.length > 1) {
            maxDiff = dateUtils.getDatesDifferences(ticks[0], ticks[1]);
            for(i = 1; i < ticks.length - 1; i++) {
                currentDiff = dateUtils.getDatesDifferences(ticks[i], ticks[i + 1]);
                if(maxDiff.count < currentDiff.count) {
                    maxDiff = currentDiff;
                }
            }
        } else {
            maxDiff = {
                year: true,
                month: true,
                day: true,
                hour: ticks[0].getHours() > 0,
                minute: ticks[0].getMinutes() > 0,
                second: ticks[0].getSeconds() > 0,
                millisecond: ticks[0].getMilliseconds() > 0
            };
        }

        resultFormat = this.getDateFormatByDifferences(maxDiff);
        return resultFormat;
    },

    getDateFormatByTickInterval: function(startValue, endValue, tickInterval) {
        let resultFormat;
        let dateDifferences;
        let dateUnitInterval;
        const dateDifferencesConverter = { week: 'day' };
        const correctDateDifferences = function(dateDifferences, tickInterval, value) {
            switch(tickInterval) {
                case 'year':
                case 'quarter':
                    dateDifferences.month = value;
                    /* falls through */
                case 'month':
                    dateDifferences.day = value;
                    /* falls through */
                case 'week':
                case 'day':
                    dateDifferences.hour = value;
                    /* falls through */
                case 'hour':
                    dateDifferences.minute = value;
                    /* falls through */
                case 'minute':
                    dateDifferences.second = value;
                    /* falls through */
                case 'second':
                    dateDifferences.millisecond = value;
            }
        };
        const correctDifferencesByMaxDate = function(differences, minDate, maxDate) {
            if(!maxDate.getMilliseconds() && maxDate.getSeconds()) {
                if(maxDate.getSeconds() - minDate.getSeconds() === 1) {
                    differences.millisecond = true;
                    differences.second = false;
                }
            } else if(!maxDate.getSeconds() && maxDate.getMinutes()) {
                if(maxDate.getMinutes() - minDate.getMinutes() === 1) {
                    differences.second = true;
                    differences.minute = false;
                }
            } else if(!maxDate.getMinutes() && maxDate.getHours()) {
                if(maxDate.getHours() - minDate.getHours() === 1) {
                    differences.minute = true;
                    differences.hour = false;
                }
            } else if(!maxDate.getHours() && maxDate.getDate() > 1) {
                if(maxDate.getDate() - minDate.getDate() === 1) {
                    differences.hour = true;
                    differences.day = false;
                }
            } else if(maxDate.getDate() === 1 && maxDate.getMonth()) {
                if(maxDate.getMonth() - minDate.getMonth() === 1) {
                    differences.day = true;
                    differences.month = false;
                }
            } else if(!maxDate.getMonth() && maxDate.getFullYear()) {
                if(maxDate.getFullYear() - minDate.getFullYear() === 1) {
                    differences.month = true;
                    differences.year = false;
                }
            }
        };
        tickInterval = typeUtils.isString(tickInterval) ? tickInterval.toLowerCase() : tickInterval;
        dateDifferences = dateUtils.getDatesDifferences(startValue, endValue);

        if(startValue !== endValue) {
            correctDifferencesByMaxDate(dateDifferences, startValue > endValue ? endValue : startValue, startValue > endValue ? startValue : endValue);
        }

        dateUnitInterval = dateUtils.getDateUnitInterval(dateDifferences);
        correctDateDifferences(dateDifferences, dateUnitInterval, true);


        dateUnitInterval = dateUtils.getDateUnitInterval(tickInterval || 'second');
        correctDateDifferences(dateDifferences, dateUnitInterval, false);

        dateDifferences[dateDifferencesConverter[dateUnitInterval] || dateUnitInterval] = true;

        resultFormat = this.getDateFormatByDifferences(dateDifferences);
        return resultFormat;
    }
});
