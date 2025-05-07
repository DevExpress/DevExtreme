import React from 'react';
import { Employee } from './data';

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <div className="employees__card">
      <div className="employees__img-wrapper">
        <img
          className="employees__img"
          src={employee.Picture}
          alt={employee.FullName}
        />
      </div>
      <div className="employees__info">
        <div className="employees__info-row">
          <span className="employees__info-label">Full Name:</span>
          <span className="employees__info-value">{employee.FullName}</span>
        </div>

        <div className="employees__info-row">
          <span className="employees__info-label">Position:</span>
          <span className="employees__info-value">{employee.Title}</span>
        </div>

        <div className="employees__info-row">
          <span className="employees__info-label">Phone:</span>
          <span className="employees__info-value">{employee.MobilePhone}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
