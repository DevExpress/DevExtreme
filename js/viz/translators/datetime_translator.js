import dateUtils from '../../core/utils/date';
function parse(value) {
    return value !== null ? new Date(value) : value;
}

export default {
    fromValue: parse,

    toValue: parse,

    _add: dateUtils.addDateInterval,

    convert: dateUtils.dateToMilliseconds,
};
