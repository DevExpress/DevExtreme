const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const _extend = extend;
const _each = each;
const legendModule = require('../components/legend');
const _BaseLegend = legendModule.Legend;

const unknownSource = { category: 'UNKNOWN', name: 'UNKNOWN' };

function buildData(partition, values, field) {
    let i;
    const ii = values.length;
    const list = [];
    let item;
    for(i = 0; i < ii; ++i) {
        list[i] = item = {
            start: partition[i],
            end: partition[i + 1],
            index: i
        };
        item[field] = values[i];
        item.states = { normal: { fill: item.color } };
        item.visible = true;
    }
    return list;
}

// 'var' because JSHint throws W021 error
let Legend = function(parameters) {
    const that = this;
    that._params = parameters;
    that._root = parameters.renderer.g().attr({ 'class': 'dxm-legend' }).linkOn(parameters.container, { name: 'legend', after: 'legend-base' }).enableLinks().linkAppend();
    parameters.layoutControl.addItem(that);
    _BaseLegend.call(that, {
        renderer: parameters.renderer,
        widget: parameters.widget,
        group: that._root,
        backgroundClass: null,
        itemsGroupClass: null,
        textField: 'text',
        getFormatObject: function(data) {
            return data;
        }
    });
    that._onDataChanged = function(data) {
        that._updateData(data);
    };
};

Legend.prototype = _extend(require('../../core/utils/object').clone(_BaseLegend.prototype), {
    constructor: Legend,

    dispose: function() {
        const that = this;
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
        this._options.defaultColor = data && data.defaultColor;
        this.update(data ? buildData(data.partition, data.values, this._dataName) : [], this._options, this._params.themeManager.theme('legend').title);
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
        const that = this;
        that.update(that._data, options, this._params.themeManager.theme('legend').title);
        that._unbindData();
        const source = options.source;
        that._bindData(source ? { category: source.layer, name: source.grouping } : unknownSource);
        that.updateLayout();
        return that;
    }
});

function LegendsControl(parameters) {
    this._params = parameters;
    this._items = [];
    parameters.container.virtualLink('legend-base');
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
        const optionList = options && options.length ? options : [];
        const items = this._items;
        let i;
        const ii = optionList.length;
        const params = this._params;
        const theme = params.themeManager.theme('legend');

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
const originalLegend = Legend;
exports._TESTS_Legend = Legend;
exports._TESTS_stubLegendType = function(stub) {
    Legend = stub;
};
exports._TESTS_restoreLegendType = function() {
    Legend = originalLegend;
};
///#ENDDEBUG
