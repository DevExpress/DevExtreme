import React from 'react';

const isWeekEnd = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const getCurrentTraining = (date, employeeID) => {
  const result = (date + employeeID) % 3;
  const currentTraining = `training-background-${result}`;

  return currentTraining;
};

const DataCell = (props) => {
  const { data: { startDate, groups: { employeeID }, text } } = props;

  const dayClasses = [
    'day-cell',
    getCurrentTraining(startDate.getDate(), employeeID),
  ];

  const employeeClasses = [`employee-${employeeID}`, 'dx-template-wrapper'];
  if (isWeekEnd(startDate)) {
    employeeClasses.push(`employee-weekend-${employeeID}`);
  }

  return (
    <div className={employeeClasses.join(' ')}>
      <div className={dayClasses.join(' ')}>
        {text}
      </div>
    </div>
  );
};

export default DataCell;
