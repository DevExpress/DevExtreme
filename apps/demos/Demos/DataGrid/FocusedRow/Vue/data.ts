export type Employee = {
  Employee_Full_Name: string;
};

export type Task = {
  Task_ID: number;

  ResponsibleEmployee: Employee;

  Task_Subject: string;

  Task_Start_Date: Date;

  Task_Status: string;

  Task_Description: string;

  Task_Completion: number;
};
