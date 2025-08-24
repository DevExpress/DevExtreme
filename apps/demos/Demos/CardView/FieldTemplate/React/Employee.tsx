import React, { useMemo } from 'react';
import { Employee, employees } from './data.ts';

interface EmployeeProps {
  employeeID: number;
}

const Employee = ({ employeeID }: EmployeeProps) => {
  const employee = useMemo<Employee>(() => {
    return employees.find(e => e.ID === employeeID);
  }, [employeeID, employees]);
    
  return <button className='task__link-button'>{ employee.Name }</button>
}

export default Employee;
