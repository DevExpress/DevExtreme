"use strict";

var proto = require("./tree_map.base").prototype,

    common = require("./common"),

    _eventData = require("../../events/utils").eventData,
    _parseScalar = require("../core/utils").parseScalar,

    clickEventName = require("../../events/click").name,
    downPointerEventName = require("../../events/pointer").down,
    movePointerEventName = require("../../events/pointer").move,
    $ = require("jquery"),
    $doc = $(document),

    DATA_KEY_BASE = "__treemap_data_",
    dataKeyModifier = 0;

require("./api");
require("./hover");
require("./tooltip");

proto._eventsMap.onClick = { name: "click" };

common.expand(proto, "_initCore", function() {
    var that = this,
        dataKey = DATA_KEY_BASE + dataKeyModifier++;

    that._tracker = new Tracker({
        widget: that,
        root: that._renderer.root,
        eventTrigger: that._eventTrigger,
        getData: function(e) {
            var target = e.target;
            return (target.tagName === "tspan" ? target.parentNode : target)[dataKey];
        },
        getProxy: function(index) {
            return that._nodes[index].proxy;
        },
        getCoords: function(e) {
            // TODO: Looks like "eventData" just returns e.pageX, e.pageY. Investigate and use just e.pageX, e.pageY is possible. Don't forget about touch.
            var data = _eventData(e),
                offset = that._renderer.getRootOffset();
            return [data.x - offset.left, data.y - offset.top];
        }
    });
    that._handlers.setTrackerData = function(node, element) {
        element.data(dataKey, node._id);
    };

    ///#DEBUG
    exports._TESTS_dataKey = dataKey;
    ///#ENDDEBUG
});

common.expand(proto, "_disposeCore", function() {
    this._tracker.dispose();
});

require("./tree_map.base").addChange({
    code: "INTERACT_WITH_GROUP",
    handler: function() {
        this._tracker.setOptions({ interactWithGroup: _parseScalar(this._getOption("interactWithGroup", true), false) });
    },
    isThemeDependent: true,
    isOptionChange: true,
    option: "interactWithGroup"
});

function Tracker(parameters) {
    this._options = {};
    this._initHandlers(parameters, this._options);
}

Tracker.prototype = {
    constructor: Tracker,

    _initHandlers: function(parameters, options) {
        parameters.getNode = function(id) {
            var proxy = parameters.getProxy(id);

            return options.interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
        };
        parameters.root.on(clickEventName, clickHandler);
        parameters.root.on(downPointerEventName, downHandler);
        $doc.on(downPointerEventName, downHandler);
        $doc.on(movePointerEventName, moveHandler);
        this._disposeHandlers = function() {
            parameters.root.off(clickEventName, clickHandler);
            parameters.root.off(downPointerEventName, downHandler);
            $doc.off(downPointerEventName, downHandler);
            $doc.off(movePointerEventName, moveHandler);
        };

        function clickHandler(e) {
            processClick(e, parameters);
        }

        // Previously "stopPropagation" was called from the "downHandler" - so event triggered on "root" is not then triggered on "document".
        // Unfortunately it occurred (during T396917) that on touch devices calling "stopPropagation" prevents the following "dxclick" event.
        // Generally I think it would be better to use only (dxpointerdown, dxpointermove, dxpointerup) events (of course click is then implemented manually).
        // But for now removing "stopPropagation" will suffice - it can be implemented faster and with less changes, there are no known drawbacks in it.
        // We use "stopPropagation" to prevent unexpected scrolling or zooming when widget has some own scrolling behavior and is located inside another widget
        // (like dxScrollable) with its own scrolling behavior - dxTreeMap does not have own scrolling behavior.
        var isRootDown = false;

        function downHandler(e) {
            if(isRootDown) {
                isRootDown = false;
            } else {
                if(parameters.getData(e) !== undefined) {
                    e.preventDefault();
                    isRootDown = true;
                }
                moveHandler(e);
            }
        }

        function moveHandler(e) {
            processHover(e, parameters);
            processTooltip(e, parameters);
        }
    },

    dispose: function() {
        this._disposeHandlers();
    },

    setOptions: function(options) {
        $.extend(this._options, options);
    }
};

function processClick(e, params) {
    var id = params.getData(e);

    if(id >= 0) {
        params.eventTrigger("click", {
            node: params.getNode(id),
            coords: params.getCoords(e),
            jQueryEvent: e
        });
    }
}

function processHover(e, params) {
    var id = params.getData(e);

    if(id >= 0) {
        params.getNode(id).setHover();
    } else {
        params.widget.clearHover();
    }
}

function processTooltip(e, params) {
    var id = params.getData(e),
        coords;

    if(id >= 0) {
        coords = _eventData(e);
        params.getNode(id).showTooltip([coords.x, coords.y]);
    } else {
        params.widget.hideTooltip();
    }
}
