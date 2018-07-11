"use strict";

var dateParser = require("../../localization/ldml/date.parser"),
    dateLocalization = require("../../localization/date"),
    extend = require("../../core/utils/extend").extend,
    noop = require("../../core/utils/common").noop,
    escapeRegExp = require("../../core/utils/common").escapeRegExp;

var PATTERN_GETTERS = {
    a: function(date) {
        return date.getHours() < 12 ? 0 : 1;
    },
    E: "getDay",
    y: "getFullYear",
    M: "getMonth",
    L: "getMonth",
    d: "getDate",
    H: "getHours",
    h: "getHours",
    m: "getMinutes",
    s: "getSeconds",
    S: "getMilliseconds"
};

var PATTERN_SETTERS = extend(dateParser.getPatternSetters(), {
    a: function(date, value) {
        var hours = date.getHours(),
            current = hours >= 12;

        if(current === value) {
            return;
        }

        date.setHours((hours + 12) % 24);
    },
    E: function(date, value) {
        if(value < 0) {
            return;
        }
        date.setDate(date.getDate() - date.getDay() + value);
    }
});

var getPatternGetter = function(patternChar) {
    var unsupportedCharGetter = function() {
        return patternChar;
    };

    return PATTERN_GETTERS[patternChar] || unsupportedCharGetter;
};

var renderDateParts = function(text, format) {
    var regExpInfo = dateParser.getRegExpInfo(format, dateLocalization),
        result = regExpInfo.regexp.exec(text);

    var start = 0, end = 0, sections = [];
    for(var i = 1; i < result.length; i++) {
        start = end;
        end = start + result[i].length;

        var pattern = regExpInfo.patterns[i - 1],
            getter = getPatternGetter(pattern[0]);

        sections.push({
            index: i - 1,
            isStub: pattern === escapeRegExp(result[i]),
            caret: { start: start, end: end },
            pattern: pattern,
            text: result[i],
            limits: getLimits.bind(this, getter),
            setter: PATTERN_SETTERS[pattern[0]] || noop,
            getter: getter
        });
    }

    return sections;
};

var getLimits = function(getter, date) {
    var limits = {
        "getFullYear": { min: 0, max: Infinity },
        "getMonth": { min: 0, max: 11 },
        "getDate": {
            min: 1,
            max: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        },
        "getDay": { min: 0, max: 6 },
        "getHours": { min: 0, max: 23 },
        "getMinutes": { min: 0, max: 59 },
        "getAmPm": { min: 0, max: 1 }
    };

    return limits[getter] || limits["getAmPm"];
};

var getDatePartIndexByPosition = function(dateParts, position) {
    for(var i = 0; i < dateParts.length; i++) {
        var caretInGroup = dateParts[i].caret.end >= position;

        if(!dateParts[i].isStub && caretInGroup) {
            return i;
        }
    }

    return null;
};

exports.getDatePartIndexByPosition = getDatePartIndexByPosition;
exports.renderDateParts = renderDateParts;
