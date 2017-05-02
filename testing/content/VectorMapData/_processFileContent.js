"use strict";

module.exports = function(content, name) {
    return "test.namespace." + name + " = " + content + ";";
};
