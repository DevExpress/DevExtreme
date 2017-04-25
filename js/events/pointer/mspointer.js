"use strict";

var BaseStrategy = require("./base"),
    Observer = require("./observer"),
    extend = require("../../core/utils/extend").extend,
    onlyMSPointerSupport = !window.PointerEvent && window.MSPointerEvent;

var eventMap = {
    "dxpointerdown": onlyMSPointerSupport ? "MSPointerDown" : "pointerdown",
    "dxpointermove": onlyMSPointerSupport ? "MSPointerMove" : "pointermove",
    "dxpointerup": onlyMSPointerSupport ? "MSPointerUp" : "pointerup",
    "dxpointercancel": onlyMSPointerSupport ? "MSPointerCancel" : "pointercancel",
    "dxpointerover": onlyMSPointerSupport ? "MSPointerOver" : "pointerover",
    "dxpointerout": onlyMSPointerSupport ? "MSPointerOut" : "pointerout",
    "dxpointerenter": onlyMSPointerSupport ? "mouseenter" : "pointerenter",
    "dxpointerleave": onlyMSPointerSupport ? "mouseleave" : "pointerleave"
};

var observer;
var activated = false;
var activateStrategy = function() {
    if(activated) {
        return;
    }

    observer = new Observer(
        eventMap,
        function(a, b) { return a.pointerId === b.pointerId; },
        function(e) { if(e.isPrimary) observer.reset(); }
    );

    activated = true;
};

var MsPointerStrategy = BaseStrategy.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);

        activateStrategy();
    },

    _fireEvent: function(args) {
        return this.callBase(extend({
            pointers: observer.pointers(),
            pointerId: args.originalEvent.pointerId
        }, args));
    }

});
MsPointerStrategy.map = eventMap;
MsPointerStrategy.resetObserver = function() {
    observer.reset();
};


module.exports = MsPointerStrategy;
