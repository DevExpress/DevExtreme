import { CSSAttributes } from '@devextreme-generator/declarations';
import { addToStyles } from '../workspaces/utils';
import { AppointmentGeometry, AppointmentViewModel } from './types';
import messageLocalization from '../../../../localization/message';
import dateLocalization from '../../../../localization/date';

const EditorLabelLocalizationConst = 'dxScheduler-editorLabelEndDate';

export const getAppointmentStyles = (
  viewModel: AppointmentViewModel,
): CSSAttributes | undefined => {
  const defaultSize = 50;
  const {
    geometry: {
      width,
      height,
      top,
      left,
    },
  } = viewModel;

  return addToStyles([{
    attr: 'height',
    value: `${height || defaultSize}px`,
  }, {
    attr: 'width',
    value: `${width || defaultSize}px`,
  }, {
    attr: 'top',
    value: `${top}px`,
  }, {
    attr: 'left',
    value: `${left}px`,
  }]);
};

export const getAppointmentKey = (geometry: AppointmentGeometry): string => {
  const {
    left,
    top,
    width,
    height,
  } = geometry;

  return `${left}-${top}-${width}-${height}`;
};

export const getReducedIconTooltipText = (endDate?: Date | string): string => {
  const tooltipLabel = messageLocalization.format(EditorLabelLocalizationConst);

  if (!endDate) {
    return tooltipLabel;
  }

  const date = new Date(endDate);
  const monthAndDay = dateLocalization.format(date, 'monthAndDay');
  const year = dateLocalization.format(date, 'year');

  return `${tooltipLabel}: ${monthAndDay}, ${year}`;
};

export const mergeStylesWithColor = (
  color: string | undefined,
  styles: CSSAttributes | undefined,
): CSSAttributes | undefined => (
  !color
    ? styles
    : addToStyles([{
      attr: 'backgroundColor',
      value: color,
    }], styles)
);
