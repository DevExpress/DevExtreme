import { CSSAttributes } from '@devextreme-generator/declarations';
import { addToStyles } from '../../workspaces/utils';
import { OverflowIndicatorViewModel } from '../types';

export const getOverflowIndicatorStyles = (
  viewModel: OverflowIndicatorViewModel,
): CSSAttributes => {
  const {
    geometry: {
      left,
      top,
      width,
      height,
    },
  } = viewModel;

  const result = addToStyles([{
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

  return result;
};
