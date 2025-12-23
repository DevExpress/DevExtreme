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
  State: string;
  City: string;
};

export type Task = {
  ID: number;
  Subject: string;
  StartDate: string;
  DueDate: string;
  Status: string;
  Priority: string;
  Completion: number;
  EmployeeID: number;
};
