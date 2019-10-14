var typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    _isDefined = typeUtils.isDefined,
    _isDate = typeUtils.isDate,
    _isFunction = typeUtils.isFunction,
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
    range && extend(this, range);
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

        checkField("invert");
        checkField(axisTypeSelector);
        checkField("dataType");
        checkField("isSpacedMargin"),
        checkField("checkMinDataVisibility");
        checkField("checkMaxDataVisibility");

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

    isEmpty: function() {
        return (!_isDefined(this[minSelector]) || !_isDefined(this[maxSelector])) && (!this.categories || this.categories.length === 0);
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

    sortCategories(sort) {
        if(sort === false || !this.categories) {
            return;
        }

        if(Array.isArray(sort)) {
            const sortValues = sort.map(item => item.valueOf());
            const filteredSeriesCategories = this.categories.filter(item => sortValues.indexOf(item.valueOf()) === -1);
            this.categories = sort.concat(filteredSeriesCategories);
        } else {
            let notAFunction = !_isFunction(sort);

            if(notAFunction && this.dataType !== "string") {
                sort = (a, b) => a.valueOf() - b.valueOf();
            } else if(notAFunction) {
                sort = false;
            }
            sort && this.categories.sort(sort);
        }
    }
};
