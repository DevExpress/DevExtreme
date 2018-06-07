"use strict";

var dateParser = require("../../localization/ldml/date.parser"),
    escapeRegExp = require("../../core/utils/common").escapeRegExp;

var renderDateParts = function(text, format) {
    var regExpInfo = dateParser.getRegExpInfo(format),
        result = regExpInfo.regexp.exec(text);

    var start = 0, end = 0, sections = [];
    for(var i = 1; i < result.length; i++) {
        start = end;
        end = start + result[i].length;

        var pattern = regExpInfo.patterns[i - 1];

        sections.push({
            index: i - 1,
            isStub: pattern === escapeRegExp(result[i]),
            caret: { start: start, end: end },
            pattern: pattern,
            text: result[i],
            setter: dateParser.getPatternSetter(pattern[0]),
            getter: dateParser.getPatternGetter(pattern[0])
        });
    }

    return sections;
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
