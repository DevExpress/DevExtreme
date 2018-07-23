"use strict";

import { getPatternSetters, getRegExpInfo } from "../../localization/ldml/date.parser";
import dateLocalization from "../../localization/date";
import { extend } from "../../core/utils/extend";
import { noop } from "../../core/utils/common";
import { escapeRegExp } from "../../core/utils/common";

const PATTERN_GETTERS = {
    a: (date) => date.getHours() < 12 ? 0 : 1,
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

const PATTERN_SETTERS = extend({}, getPatternSetters(), {
    a: (date, value) => {
        let hours = date.getHours(),
            current = hours >= 12;

        if(current === value) {
            return;
        }

        date.setHours((hours + 12) % 24);
    },
    E: (date, value) => {
        if(value < 0) {
            return;
        }
        date.setDate(date.getDate() - date.getDay() + value);
    }
});

const getPatternGetter = (patternChar) => {
    const unsupportedCharGetter = () => patternChar;
    return PATTERN_GETTERS[patternChar] || unsupportedCharGetter;
};

const renderDateParts = (text, format) => {
    const regExpInfo = getRegExpInfo(format, dateLocalization),
        result = regExpInfo.regexp.exec(text);

    let start = 0,
        end = 0,
        sections = [];

    for(let i = 1; i < result.length; i++) {
        start = end;
        end = start + result[i].length;

        let pattern = regExpInfo.patterns[i - 1],
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

const getLimits = (getter, date) => {
    const limits = {
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

const getDatePartIndexByPosition = (dateParts, position) => {
    for(let i = 0; i < dateParts.length; i++) {
        let caretInGroup = dateParts[i].caret.end >= position;

        if(!dateParts[i].isStub && caretInGroup) {
            return i;
        }
    }

    return null;
};

export { getDatePartIndexByPosition, renderDateParts };
