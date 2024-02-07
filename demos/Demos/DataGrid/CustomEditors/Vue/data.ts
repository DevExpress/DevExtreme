export type Task = {
  ID: number;

  Subject: string;

  Status: number;

  Owner: number;

  AssignedEmployee: number[];

  OrderIndex: number;

  Priority: number;
};

export type Employee = {
  ID: number;

  FullName: string;

  Department: string;

  Title: string;
};

export type Status = {
  id: number;

  name: string;
};

export const statuses: Status[] = [{
  id: 1, name: 'Not Started',
}, {
  id: 2, name: 'In Progress',
}, {
  id: 3, name: 'Deferred',
}, {
  id: 4, name: 'Need Assistance',
}, {
  id: 5, name: 'Completed',
}];
