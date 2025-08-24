export interface BookingFormData {
  dates: (Date | null)[];
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  roomType: string | undefined;
  mealPlan: string | undefined;
  additionalRequest: string;
}

export interface FormProps {
  formData: BookingFormData;
  validationGroup?: string;
}
