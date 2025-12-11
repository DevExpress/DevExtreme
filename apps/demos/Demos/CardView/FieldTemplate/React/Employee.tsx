import React, { useMemo } from 'react';

import { employees } from './data.ts';
import type { Employee } from './data.ts';

interface EmployeeProps {
  employeeID: number;
}

const EmployeeComponent = ({ employeeID }: EmployeeProps) => {
  const employee = useMemo<Employee>(
    () => employees.find((e: Employee) => e.ID === employeeID),
    [employeeID]
  );

  return <button className='task__link-button'>{ employee.Name }</button>;
};

export default EmployeeComponent;
