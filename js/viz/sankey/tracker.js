"use strict";

var proto = require("./sankey").prototype,
    Tracker = require("../components/tracker").Tracker,
    DATA_KEY_BASE = "__sankey_data_",
    isDefined = require("../../core/utils/type").isDefined,
    dataKeyModifier = 0;

proto._eventsMap.onItemClick = { name: "itemClick" };

exports.plugin = {
    name: "tracker",
    init: function() {
        var that = this,
            dataKey = DATA_KEY_BASE + dataKeyModifier++,
            getProxyData = function(e) {
                var rootOffset = that._renderer.getRootOffset(),
                    x = Math.floor(e.pageX - rootOffset.left),
                    y = Math.floor(e.pageY - rootOffset.top);

                return that._hitTestTargets(x, y);
            };

        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e, tooltipData) {
                var target = e.target,
                    data = target[dataKey],
                    proxyData;
                if(isDefined(data)) {
                    return data;
                }
                proxyData = getProxyData(e);

                if(tooltipData && proxyData && proxyData.type !== "inside-label") {
                    return;
                }

                return proxyData && proxyData.id;
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

