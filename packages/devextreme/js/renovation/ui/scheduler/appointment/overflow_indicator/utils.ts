import { CSSAttributes } from '@devextreme-generator/declarations';
import { IAppointmentContext } from '../../appointments_context';
import { addToStyles } from '../../workspaces/utils';
import { OverflowIndicatorViewModel } from '../types';
import { getAppointmentColor } from '../../resources/utils';

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
  }, {
    attr: 'boxShadow',
    value: `inset ${width}px 0 0 0 rgba(0, 0, 0, 0.3)`,
  }]);

  return result;
};

// TODO remove
export const getOverflowIndicatorColor = (color: string, colors: string[]): string | undefined => (
  !colors.length || colors.filter((item) => item !== color).length === 0
    ? color
    : undefined
);

export const getIndicatorColor = (
  appointmentContext: IAppointmentContext,
  viewModel: OverflowIndicatorViewModel,
  groups: string[],
): Promise<string> => {
  const groupIndex = viewModel.groupIndex ?? 0;
  const { appointment } = viewModel.items.settings[0];

  return getAppointmentColor({
    resources: appointmentContext.resources,
    resourceLoaderMap: appointmentContext.resourceLoaderMap,
    resourcesDataAccessors: appointmentContext.dataAccessors.resources,
    loadedResources: appointmentContext.loadedResources,
  }, {
    itemData: appointment,
    groupIndex,
    groups,
  });
};
