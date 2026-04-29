const steps = [
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

const roomTypes = ['Single', 'Double', 'Suite'];

const mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];

const initialFormData = {
  dates: [null, null],
  adultsCount: 0,
  childrenCount: 0,
  petsCount: 0,
  roomType: undefined,
  mealPlan: undefined,
  additionalRequest: '',
};

const getInitialFormData = () => ({
  ...initialFormData,
  dates: [...initialFormData.dates],
});
