"use strict";

var dateParser = require("../../localization/ldml/date.parser"),
    escapeRegExp = require("../../core/utils/common").escapeRegExp;

var getSelectionByPosition = function(text, format, position) {
    var regExpInfo = dateParser.getRegExpInfo(format),
        result = regExpInfo.regexp.exec(text);

    var start = 0, end = 0;
    for(var i = 1; i < result.length; i++) {
        start = end;
        end = start + result[i].length;

        var isStubPattern = regExpInfo.patterns[i - 1] === escapeRegExp(result[i]),
            caretInGroup = end >= position;

        if(!isStubPattern && caretInGroup) {
            return { start: start, end: end };
        }
    }

    return { start: 0, end: 0 };
};

exports.getSelectionByPosition = getSelectionByPosition;
