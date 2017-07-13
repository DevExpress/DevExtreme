"use strict";

var matches = Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(selector) {
        var items = (this.document || this.ownerDocument).querySelectorAll(selector);

        for(var i = 0; i < items.length; i++) {
            if(items === this) {
                return true;
            }
        }
    };

module.exports = function(element, selector) {
    return matches.call(element, selector);
};
