import { createContext, JSXTemplate } from '@devextreme-generator/declarations';
import {
  AppointmentClickData,
  AppointmentsViewModelType,
  AppointmentTemplateProps,
  OverflowIndicatorTemplateProps,
  ReducedIconHoverData,
} from './appointment/types';

export interface AppointmentsContextValue {
  viewModel: AppointmentsViewModelType;
  appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;
  overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;
  onAppointmentClick: (e: AppointmentClickData) => void;
  showReducedIconTooltip: (data: ReducedIconHoverData) => void;
  hideReducedIconTooltip: () => void;
}

export const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);
