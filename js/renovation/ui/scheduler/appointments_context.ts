import { createContext, JSXTemplate } from '@devextreme-generator/declarations';
import {
  AppointmentClickData,
  AppointmentKindType,
  AppointmentsViewModelType,
  AppointmentTemplateProps,
  OverflowIndicatorTemplateProps,
  ReducedIconHoverData,
} from './appointment/types';
import { ResourceProps } from './props';
import { ResourceMapType } from './resources/utils';
import { DataAccessorType } from './types';
import { Group } from './workspaces/types';

export interface IAppointmentContext {
  viewModel: AppointmentsViewModelType;
  groups: string[];
  resources: ResourceProps[];
  dataAccessors: DataAccessorType;
  loadedResources?: Group[];
  resourceLoaderMap: ResourceMapType;
  appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;
  overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;
  onAppointmentClick: (e: AppointmentClickData) => void;
  onAppointmentDoubleClick: (e: AppointmentClickData) => void;
  showReducedIconTooltip: (data: ReducedIconHoverData) => void;
  hideReducedIconTooltip: () => void;
  updateFocusedAppointment: (
    type: AppointmentKindType,
    appointmentIndex: number,
  ) => void;
}

export const AppointmentsContext = createContext<IAppointmentContext | undefined>(undefined);
