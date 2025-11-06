import { type DxStepperTypes } from 'devextreme-vue/stepper';
import type { BookingFormData } from './types';

export const initialSteps: DxStepperTypes.Item[] = [
  {
    label: 'Dates', hint: 'Dates', icon: 'daterangepicker',
  },
  {
    label: 'Guests', hint: 'Guests', icon: 'group',
  },
  {
    label: 'Room and Meal Plan', hint: 'Room and Meal Plan', icon: 'servicebell',
  },
  {
    label: 'Additional Requests', hint: 'Additional Requests', icon: 'clipboardtasklist', optional: true,
  },
  {
    label: 'Confirmation', hint: 'Confirmation', icon: 'checkmarkcircle',
  },
];

export const roomTypes = ['Single', 'Double', 'Suite'];

export const mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];

export const initialFormData: BookingFormData = {
  dates: [null, null],
  adultsCount: 0,
  childrenCount: 0,
  petsCount: 0,
  roomType: undefined,
  mealPlan: undefined,
  additionalRequest: '',
};

export const getInitialSteps = () => initialSteps.map((item) => ({ ...item }));

export const getInitialFormData = () => ({
  ...initialFormData,
  dates: [...initialFormData.dates],
});
