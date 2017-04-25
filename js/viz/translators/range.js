"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    _isDefined = commonUtils.isDefined,
    _isDate = commonUtils.isDate,
    unique = require("../core/utils").unique,

    minSelector = "min",
    maxSelector = "max",
    minVisibleSelector = "minVisible",
    maxVisibleSelector = "maxVisible",
    baseSelector = "base",
    axisTypeSelector = "axisType",
    _Range;

function otherLessThan(thisValue, otherValue) {
    return otherValue < thisValue;
}

function otherGreaterThan(thisValue, otherValue) {
    return otherValue > thisValue;
}

function compareAndReplace(thisValue, otherValue, setValue, compare) {
    var otherValueDefined = _isDefined(otherValue);

    if(_isDefined(thisValue)) {
        if(otherValueDefined && compare(thisValue, otherValue)) {
            setValue(otherValue);
        }
    } else if(otherValueDefined) {
        setValue(otherValue);
    }
}

_Range = exports.Range = function(range) {
    range && $.extend(this, range);
};

_Range.prototype = {
    constructor: _Range,

    addRange: function(otherRange) {
        var that = this,
            categories = that.categories,
            otherCategories = otherRange.categories;

        var compareAndReplaceByField = function(field, compare) {
            compareAndReplace(that[field], otherRange[field], function(value) { that[field] = value; }, compare);
        };

        var controlValuesByVisibleBounds = function(valueField, visibleValueField, compare) {
            compareAndReplace(that[valueField], that[visibleValueField], function(value) { _isDefined(that[valueField]) && (that[valueField] = value); }, compare);
        };

        var checkField = function(field) {
            that[field] = that[field] || otherRange[field];
        };

        if(commonUtils.isDefined(otherRange.stick)) {
            that.stick = otherRange.stick;
        }

        checkField("addSpiderCategory");
        checkField("percentStick");
        checkField("minSpaceCorrection");
        checkField("maxSpaceCorrection");

        checkField("invert");
        checkField(axisTypeSelector);
        checkField("dataType");

        if(that[axisTypeSelector] === "logarithmic") {
            checkField(baseSelector);
        } else {
            that[baseSelector] = undefined;
        }


        compareAndReplaceByField(minSelector, otherLessThan);
        compareAndReplaceByField(maxSelector, otherGreaterThan);
        if(that[axisTypeSelector] === "discrete") {
            checkField(minVisibleSelector);
            checkField(maxVisibleSelector);
        } else {
            compareAndReplaceByField(minVisibleSelector, otherLessThan);
            compareAndReplaceByField(maxVisibleSelector, otherGreaterThan);
        }
        compareAndReplaceByField("interval", otherLessThan);

        controlValuesByVisibleBounds(minSelector, minVisibleSelector, otherLessThan);
        controlValuesByVisibleBounds(minSelector, maxVisibleSelector, otherLessThan);
        controlValuesByVisibleBounds(maxSelector, maxVisibleSelector, otherGreaterThan);
        controlValuesByVisibleBounds(maxSelector, minVisibleSelector, otherGreaterThan);

        if(categories === undefined) {
            that.categories = otherCategories;
        } else {
            that.categories = otherCategories ? unique(categories.concat(otherCategories)) : categories;
        }

        return that;
    },

    isDefined: function() {
        return (_isDefined(this[minSelector]) && _isDefined(this[maxSelector]) || (this.categories && this.categories.length));
    },

    setStubData: function(dataType) {
        var that = this,
            year = new Date().getFullYear() - 1,
            isDate = dataType === "datetime",
            axisType = that[axisTypeSelector],
            min = axisType === "logarithmic" ? 1 : 0;

        if(axisType === "discrete") {
            that.categories = isDate ? [new Date(year, 0, 1), new Date(year, 3, 1), new Date(year, 6, 1), new Date(year, 9, 1)] : ["0", "1", "2"];
        } else {
            that[minSelector] = isDate ? new Date(year, 0, 1) : min;
            that[maxSelector] = isDate ? new Date(year, 11, 31) : 10;
        }
        that.stubData = true;

        return that;
    },

    correctValueZeroLevel: function() {
        var that = this;

        if(that[axisTypeSelector] === "logarithmic" || _isDate(that[maxSelector]) || _isDate(that[minSelector])) {
            return that;
        }

        function setZeroLevel(min, max) {
            (that[min] < 0 && that[max] < 0) && (that[max] = 0);
            (that[min] > 0 && that[max] > 0) && (that[min] = 0);
        }

        setZeroLevel(minSelector, maxSelector);
        setZeroLevel(minVisibleSelector, maxVisibleSelector);
        return that;
    },

    sortCategories: function(arr) {
        var cat = this.categories,
            callback = (this.dataType === "datetime") ? function(item) {
                return cat.map(Number).indexOf(item.valueOf()) !== -1;
            } : function(item) {
                return cat.indexOf(item) !== -1;
            };
        arr && cat && (this.categories = arr.filter(callback));
    },

    //T170398
    checkZeroStick: function() {
        var that = this;
        if(that.min >= 0 && that.max >= 0) {
            that.minStickValue = 0;
        } else if(that.min <= 0 && that.max <= 0) {
            that.maxStickValue = 0;
        }
        return that;
    }
};
