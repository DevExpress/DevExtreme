export type Customer = {
  Email: string;
  Password: string;
  Name: string;
  Date: Date | null;
  VacationDates: (Date | null)[];
  Country: string;
  City: string | null;
  Address: string;
  Phone: string;
  Accepted: boolean;
};
