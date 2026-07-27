export type ResizeDirection = 'vertical' | 'horizontal';

export type ReducedPart = 'head' | 'body' | 'tail' | undefined;

export interface GetResizableConfigOptions {
  direction: ResizeDirection;
  cellWidth: number;
  cellHeight: number;
  resizableStep: number;
  reduced: ReducedPart;
  isGroupedByDate: boolean;
  rtlEnabled: boolean;
}

export interface ResizableRule {
  handles: string;
  minWidth: number;
  minHeight: number;
  step: string;
  roundStepValue: boolean;
  stepPrecision?: string;
}

const HORIZONTAL_HANDLES = 'left right';
const VERTICAL_HANDLES = 'top bottom';

const getReducedHandles = (reduced: ReducedPart, rtlEnabled: boolean): string => {
  switch (reduced) {
    case 'head':
      return rtlEnabled ? 'right' : 'left';
    case 'tail':
      return rtlEnabled ? 'left' : 'right';
    case 'body':
      return '';
    default:
      return HORIZONTAL_HANDLES;
  }
};

const getHorizontalRule = (options: GetResizableConfigOptions): ResizableRule => ({
  handles: getReducedHandles(options.reduced, options.rtlEnabled),
  minWidth: options.cellWidth,
  minHeight: 0,
  step: String(options.resizableStep),
  roundStepValue: false,
});

const getVerticalRule = (options: GetResizableConfigOptions): ResizableRule => {
  const height = Math.round(options.cellHeight);

  return {
    handles: VERTICAL_HANDLES,
    minWidth: 0,
    minHeight: height,
    step: String(height),
    roundStepValue: true,
  };
};

export const getResizableConfig = (options: GetResizableConfigOptions): ResizableRule => {
  const rule = options.direction === 'vertical'
    ? getVerticalRule(options)
    : getHorizontalRule(options);

  if (!options.isGroupedByDate) {
    rule.stepPrecision = 'strict';
  }

  return rule;
};
