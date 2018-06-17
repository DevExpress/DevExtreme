"use strict";

var proto = require("./sankey").prototype,
    Tracker = require("../components/tracker").Tracker,
    DATA_KEY_BASE = "__sankey_data_",
    dataKeyModifier = 0;

proto._eventsMap.onItemClick = { name: "itemClick" };

exports.plugin = {
    name: "tracker",
    init: function() {
        var that = this,
            dataKey = DATA_KEY_BASE + dataKeyModifier++;

        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e) {
                var target = e.target;
                return target[dataKey];
            },
            getNode: function(index) {
                if(index < that._nodes.length) {
                    return that._nodes[index];
                } else {
                    return that._links[index - that._nodes.length];
                }
            },
            click: function(e) {
                that._eventTrigger("itemClick", {
                    item: e.node,
                    event: e.event
                });
            }
        });

        ///#DEBUG
        exports._TESTS_dataKey = dataKey;
        ///#ENDDEBUG

        this._dataKey = dataKey;
    },
    dispose: function() {
        this._tracker.dispose();
    },
    extenders: {
        _change_LINKS_DRAW: function() {
            var dataKey = this._dataKey;
            this._nodes.concat(this._links).forEach(function(item, index) {
                item.element.data(dataKey, index);
            });
        },
    }
};

