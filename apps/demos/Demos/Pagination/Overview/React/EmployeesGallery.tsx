import React from 'react';
import EmployeeCard from './EmployeeCard.tsx';
import { Employee } from './data';

interface EmployeeGalleryProps {
  employees: Employee[];
  pageSize: number;
  pageIndex: number;
}

const EmployeeGallery = ({ employees, pageSize, pageIndex }: EmployeeGalleryProps) => {
  const cardsNumber = pageSize === 4 ? 'employees--forth' : 'employees--six';
  const pageEmployees = employees.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  return (
    <div className={`employees ${cardsNumber}`}>
      {pageEmployees.map((employee) => (
        <EmployeeCard
          key={employee.ID}
          employee={employee}
        />
      ))}
    </div>
  );
};

export default EmployeeGallery;
