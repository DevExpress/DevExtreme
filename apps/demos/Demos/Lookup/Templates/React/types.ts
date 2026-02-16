export type Employee = {
  ID: number;
  FirstName: string;
  LastName: string;
  Prefix: string;
  Position: string;
  Picture: string;
  BirthDate: string;
  HireDate: string;
  Notes: string;
  Address: string;
};

export type EmployeeSearchField = keyof Employee;
