import { CSSAttributes } from '@devextreme-generator/declarations';
import { addToStyles } from '../../workspaces/utils';
import { OverflowIndicatorViewModel } from '../types';

export const getOverflowIndicatorStyles = (
  viewModel: OverflowIndicatorViewModel,
): CSSAttributes => {
  const {
    color,
    geometry: {
      left,
      top,
      width,
      height,
    },
  } = viewModel;

  let result = addToStyles([{
    attr: 'left',
    value: `${left}px`,
  }, {
    attr: 'top',
    value: `${top}px`,
  }, {
    attr: 'width',
    value: `${width}px`,
  }, {
    attr: 'height',
    value: `${height}px`,
  }]);

  if (color) {
    result = addToStyles([{
      attr: 'backgroundColor',
      value: color,
    }, {
      attr: 'boxShadow',
      value: `inset ${width}px 0 0 0 rgba(0, 0, 0, 0.3)`,
    }], result);
  }

  return result;
};

export const getOverflowIndicatorColor = (color: string, colors: string[]): string | undefined => (
  !colors.length || colors.filter((item) => item !== color).length === 0
    ? color
    : undefined
);
