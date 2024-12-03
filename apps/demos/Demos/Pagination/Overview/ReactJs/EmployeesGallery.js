import React from 'react';
import EmployeeCard from './EmployeeCard.js';

const EmployeeGallery = ({ employees, pageSize, pageIndex }) => {
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
