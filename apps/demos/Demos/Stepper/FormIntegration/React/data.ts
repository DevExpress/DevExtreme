import type { IItemProps } from 'devextreme-react/stepper'
import type { BookingFormData } from './types';

export const initialSteps: IItemProps[] = [
  {
    title: 'Dates', hint: 'Dates', icon: 'daterangepicker',
  },
  {
    title: 'Guests', hint: 'Guests', icon: 'group',
  },
  {
    title: 'Room and Meal Plan', hint: 'Room and Meal Plan', icon: 'servicebell',
  },
  {
    title: 'Additional Requests', hint: 'Additional Requests', icon: 'clipboardtasklist', optional: true,
  },
  {
    title: 'Confirmation', hint: 'Confirmation', icon: 'checkmarkcircle',
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
