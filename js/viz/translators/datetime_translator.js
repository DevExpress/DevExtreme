function parse(value) {
    return value !== null ? new Date(value) : value;
}

module.exports = {
    _fromValue: parse,

    _toValue: parse,

    _add: require('../../core/utils/date').addDateInterval
};
