import type { IItemProps } from 'devextreme-react/stepper'
import type { FormData } from './types';

export const initialSteps: Array<IItemProps & { id: number }> = [
    { id: 0, title: 'Dates' },
    { id: 1, title: 'Guests' },
    { id: 2, title: 'Room and Meal Plan ' },
    { id: 3, title: 'Additional Requests', optional: true },
    { id: 4, title: 'Confirmation' },
];

export const formData: FormData = {
    dates: [null, null],
    adultsCount: 0,
    childrenCount: 0,
    roomType: undefined,
    mealPlan: undefined,
    additionalRequest: '',
};

export const roomTypes = ['Single', 'Double', 'Suite'];
export const mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];