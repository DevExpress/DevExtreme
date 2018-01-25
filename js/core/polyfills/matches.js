"use strict";

var domAdapter = require("../dom_adapter"),
    window = domAdapter.getWindow(),
    callOnce = require("../utils/common").callOnce;
var matches,
    setMatches = callOnce(function() {
        matches = window.Element.prototype.matches ||
            window.Element.prototype.matchesSelector ||
            window.Element.prototype.mozMatchesSelector ||
            window.Element.prototype.msMatchesSelector ||
            window.Element.prototype.oMatchesSelector ||
            window.Element.prototype.webkitMatchesSelector ||
            function(selector) {
                var items = domAdapter.querySelectorAll(this.document || this.ownerDocument, selector);

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
