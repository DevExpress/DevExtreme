var map = require("./iterator").map;

var _normalize = function(text) {
    if(text === undefined || text === null) {
        return "";
    }
    return String(text);
};

var _upperCaseFirst = function(text) {
    return _normalize(text).charAt(0).toUpperCase() + text.substr(1);
};

var _chop = function(text) {
    return _normalize(text)
        .replace(/([a-z\d])([A-Z])/g, "$1 $2")
        .split(/[\s_-]+/);
};

var dasherize = function(text) {
    return map(_chop(text), function(p) { return p.toLowerCase(); }).join("-");
};

var underscore = function(text) {
    return dasherize(text).replace(/-/g, "_");
};

var camelize = function(text, upperFirst) {
    return map(_chop(text), function(p, i) {
        p = p.toLowerCase();
        if(upperFirst || i > 0) {
            p = _upperCaseFirst(p);
        }
        return p;
    }).join("");
};

var humanize = function(text) {
    return _upperCaseFirst(dasherize(text).replace(/-/g, " "));
};

var titleize = function(text) {
    return map(_chop(text), function(p) {
        return _upperCaseFirst(p.toLowerCase());
    }).join(" ");
};

var DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

var captionize = function(name) {
    var captionList = [],
        i,
        char,
        isPrevCharNewWord = false,
        isNewWord = false;

    for(i = 0; i < name.length; i++) {
        char = name.charAt(i);
        isNewWord = (char === char.toUpperCase() && char !== "-" && char !== ")" && char !== "/") || (char in DIGIT_CHARS);
        if(char === "_" || char === ".") {
            char = " ";
            isNewWord = true;
        } else if(i === 0) {
            char = char.toUpperCase();
            isNewWord = true;
        } else if(!isPrevCharNewWord && isNewWord) {
            if(captionList.length > 0) {
                captionList.push(" ");
            }
        }
        captionList.push(char);
        isPrevCharNewWord = isNewWord;
    }
    return captionList.join("");
};

exports.dasherize = dasherize;
exports.camelize = camelize;
exports.humanize = humanize;
exports.titleize = titleize;
exports.underscore = underscore;
exports.captionize = captionize;
