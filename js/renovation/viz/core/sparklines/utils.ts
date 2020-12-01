import { Translator2D } from '../../../../viz/translators/translator2d';
import { noop } from '../../../../core/utils/common';
import { Canvas } from '../common/types.d';

export interface Axis {
  getTranslator: () => any;
  update: (range: any, canvas: Canvas, options: any) => void;
  getVisibleArea: () => [number, number];
  visualRange: () => void;
  calculateInterval: () => void;
  getMarginOptions: () => {};
}

export const createAxis = (isHorizontal: boolean): Axis => {
  const translator = new Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal,
  });

  return {
    getTranslator: (): any => translator,
    update: (range, canvas, options): void => translator.update(range, canvas, options),
    getVisibleArea: (): [number, number] => {
      const visibleArea = translator.getCanvasVisibleArea();
      return [visibleArea.min, visibleArea.max];
    },
    visualRange: noop,
    calculateInterval: noop,
    getMarginOptions: (): {} => ({}),
  };
};
