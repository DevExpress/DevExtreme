import { raiseToExt as raiseTo, getLogExt as getLog } from '../core/utils';
import { isDefined } from '../../core/utils/type';

export default {
    fromValue: function(value) {
        return value !== null ? getLog(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
    },

    toValue: function(value) {
        return value !== null ? raiseTo(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value;
    },

    getMinBarSize: function(minBarSize) {
        const visibleArea = this.getCanvasVisibleArea();
        const minValue = this.from(visibleArea.min + minBarSize);
        const canvasOptions = this._canvasOptions;

        return Math.pow(canvasOptions.base, canvasOptions.rangeMinVisible + this.fromValue(this.from(visibleArea.min)) - this.fromValue(!isDefined(minValue) ? this.from(visibleArea.max) : minValue));
    },

    checkMinBarSize: function(initialValue, minShownValue, stackValue) {
        const canvasOptions = this._canvasOptions;
        const prevValue = stackValue - initialValue;
        const baseMethod = this.constructor.prototype.checkMinBarSize;
        let minBarSize;
        let updateValue;

        if(isDefined(minShownValue) && prevValue > 0) {
            minBarSize = baseMethod(this.fromValue(stackValue / prevValue), this.fromValue(minShownValue) - canvasOptions.rangeMinVisible);
            updateValue = Math.pow(canvasOptions.base, this.fromValue(prevValue) + minBarSize) - prevValue;
        } else {
            updateValue = baseMethod(initialValue, minShownValue);
        }

        return updateValue;
    }
};
