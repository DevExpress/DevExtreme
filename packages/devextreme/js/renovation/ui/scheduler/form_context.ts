import { createContext } from '@devextreme-generator/declarations';
import { IAppointmentFormData } from './utils/editing/formData';

export interface IFormContext {
  formData: IAppointmentFormData;
}

export const FormContext = createContext<IFormContext | undefined>(undefined);
