import React from 'react';

export default function CustomShapeTemplate(employee, editEmployee, deleteEmployee) {
  var employeeName = employee ? employee.Full_Name : 'Employee\'s Name';
  var employeeTitle = employee ? employee.Title : 'Employee\'s Title';
  return (
    <svg className="template">
      <text className="template-name" x="50%" y="20%">{employeeName}</text>
      <text className="template-title" x="50%" y="45%">{employeeTitle}</text>
      <text className="template-button" x="40%" y="85%" onClick={editEmployee}>Edit</text>
      <text className="template-button" x="62%" y="85%" onClick={deleteEmployee}>Delete</text>
    </svg>
  );
}
