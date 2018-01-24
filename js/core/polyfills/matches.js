"use strict";

var window = require("../utils/window").getWindow(),
    callOnce = require("../utils/call_once");
var matches,
    setMatches = callOnce(function() {
        matches = window.Element.prototype.matches ||
            window.Element.prototype.matchesSelector ||
            window.Element.prototype.mozMatchesSelector ||
            window.Element.prototype.msMatchesSelector ||
            window.Element.prototype.oMatchesSelector ||
            window.Element.prototype.webkitMatchesSelector ||
            function(selector) {
                var items = (this.document || this.ownerDocument).querySelectorAll(selector);

                for(var i = 0; i < items.length; i++) {
                    if(items[i] === this) {
                        return true;
                    }
                }
            };
    });

module.exports = function(element, selector) {
    setMatches();

    return matches.call(element, selector);
};
