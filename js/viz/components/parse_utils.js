const noop = require('../../core/utils/common').noop;
const dateSerialization = require('../../core/utils/date_serialization');
const isDefined = require('../../core/utils/type').isDefined;
const parsers = {
    string: function(val) {
        return isDefined(val) ? ('' + val) : val;
    },

    numeric: function(val) {
        if(!isDefined(val)) {
            return val;
        }

        let parsedVal = Number(val);
        if(isNaN(parsedVal)) {
            parsedVal = undefined;
        }
        return parsedVal;
    },

    datetime: function(val) {
        if(!isDefined(val)) {
            return val;
        }

        let parsedVal;
        const numVal = Number(val);
        if(!isNaN(numVal)) {
            parsedVal = new Date(numVal);
        } else {
            parsedVal = dateSerialization.deserializeDate(val);
        }
        if(isNaN(Number(parsedVal))) {
            parsedVal = undefined;
        }
        return parsedVal;
    }
};

function correctValueType(type) {
    return (type === 'numeric' || type === 'datetime' || type === 'string') ? type : '';
}

module.exports = {
    correctValueType: correctValueType,

    getParser: function(valueType) {
        return parsers[correctValueType(valueType)] || noop;
    }
};

///#DEBUG
module.exports.parsers = parsers;
///#ENDDEBUG
