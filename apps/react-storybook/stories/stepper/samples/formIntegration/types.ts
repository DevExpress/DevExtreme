export interface FormData {
    dates: [Date | null, Date | null];
    adultsCount: number;
    childrenCount: number;
    roomType: string | undefined;
    mealPlan: string | undefined;
    additionalRequest: string;
}
