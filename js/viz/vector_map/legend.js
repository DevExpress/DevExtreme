"use strict";

var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    _extend = extend,
    _each = $.each,
    legendModule = require("../components/legend"),
    _BaseLegend = legendModule.Legend;

// DEPRECATED_15_2
var sourceMap = {
    "areacolorgroups": { category: "areas", name: "color" },
    "markercolorgroups": { category: "markers", name: "color" },
    "markersizegroups": { category: "markers", name: "size" }
};
var unknownSource = { category: "UNKNOWN", name: "UNKNOWN" };

function parseSource(source) {
    var result;
    // DEPRECATED_15_2
    if(typeof source === "string") {
        result = sourceMap[source.toLowerCase()] || unknownSource;
    } else {
        result = { category: source.layer, name: source.grouping };
    }
    return result;
}

function buildData(partition, values, field) {
    var i,
        ii = values.length,
        list = [],
        item;
    for(i = 0; i < ii; ++i) {
        list[i] = item = {
            start: partition[i],
            end: partition[i + 1],
            index: i
        };
        item[field] = values[i];
        item.states = { normal: { fill: item.color } };
    }
    return list;
}

//'var' because JSHint throws W021 error
var Legend = function(parameters) {
    var that = this;
    that._params = parameters;
    that._root = parameters.renderer.g().attr({ "class": "dxm-legend" }).linkOn(parameters.container, { name: "legend", after: "legend-base" }).linkAppend();
    parameters.layoutControl.addItem(that);
    _BaseLegend.call(that, {
        renderer: parameters.renderer,
        group: that._root,
        backgroundClass: null,
        itemsGroupClass: null,
        textField: "text",
        getFormatObject: function(data) {
            return data;
        }
    });
    that._onDataChanged = function(data) {
        that._updateData(data);
    };
};

Legend.prototype = _extend(require("../../core/utils/object").clone(_BaseLegend.prototype), {
    constructor: Legend,

    dispose: function() {
        var that = this;
        that._params.layoutControl.removeItem(that);
        that._unbindData();
        that._root.linkRemove().linkOff();
        that._params = that._root = that._onDataChanged = null;
        return _BaseLegend.prototype.dispose.apply(that, arguments);
    },

    // This method is called only by the layout
    resize: function(size) {
        this._params.notifyDirty();
        if(size === null) {
            this.erase();
        } else {
            this.draw(size.width, size.height);
        }
        this._params.notifyReady();
    },

    locate: _BaseLegend.prototype.shift,

    _updateData: function(data) {
        this.update(data ? buildData(data.partition, data.values, this._dataName) : [], this._options);
        this.updateLayout();
    },

    _unbindData: function() {
        if(this._dataCategory) {
            this._params.dataExchanger.unbind(this._dataCategory, this._dataName, this._onDataChanged);
        }
    },

    _bindData: function(arg) {
        this._params.dataExchanger.bind(this._dataCategory = arg.category, this._dataName = arg.name, this._onDataChanged);
    },

    // The `_root` should be appended or removed here but there is no way to check if core.Legend is actually enabled or not
    setOptions: function(options) {
        var that = this;
        that.update(that._data, options);
        that._unbindData();
        that._bindData(options.source && parseSource(options.source) || unknownSource);
        that.updateLayout();
        return that;
    }
});

function LegendsControl(parameters) {
    this._params = parameters;
    this._items = [];
    parameters.container.virtualLink("legend-base");
}

LegendsControl.prototype = {
    constructor: LegendsControl,

    dispose: function() {
        _each(this._items, function(_, item) {
            item.dispose();
        });
        this._params = this._items = null;
    },

    setOptions: function(options) {
        var optionList = options && options.length ? options : [],
            items = this._items,
            i,
            ii = optionList.length,
            params = this._params,
            theme = params.themeManager.theme("legend");

        for(i = items.length; i < ii; ++i) {
            items[i] = new Legend(params);
        }
        for(i = items.length - 1; i >= ii; --i) {
            items[i].dispose();
            items.splice(i, 1);
        }
        params.layoutControl.suspend();
        for(i = 0; i < ii; ++i) {
            items[i].setOptions(_extend(true, {}, theme, optionList[i]));
        }
        params.layoutControl.resume();
    }
};

exports.LegendsControl = LegendsControl;

///#DEBUG
var originalLegend = Legend;
exports._TESTS_Legend = Legend;
exports._TESTS_stubLegendType = function(stub) {
    Legend = stub;
};
exports._TESTS_restoreLegendType = function() {
    Legend = originalLegend;
};
///#ENDDEBUG
