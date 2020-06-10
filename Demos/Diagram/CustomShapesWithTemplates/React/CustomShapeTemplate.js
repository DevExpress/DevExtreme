import React from 'react';

export default function CustomShapeTemplate(employee, showInfo) {
  return (
    <svg className="template">
      <text className="template-name" x="50%" y="20%">{employee.Full_Name}</text>
      <text className="template-title" x="50%" y="45%">{employee.Title}</text>
      <text className="template-button" x="50%" y="85%" onClick={showInfo}>Show Details</text>
    </svg>
  );
}
