/* eslint-disable @typescript-eslint/init-declarations */

import { isDefined } from '@ts/core/utils/type';
import {
  getLogExt as getLog,
  raiseToExt as raiseTo,
} from '@ts/viz/core/utils';
import type { Translator2DInstance } from '@ts/viz/translators/translator2d';

type LogarithmicTranslator = Translator2DInstance & {
  _canvasOptions: { base: number };
};

export default {
  fromValue(this: LogarithmicTranslator, value: number | null): number | null {
    return value !== null
      ? getLog(
        value,
        this._canvasOptions.base,
        this._businessRange.allowNegatives,
        this._businessRange.linearThreshold,
      )
      : value;
  },

  toValue(this: LogarithmicTranslator, value: number | null): number | null {
    return value !== null
      ? raiseTo(
        value,
        this._canvasOptions.base,
        this._businessRange.allowNegatives,
        this._businessRange.linearThreshold,
      )
      : value;
  },

  getMinBarSize(this: LogarithmicTranslator, minBarSize: number): number {
    const visibleArea = this.getCanvasVisibleArea();
    const minValue = this.from(visibleArea.min + minBarSize);
    const canvasOptions = this._canvasOptions;
    const startValue = this.fromValue(this.from(visibleArea.min));
    const endValue = this.fromValue(minValue ?? this.from(visibleArea.max));

    const value = Math.abs(startValue - endValue);

    return canvasOptions.base ** value;
  },

  checkMinBarSize(
    this: LogarithmicTranslator,
    initialValue: number,
    minShownValue: number,
    stackValue?: number,
  ): number {
    const canvasOptions = this._canvasOptions;
    const prevValue = stackValue ? stackValue - initialValue : 0;
    const baseMethod = this.constructor.prototype.checkMinBarSize;
    let minBarSize: number;
    let updateValue: number;

    if (isDefined(minShownValue) && prevValue > 0) {
      minBarSize = baseMethod(
        this.fromValue((stackValue as number) / prevValue),
        this.fromValue(minShownValue) - canvasOptions.rangeMinVisible,
      );
      updateValue = canvasOptions.base ** (this.fromValue(prevValue) + minBarSize) - prevValue;
    } else {
      updateValue = baseMethod(initialValue, minShownValue);
    }

    return updateValue;
  },
};
