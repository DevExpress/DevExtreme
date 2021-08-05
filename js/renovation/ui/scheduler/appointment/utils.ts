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

  return addToStyles([{
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
  }, {
    attr: 'backgroundColor',
    value: resourceColor,
  }]);
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
    info: {
      appointment: {
        startDate,
        endDate,
      },
      sourceAppointment: {
        groupIndex,
      },
    },
  } = item;

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const leftOffset = left + leftVirtualWidth;
  const topOffset = top + topVirtualHeight;

  return `${groupIndex}-${startTime}-${endTime}_${leftOffset}-${topOffset}-${width}-${height}`;
};
