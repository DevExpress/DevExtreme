export type Task = {
  ID: number;

  Subject: string;

  Status: number;

  Owner: number;

  AssignedEmployee: number;

  OrderIndex: number;

  Priority: number;
};

export type Employee = {
  ID: number;

  FullName: string;

  Department: string;

  Title: string;
};
