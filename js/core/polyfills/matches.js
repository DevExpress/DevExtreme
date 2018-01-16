"use strict";

var window = require("../dom_adapter").getWindow();
var matches,
    getMatches = function() {
        return window.Element.prototype.matches ||
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
    };

module.exports = function(element, selector) {
    matches = matches ? matches : getMatches();

    return matches.call(element, selector);
};
