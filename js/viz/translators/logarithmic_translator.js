var vizUtils = require('../core/utils'),
    isDefined = require('../../core/utils/type').isDefined,
    raiseTo = vizUtils.raiseToExt,
    getLog = vizUtils.getLogExt;

module.exports = {
    _fromValue: function(value) {
        return value !== null ? getLog(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
    },

    _toValue: function(value) {
        return value !== null ? raiseTo(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
    },

    getMinBarSize: function(minBarSize) {
        var visibleArea = this.getCanvasVisibleArea(),
            minValue = this.from(visibleArea.min + minBarSize),
            canvasOptions = this._canvasOptions;

        return Math.pow(canvasOptions.base, canvasOptions.rangeMinVisible + this._fromValue(this.from(visibleArea.min)) - this._fromValue(!isDefined(minValue) ? this.from(visibleArea.max) : minValue));
    },

    checkMinBarSize: function(initialValue, minShownValue, stackValue) {
        var canvasOptions = this._canvasOptions,
            prevValue = stackValue - initialValue,
            baseMethod = this.constructor.prototype.checkMinBarSize,
            minBarSize,
            updateValue;

        if(isDefined(minShownValue) && prevValue > 0) {
            minBarSize = baseMethod(this._fromValue(stackValue / prevValue), this._fromValue(minShownValue) - canvasOptions.rangeMinVisible);
            updateValue = Math.pow(canvasOptions.base, this._fromValue(prevValue) + minBarSize) - prevValue;
        } else {
            updateValue = baseMethod(initialValue, minShownValue);
        }

        return updateValue;
    }
};
