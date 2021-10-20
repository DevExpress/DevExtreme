import { CSSAttributes } from '@devextreme-generator/declarations';
import { addToStyles } from '../workspaces/utils';
import { AppointmentViewModel } from './types';

export const getAppointmentStyles = (item: AppointmentViewModel): CSSAttributes => {
  const {
    geometry: {
      width,
      height,
      top,
      left,
    },
    info: {
      resourceColor,
    },
  } = item;

  let result = addToStyles([{
    attr: 'height',
    value: height || 50,
  }, {
    attr: 'width',
    value: width || 50,
  }, {
    attr: 'top',
    value: top,
  }, {
    attr: 'left',
    value: left,
  }]);

  if (resourceColor) {
    result = addToStyles([{
      attr: 'backgroundColor',
      value: resourceColor,
    }], result);
  }

  return result;
};

export const getAppointmentKey = (item: AppointmentViewModel): string => {
  const {
    geometry: {
      width,
      height,
      top,
      left,
      leftVirtualWidth,
      topVirtualHeight,
    },
  } = item;

  const leftOffset = left + leftVirtualWidth;
  const topOffset = top + topVirtualHeight;

  return `${leftOffset}-${topOffset}-${width}-${height}`;
};
