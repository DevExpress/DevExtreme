import { Translator2D } from '../../../viz/translators/translator2d';
import { noop } from '../../../core/utils/common';
import { isFunction } from '../../../core/utils/type';
import {
  CustomizeTooltipFn, Font, CustomizedOptions, TooltipData,
  Translator,
} from '../common/types';

import { ArgumentAxisRange, ValueAxisRange } from './types';

const DEFAULT_LINE_SPACING = 2;

export interface Axis {
  getTranslator: () => Translator;
  update: (range: ArgumentAxisRange | ValueAxisRange, canvas: ClientRect, options: undefined)
  => void;
  getVisibleArea: () => [number, number];
  visualRange: () => void;
  calculateInterval: () => void;
  getMarginOptions: () => Record<string, number>;
}

export interface SparklineTooltipData extends TooltipData {
  originalTarget?: number;
  target?: string;
  valueTexts?: string | (string | undefined)[];
}

export const createAxis = (isHorizontal: boolean): Axis => {
  const translator = new Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal,
  });

  return {
    getTranslator: (): Translator => translator,
    update: (range, canvas, options): void => translator.update(range, canvas, options),
    getVisibleArea: (): [number, number] => {
      const visibleArea = translator.getCanvasVisibleArea();
      return [visibleArea.min as number, visibleArea.max as number];
    },
    visualRange: noop,
    calculateInterval: noop,
    getMarginOptions: (): Record<string, never> => ({}),
  };
};

const generateDefaultCustomizeTooltipCallback = (
  fontOptions?: Font,
  rtlEnabled?: boolean,
): CustomizeTooltipFn => {
  const { lineSpacing, size } = fontOptions ?? { };
  const lineHeight = (lineSpacing ?? DEFAULT_LINE_SPACING) + (size ?? 0);

  return (customizeObject: SparklineTooltipData): CustomizedOptions => {
    let html = '';
    const vt = customizeObject.valueTexts ?? [];
    for (let i = 0; i < vt.length; i += 2) {
      html += `<tr><td>${vt[i]}</td><td style='width: 15px'></td><td style='text-align: ${rtlEnabled ? 'left' : 'right'}'>${vt[i + 1]}</td></tr>`;
    }

    return { html: `<table style='border-spacing:0px; line-height: ${lineHeight}px'>${html}</table>` };
  };
};

export const generateCustomizeTooltipCallback = (
  customizeTooltip?: CustomizeTooltipFn,
  fontOptions?: Font,
  rtlEnabled?: boolean,
): CustomizeTooltipFn => {
  const defaultCustomizeTooltip = generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled);

  if (isFunction(customizeTooltip)) {
    return (customizeObject: SparklineTooltipData): CustomizedOptions => {
      let res = customizeTooltip.call(
        customizeObject,
        customizeObject as Record<string, unknown>,
      ) ?? { };
      if (!('html' in res) && !('text' in res)) {
        res = {
          ...res,
          ...defaultCustomizeTooltip.call(
            customizeObject,
            customizeObject as Record<string, unknown>,
          ),
        };
      }
      return res;
    };
  }

  return defaultCustomizeTooltip;
};
